
// Define the nested category type
export type Category = {
  id: string;
  name: string;
  subcategories?: Category[];
};

// Define nested product categories
export const productCategories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    subcategories: [
      { id: "coffee", name: "Coffee" },
      { id: "tea", name: "Tea" },
      { 
        id: "juices", 
        name: "Juices",
        subcategories: [
          { id: "fresh-juices", name: "Fresh Juices" },
          { id: "concentrates", name: "Concentrates" }
        ]
      },
      { id: "soft-drinks", name: "Soft Drinks" }
    ]
  },
  {
    id: "baking",
    name: "Baking",
    subcategories: [
      { id: "flour", name: "Flour" },
      { id: "sugar", name: "Sugar" },
      { id: "baking-mixes", name: "Baking Mixes" }
    ]
  },
  {
    id: "meat",
    name: "Meat",
    subcategories: [
      { id: "beef", name: "Beef" },
      { id: "poultry", name: "Poultry" },
      { id: "pork", name: "Pork" }
    ]
  },
  {
    id: "dairy",
    name: "Dairy",
    subcategories: [
      { id: "milk", name: "Milk" },
      { id: "cheese", name: "Cheese" },
      { id: "yogurt", name: "Yogurt" }
    ]
  },
  {
    id: "condiments",
    name: "Condiments"
  },
  {
    id: "pasta",
    name: "Pasta"
  },
  {
    id: "produce",
    name: "Produce",
    subcategories: [
      { id: "fruits", name: "Fruits" },
      { id: "vegetables", name: "Vegetables" }
    ]
  },
  {
    id: "snacks",
    name: "Snacks"
  },
  {
    id: "canned-goods",
    name: "Canned Goods"
  },
  {
    id: "frozen-foods",
    name: "Frozen Foods"
  },
  {
    id: "cleaning",
    name: "Cleaning"
  },
  {
    id: "health-beauty",
    name: "Health & Beauty"
  },
  {
    id: "other",
    name: "Other"
  }
];

// Helper function to find a category by its full path
export const findCategoryByPath = (path: string): Category | undefined => {
  const segments = path.split('.');
  
  const findInCategories = (categories: Category[], depth: number): Category | undefined => {
    if (depth >= segments.length) return undefined;
    
    const currentSegment = segments[depth];
    const foundCategory = categories.find(cat => cat.id === currentSegment);
    
    if (!foundCategory) return undefined;
    if (depth === segments.length - 1) return foundCategory;
    if (!foundCategory.subcategories) return undefined;
    
    return findInCategories(foundCategory.subcategories, depth + 1);
  };
  
  return findInCategories(productCategories, 0);
};

// Get all selectable categories (those with no subcategories or the deepest ones)
export const getSelectableCategories = (): { path: string; category: Category }[] => {
  const result: { path: string; category: Category }[] = [];
  
  const traverse = (categories: Category[], currentPath: string = '') => {
    categories.forEach(category => {
      const path = currentPath ? `${currentPath}.${category.id}` : category.id;
      
      if (!category.subcategories || category.subcategories.length === 0) {
        result.push({ path, category });
      } else {
        traverse(category.subcategories, path);
      }
    });
  };
  
  traverse(productCategories);
  return result;
};

// Get a flat list of all selectable categories for simple display/selection
export const getSelectableCategoryOptions = (): { value: string; label: string }[] => {
  return getSelectableCategories().map(({ path, category }) => ({
    value: path,
    label: category.name
  }));
};
