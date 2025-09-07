
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getSelectableCategoryOptions } from "~/data/productCategories";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange
}) => {
  const [categoryOptions, setCategoryOptions] = useState<{value: string; label: string}[]>([]);
  
  useEffect(() => {
    setCategoryOptions(getSelectableCategoryOptions());
  }, []);

  return (
    <Select 
      onValueChange={onValueChange} 
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {categoryOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
