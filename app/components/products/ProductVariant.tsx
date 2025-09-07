
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";

export type VariantOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  options: VariantOption[];
  price: number;
  stock: number;
  barcode: string;
};

type ProductVariantProps = {
  variant: ProductVariant;
  onUpdate: (updatedVariant: ProductVariant) => void;
  onDelete: () => void;
  optionTypes: string[];
  isNewVariant?: boolean;
};

export const ProductVariant: React.FC<ProductVariantProps> = ({
  variant,
  onUpdate,
  onDelete,
  optionTypes,
  isNewVariant = false,
}) => {
  const updateOption = (optionName: string, value: string) => {
    const updatedOptions = variant.options.map((option) =>
      option.name === optionName ? { ...option, value } : option
    );
    onUpdate({ ...variant, options: updatedOptions });
  };

  const updatePrice = (value: string) => {
    const price = parseFloat(value) || 0;
    onUpdate({ ...variant, price });
  };

  const updateStock = (value: string) => {
    const stock = parseInt(value, 10) || 0;
    onUpdate({ ...variant, stock });
  };

  const updateBarcode = (value: string) => {
    onUpdate({ ...variant, barcode: value });
  };

  // Format variant title from options
  const getVariantTitle = () => {
    if (variant.options.length === 0) {
      return "Default Variant";
    }

    return variant.options
      .filter((option) => option.value.trim() !== "")
      .map((option) => `${option.name}: ${option.value}`)
      .join(", ");
  };

  return (
    <Card className="border">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0 bg-muted/30">
        <CardTitle className="text-sm font-medium">
          {isNewVariant ? "New Variant" : getVariantTitle() || "Unnamed Variant"}
        </CardTitle>
        {(optionTypes.length > 0 || !isNewVariant) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete variant</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionTypes.map((optionName) => {
            const option = variant.options.find(
              (opt) => opt.name === optionName
            );
            return (
              <div key={optionName}>
                <label className="text-sm font-medium mb-1 block">
                  {optionName}
                </label>
                <Input
                  value={option?.value || ""}
                  onChange={(e) => updateOption(optionName, e.target.value)}
                  placeholder={`Enter ${optionName.toLowerCase()}`}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Price</label>
            <Input
              type="number"
              value={variant.price}
              onChange={(e) => updatePrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Stock</label>
            <Input
              type="number"
              value={variant.stock}
              onChange={(e) => updateStock(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Barcode</label>
            <Input
              value={variant.barcode}
              onChange={(e) => updateBarcode(e.target.value)}
              placeholder="Enter barcode"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
