import { Input } from "~/components/ui/input";

export type ProductVariant = {
    options: {
        name: string;
        value: string;      
    }[];
    price: number;
    stock: number;
    barcode: string;  
    sku: string;
}

type AddProductVariantFormProps = {
    stateDefaultVariant: ProductVariant;
    setStateDefaultVariant: (k:ProductVariant) => void;

}

export const ProductDefaultVariant = ({setStateDefaultVariant,stateDefaultVariant}:AddProductVariantFormProps) => {

    return (
        <div className="dark:text-white grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
                <label className="text-sm font-medium mb-1 block">
                    Barcode
                </label>
                <Input
                    className="max-w-full"
                    value={stateDefaultVariant.barcode}
                    onChange={(e) => setStateDefaultVariant({...stateDefaultVariant, barcode: e.target.value})}
                    placeholder="Enter barcode"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">
                    SKU
                </label>
                <Input
                    className="max-w-full"
                    value={stateDefaultVariant.sku}
                    onChange={(e) => setStateDefaultVariant({...stateDefaultVariant, sku: e.target.value})}
                    placeholder="Enter SKU"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">
                    Price
                </label>
                <Input
                    type="number"
                    value={stateDefaultVariant.price}
                    onChange={(e) => setStateDefaultVariant({...stateDefaultVariant, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Stock</label>
                <Input
                    type="number"
                    value={stateDefaultVariant.stock}
                    onChange={(e) => setStateDefaultVariant({...stateDefaultVariant, stock: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                />
            </div>
        </div>
    )
}