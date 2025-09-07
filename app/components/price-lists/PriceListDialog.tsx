
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  priceListPrice?: number;
};

type Client = {
  id: string;
  name: string;
  email: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
});

type PriceListDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  priceList?: {
    id: string;
    name: string;
    description: string;
    products: Product[];
    clients: Client[];
  };
};

const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `P${i + 1}`,
  name: `Product ${i + 1}`,
  basePrice: Math.floor(Math.random() * 100) + 10,
}));

const mockClients = Array.from({ length: 15 }, (_, i) => ({
  id: `C${i + 1}`,
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
}));

export function PriceListDialog({ open, onOpenChange, priceList }: PriceListDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(priceList?.products || []);
  const [selectedClients, setSelectedClients] = useState<Client[]>(priceList?.clients || []);
  const [productSearch, setProductSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: priceList?.name || "",
      description: priceList?.description || "",
    },
  });

  const availableProducts = mockProducts.filter(
    (p) => !selectedProducts.find((sp) => sp.id === p.id) &&
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const availableClients = mockClients.filter(
    (c) => !selectedClients.find((sc) => sc.id === c.id) &&
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSave = (values: z.infer<typeof formSchema>) => {
    // Check if all products have prices configured
    const hasUnpricedProducts = selectedProducts.some(product => !product.priceListPrice);
    if (hasUnpricedProducts) {
      toast.error("Please set prices for all products before saving");
      return;
    }

    console.log(values, selectedProducts, selectedClients);
    if (onOpenChange) onOpenChange(false);
  };

  useEffect(() => {
    if (open && priceList) {
      form.reset({
        name: priceList.name,
        description: priceList.description,
      });
      setSelectedProducts(priceList.products);
      setSelectedClients(priceList.clients);
    } else if (!open) {
      form.reset({ name: "", description: "" });
      setSelectedProducts([]);
      setSelectedClients([]);
    }
  }, [open, priceList, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{priceList ? "Edit Price List" : "Create Price List"}</DialogTitle>
          <DialogDescription>
            Configure pricing and assign clients to this price list.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter price list name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter price list description" 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              {/* Active Products Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Active Products</h3>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-2 border rounded-md">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Base Price: ${product.basePrice}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="w-24"
                            value={product.priceListPrice || ""}
                            onChange={(e) => {
                              const newProducts = selectedProducts.map((p) =>
                                p.id === product.id
                                  ? { ...p, priceListPrice: Number(e.target.value) }
                                  : p
                              );
                              setSelectedProducts(newProducts);
                            }}
                            placeholder="Price"
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Add Products Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Add Products</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[200px] border rounded-md">
                  <div className="p-4 space-y-2">
                    {availableProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Base Price: ${product.basePrice}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedProducts([...selectedProducts, { ...product, priceListPrice: 0 }])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Active Clients Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Active Clients</h3>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <div className="space-y-2">
                    {selectedClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClients(selectedClients.filter((c) => c.id !== client.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Add Clients Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Add Clients</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[200px] border rounded-md">
                  <div className="p-4 space-y-2">
                    {availableClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedClients([...selectedClients, client])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {priceList ? "Save Changes" : "Create Price List"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
