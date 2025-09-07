
import React from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";
import { productCategories, Category } from "~/data/productCategories";

export type ProductFilterValues = {
  searchTerm: string;
  categories: string[];
  status: "all" | "in-stock" | "low-stock" | "out-of-stock";
  visibility: "all" | "published" | "unpublished";
  priceRange: {
    min: string;
    max: string;
  };
};

type ProductFiltersProps = {
  filters: ProductFilterValues;
  onFilterChange: (newFilters: ProductFilterValues) => void;
  onClearFilters: () => void;
  className?: string;
  showMobileView?: boolean;
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className,
  showMobileView = false,
}) => {
  const handleCategoryChange = (categoryPath: string, checked: boolean) => {
    const updatedCategories = checked 
      ? [...filters.categories, categoryPath]
      : filters.categories.filter(c => c !== categoryPath);
    
    onFilterChange({
      ...filters,
      categories: updatedCategories
    });
  };

  const handleInputChange = (key: keyof ProductFilterValues, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  // Recursive function to render nested categories
  const renderCategories = (categories: Category[], parentPath: string = '') => {
    return categories.map(category => {
      const currentPath = parentPath ? `${parentPath}.${category.id}` : category.id;
      const isLeaf = !category.subcategories || category.subcategories.length === 0;
      const isSelected = filters.categories.includes(currentPath);
      
      return (
        <div key={currentPath} className={`${parentPath ? 'ml-4' : ''}`}>
          <div className="flex items-center space-x-2 my-1">
            <Checkbox 
              id={`category-${currentPath}`}
              checked={isSelected}
              disabled={!isLeaf} // Only allow selection of leaf categories
              onCheckedChange={(checked) => 
                isLeaf && handleCategoryChange(currentPath, checked === true)
              }
              className={!isLeaf ? 'opacity-50' : ''}
            />
            <Label 
              htmlFor={`category-${currentPath}`}
              className={`text-sm cursor-pointer ${!isLeaf ? 'font-medium' : ''}`}
            >
              {category.name}
            </Label>
          </div>
          
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="border-l border-gray-200 pl-2 my-1">
              {renderCategories(category.subcategories, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {showMobileView && (
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={filters.searchTerm}
            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Category</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
            {renderCategories(productCategories)}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Status</h4>
          <RadioGroup 
            value={filters.status} 
            onValueChange={(value) => 
              handleInputChange("status", value as ProductFilterValues["status"])
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="text-sm cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-stock" id="status-in-stock" />
              <Label htmlFor="status-in-stock" className="text-sm cursor-pointer">In Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low-stock" id="status-low-stock" />
              <Label htmlFor="status-low-stock" className="text-sm cursor-pointer">Low Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="out-of-stock" id="status-out-of-stock" />
              <Label htmlFor="status-out-of-stock" className="text-sm cursor-pointer">Out of Stock</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Visibility</h4>
          <RadioGroup 
            value={filters.visibility}
            onValueChange={(value) => 
              handleInputChange("visibility", value as ProductFilterValues["visibility"])
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="visibility-all" />
              <Label htmlFor="visibility-all" className="text-sm cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="published" id="visibility-published" />
              <Label htmlFor="visibility-published" className="text-sm cursor-pointer">Published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unpublished" id="visibility-unpublished" />
              <Label htmlFor="visibility-unpublished" className="text-sm cursor-pointer">Unpublished</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Price Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="sr-only">
                Min Price
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="sr-only">
                Max Price
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
