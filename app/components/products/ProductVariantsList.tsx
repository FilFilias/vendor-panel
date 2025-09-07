
import React from "react";
import { ProductVariant } from "./ProductVariant";
import { ProductVariant as ProductVariantType } from "./ProductVariant";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

type ProductVariantsListProps = {
  variants: ProductVariantType[];
  optionTypes: string[];
  onVariantsChange: (variants: ProductVariantType[]) => void;
};

export const ProductVariantsList: React.FC<ProductVariantsListProps> = ({
  variants,
  optionTypes,
  onVariantsChange,
}) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const handleAddVariant = () => {
    // Instead of creating variant inline, navigate to the add variant page
    const currentProduct = {
      variants,
      optionTypes
    };
    
    navigate(`/products/variants/${productId}/add`, { 
      state: { product: currentProduct } 
    });
  };

  const handleUpdateVariant = (updatedVariant: ProductVariantType, index: number) => {
    const newVariants = [...variants];
    newVariants[index] = updatedVariant;
    onVariantsChange(newVariants);
  };

  const handleDeleteVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  return (
    <div className="space-y-4">
      {optionTypes.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Product Variants</h2>
          <Button 
            onClick={handleAddVariant}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </div>
      )}
      
      {variants.length === 0 && (
        <div className="text-center py-6 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground">No variants added.</p>
          {optionTypes.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Add a variant to create different options for this product.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              This product has no option types configured.
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <ProductVariant
            key={variant.id}
            variant={variant}
            onUpdate={(updatedVariant) => handleUpdateVariant(updatedVariant, index)}
            onDelete={() => handleDeleteVariant(index)}
            optionTypes={optionTypes}
          />
        ))}
      </div>
    </div>
  );
}
