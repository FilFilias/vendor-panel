import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { getVendorsProducts, getVendorsProductsByIds } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { ProductsListDesktop } from "~/components/products/ProductsListDesktop";
import { useState } from "react";
import { StoreVendorProduct } from "~/types/vendor";
import { DeleteProductDialog } from "~/components/products/DeleteProductDialog";
import { ProductsListHeader } from "~/components/products/ProductsListHeader";
import { ProductsListFilters } from "~/components/products/ProductsListFilters";
import { ProductsListMobile } from "~/components/products/ProductsListMobile";
import { sdk } from "~/lib/config";
import { UpdateProductStatusDialog } from "~/components/products/UpdateProductStatusDialog";
import { searchProducts } from "~/providers/search";
import { fetchCategories, flattenCategories, getDescendantIds, getProductCategories } from "~/providers/categories";
import { salesChannelCookie } from "~/lib/sales-channel-cookie";
import { CategoryList } from "~/components/products/Filters/CategoriesList";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const _action = body.get("_action");

  switch (_action) {
    case "update-status": {
      try {
        let result = await sdk.client.fetch(`/vendor/product/update-status/${body.get("id")}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          },
          body: {
            "status": body.get("status")
          },
        })
        return data(result);
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    case "delete-product": {
      try {
        let result = await sdk.client.fetch(`/vendor/product/delete/${body.get("id")}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          }
        })
        return data(result);
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    default:
      return data({ error: "Unknown action" }, { status: 400 });
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {

    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
    const salesChannelID = await salesChannelCookie.parse(request.headers.get("Cookie"));

    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let q = urlSearchParams.q
    let category = urlSearchParams.category
    let categoryIDs
    let selectedCategory
    const product_categories = await fetchCategories(salesChannelID)

    let categories = getProductCategories(product_categories)

    if (category) {
      const flattenedCategories = flattenCategories(product_categories, []);
      selectedCategory = flattenedCategories.find(
        (cat) => cat.id === category
      );
    
      if (selectedCategory) {
        categoryIDs = [selectedCategory.id,...getDescendantIds(selectedCategory.id,product_categories)]
      }
 
    }

    let products
    let totalPages
    let currentPage
    let total

    if (q) {
      let prods = await searchProducts(q,parseInt(page));

      products = prods.hits.map( hit => ({
        id:hit.id,
        title:hit.title,
        status:hit.status,
        image:hit.thumbnail
      }))
      totalPages = Math.ceil(prods.estimatedTotalHits / 15);
      currentPage = Math.floor(prods.offset / 15) + 1;    
      total = prods.estimatedTotalHits

    } 
    else {
      let {result,count,take,skip} = await getVendorsProducts(session.data["connect.sid"] as string,parseInt(page),categoryIDs,salesChannelID);
      products = result
      totalPages = Math.ceil(count / take);
      currentPage = Math.floor(skip / take) + 1;    
      total = count
    }


    let currentUrl = url.pathname
    let hasParams = false
    if (q) {
      currentUrl = currentUrl + '?q=' + q
      hasParams = true
    }
    if (urlSearchParams.category) {
      currentUrl = currentUrl + '?category=' + urlSearchParams.category
      hasParams = true
    }

    return data({categories,products,totalPages,currentPage,total,q,hasParams,currentUrl,selectedCategory})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function OrdersListPage() {
  
  let {products,currentPage,totalPages, total,hasParams,currentUrl,selectedCategory,categories} = useLoaderData()
  let {t} = useTranslation()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<StoreVendorProduct | null>(null);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [productToUpdateStatus, setProductToUpdateStatus] = useState<StoreVendorProduct | null>(null);

  const handleDeleteClick = (product: StoreVendorProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handlStatusUpdateClick = (product: StoreVendorProduct) => {
    setProductToUpdateStatus(product);
    setStatusUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <ProductsListHeader />
      <ProductsListFilters />
      <div>
        <div className="flex items-center justify-between  py-4 flex-wrap gap-4">
          <div className="flex items-center justify-start">
            { selectedCategory ? (
              <span className="text-neutral ">{t("total_products_category")} {selectedCategory.name}:</span> 
            ) : (
              <span className="text-neutral ">{t("total_products")}:</span> 
            )}
            <span className="font-semibold pl-2 dark:text-white ">{total}</span>
          </div>
          <CategoryList categories={categories} />
        </div>

        
        <ProductsListDesktop products={products} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handlStatusUpdateClick} />
        <ProductsListMobile products={products} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handlStatusUpdateClick} />
        <div className="flex justify-center pt-4">
            <PaginationComp
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={currentUrl}
              hasParams={hasParams}
            />
        </div>
      </div>
      {productToDelete && (
        <DeleteProductDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          product={productToDelete}
        />
      )}
      {productToUpdateStatus && (
        <UpdateProductStatusDialog
          open={statusUpdateDialogOpen}
          onOpenChange={setStatusUpdateDialogOpen}
          product={productToUpdateStatus}
        />
      )}
    </div>
  );
}