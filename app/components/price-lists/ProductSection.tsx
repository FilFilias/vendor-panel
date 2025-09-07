
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  priceListPrice?: number;
};

interface ProductSectionProps {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  productSearch?: string;
  setProductSearch?: (search: string) => void;
  mockProducts?: Product[];
}

export function ProductSection({
  selectedProducts,
  setSelectedProducts,
  productSearch = "",
  setProductSearch = () => {},
  mockProducts = [],
}: ProductSectionProps) {
  const filteredProducts = mockProducts.filter(
    (p) => !selectedProducts.find((sp) => sp.id === p.id) &&
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 overflow-hidden flex flex-col">
      <h3 className="font-semibold">Products</h3>
      <div className="flex items-center gap-2 maw-w-full overflow-x-hidden">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search products..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="text-black"
        />
      </div>

      <ScrollArea className="flex-1 border rounded-md">
        <div className="space-y-2 p-4">
          {selectedProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-md border p-2">
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">Base Price: ${product.basePrice}</p>
              </div>
              <Input
                type="number"
                placeholder="Custom price"
                className="w-32 text-black"
                value={product.priceListPrice || ""}
                onChange={(e) => {
                  const newProducts = selectedProducts.map((p) =>
                    p.id === product.id
                      ? { ...p, priceListPrice: Number(e.target.value) }
                      : p
                  );
                  setSelectedProducts(newProducts);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {filteredProducts.map((product) => (
            <Button
              key={product.id}
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedProducts([...selectedProducts, product])}
            >
              <Plus className="mr-2 h-4 w-4" />
              {product.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
