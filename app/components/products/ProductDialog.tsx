
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Image, Barcode } from "lucide-react";
import { ProductVariantOptions } from "~/components/products/ProductVariantOptions";
import { v4 as uuidv4 } from "uuid";

const productCategories = [
  "Beverages",
  "Baking",
  "Meat",
  "Dairy",
  "Condiments",
  "Pasta",
  "Produce",
  "Snacks",
  "Canned Goods",
  "Frozen Foods",
  "Cleaning",
  "Health & Beauty",
  "Other",
];

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  price: z.coerce
    .number()
    .positive({
      message: "Price must be a positive number.",
    })
    .transform((val) => Number(val.toFixed(2))),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock must be a non-negative integer.",
  }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  barcode: z.string().optional(),
  hasVariants: z.boolean().default(false),
  optionTypes: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormValues) => void;
  defaultValues?: ProductFormValues;
  mode: "create" | "edit";
};

export function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: "",
    barcode: "",
    hasVariants: false,
    optionTypes: [],
  },
  mode,
}: ProductDialogProps) {
  const [optionTypes, setOptionTypes] = useState<string[]>(defaultValues.optionTypes || []);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  
  const hasVariants = form.watch("hasVariants");

  const handleSubmit = async (data: ProductFormValues) => {
    // Create product data with either variants or single default variant
    let productData: any = {
      ...data,
    };
    
    if (hasVariants) {
      // If product has variants, include the option types
      productData.optionTypes = optionTypes;
      
      // Reset stock and price as they'll be defined per variant
      productData.variants = [];
    } else {
      // For products without variants, create a single default variant
      productData.variants = [{
        id: uuidv4(),
        options: [],
        price: data.price,
        stock: data.stock,
        barcode: data.barcode || "",
      }];
    }
    
    onSubmit(productData);
    form.reset();
    onOpenChange(false);
    toast.success(
      mode === "create"
        ? "Product created successfully"
        : "Product updated successfully"
    );
  };

  React.useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      // Initialize option types if they exist
      if (defaultValues.optionTypes) {
        setOptionTypes(defaultValues.optionTypes);
      } else {
        setOptionTypes([]);
      }
    }
  }, [open, form, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {mode === "create" ? "create a new" : "update the"} product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Enter image URL" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Enter barcode" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasVariants"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Product Variants</FormLabel>
                      <FormDescription>
                        Enable this if your product comes in multiple variations (e.g., sizes, colors)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {hasVariants ? (
                <div className="col-span-2 border-t pt-4 mt-2">
                  <ProductVariantOptions
                    optionTypes={optionTypes}
                    onChange={setOptionTypes}
                  />
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      After creating the product, you'll be able to add specific variants with their own prices, stock levels, and barcodes.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create Product" : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
