import { sdk } from "~/lib/config"
import { StoreProductCategory } from "@medusajs/types";

export const getCategoriesList = async () => {
    return await sdk.client.fetch(`/store/categories/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'x-publishable-api-key': import.meta.env.VITE_PUBLISHABLE_KEY
        }
    })
}

export const getProductCategories = (product_categories:StoreProductCategory[]) => {
    const roots = buildCategoryForest(product_categories)
    sortTreeByName(roots) // optional
  
    return roots
}

export function buildCategoryForest(input: StoreProductCategory[]): CategoryNode[] {
    const nodes = new Map<string, CategoryNode>()
    const parentOf = new Map<string, string | null>()
  
    const getParentId = (c: StoreProductCategory) =>
      c.parent_category_id ?? c.parent_category?.id ?? null
  
    const ensureNodeFrom = (c: Partial<StoreProductCategory> & { id: string }): CategoryNode => {
      const existing = nodes.get(c.id)
      if (existing) {
        if (c.name && !existing.name) existing.name = c.name
        if (c.handle && !existing.handle) existing.handle = c.handle
        return existing
      }
      const node: CategoryNode = {
        id: c.id,
        parent_category_id: c.parent_category_id,
        name: c.name,
        link: '/category' + c.handle,
        subCategories: [],
      }
      nodes.set(node.id, node)
      return node
    }
  
    const linkChain = (c: StoreProductCategory, seen = new Set<string>()) => {
      if (!c || !c.id || seen.has(c.id)) return
      seen.add(c.id)
  
      const child = ensureNodeFrom(c)
      const pid = getParentId(c)
      parentOf.set(child.id, pid ?? null)
  
      if (pid) {
        // Prefer rich parent object when present; otherwise create a stub
        const pObj = c.parent_category ?? ({ id: pid } as StoreProductCategory)
        const parent = ensureNodeFrom(pObj)
  
        // Prevent duplicate children
        if (!parent.subCategories.some((n) => n.id === child.id)) {
          parent.subCategories.push(child)
        }
  
        // Recurse upward if we have details about the parent’s parent
        if (pObj && (pObj.parent_category_id !== undefined || pObj.parent_category)) {
          linkChain(pObj, seen)
        }
      }
    }
  
    // Build up the graph
    for (const c of input) linkChain(c)
  
    // Collect roots
    const roots: CategoryNode[] = []
    for (const node of nodes.values()) {
      const pid = parentOf.get(node.id)
      if (!pid) roots.push(node)
    }
  
    return roots
}
  
  // Optional: alphabetical sort in-place
export function sortTreeByName(nodes: CategoryNode[]) {
    nodes.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    for (const n of nodes) sortTreeByName(n.subCategories)
}

type CategoryNode = {
    id: string
    parent_category_id?: string
    name?: string
    link?: string
    subCategories: CategoryNode[]
}

export const fetchCategories = async (salesChannelID:string) => {
    const categoryIDs = await sdk.client.fetch(`/store/categories/by-sales-channel/${salesChannelID}`)
  
    const {product_categories} = await sdk.store.category.list({
      id: categoryIDs,
      include_ancestors_tree: true,
      fields: "id,name,description,handle,metadata,parent_category",
    })
    return product_categories
}

/**
 * Return all descendant category IDs (children, grandchildren, …)
 * of the given root category id. Excludes the root id itself.
 */
export function getDescendantIds(rootId: string, categories:StoreProductCategory[]): string[] {
  const childrenMap = buildChildrenMap(categories)

  const out: string[] = []
  const seen = new Set<string>()
  const stack: string[] = [...(childrenMap.get(rootId) ?? [])]

  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
    const kids = childrenMap.get(id) ?? []
    for (const k of kids) {
      if (!seen.has(k)) stack.push(k)
    }
  }

  return out
}

/**
 * Build a parent->children adjacency map from mixed (nested or flat) categories
 */
function buildChildrenMap(categories:StoreProductCategory[]) {
  const children = new Map<string, string[]>()

  for (const c of categories) {
    const pid =
      c.parent_category_id ??
      (c.parent_category ? c.parent_category.id : null)

    if (pid) {
      if (!children.has(pid)) children.set(pid, [])
      children.get(pid)!.push(c.id)
    }
    // Ensure key exists even if no children (optional)
    if (!children.has(c.id)) children.set(c.id, [])
  }

  return children
}

export const flattenCategories = (categories:StoreProductCategory[], result = []) => {
  const seen = new Map()

  function collect(cat:StoreProductCategory) {
    if (!cat || seen.has(cat.id)) return
    seen.set(cat.id, { ...cat, parent_category: undefined }) // remove recursion
    if (cat.parent_category) {
      collect(cat.parent_category)
    }
  }

  for (const c of categories) {
    collect(c)
  }

  return Array.from(seen.values())
}