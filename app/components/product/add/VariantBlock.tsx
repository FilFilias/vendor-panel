import { ProductVariant } from "./ProductVariantForm"
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export const VariantBlock = ({variant}:{variant:ProductVariant}) => {
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variant.options.map((option) => (
                        <div className="space-y-2" key={option.name}>
                            <Label>{option.name}</Label>
                            <Input disabled name="value" defaultValue={option.value} />
                        </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input disabled name="sku" defaultValue={variant.sku} />
                </div>
                <div className="space-y-2">
                    <Label>Barcode</Label>
                    <Input disabled name="barcode" value={variant.barcode} />
                </div>
                <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input disabled name="stock" defaultValue={variant.stock} />
                </div>
                <div className="space-y-2" >
                    <Label>Price EUR</Label>
                    <div className="flex">
                        <Input disabled name="amount" defaultValue={variant.price} />
                    </div>
                </div>
            </div>
        </div>
    )
}