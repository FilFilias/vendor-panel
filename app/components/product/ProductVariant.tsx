import { Button } from "~/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { TrashIcon, X } from "lucide-react";
import { useState, ChangeEvent, useEffect } from "react";
import { DeleteVariantDialog } from "./DeleteVariantDialog";
import { set } from "date-fns";
import { useFetcher } from "react-router";

type ProductVariantProps = {
    variant: {
        id: string;
        title: string;
        options: { id: string; title: string; value: string }[];
        barcode: string;
        sku: string;
        inventory: { id:string; inventory_item_id:string; stocked_quantity: number }[];
        prices: { price_list_id:string | null; id:string; currency_code: string; amount: number }[];
    };
}

export const ProductVariant = ({ variant }: ProductVariantProps) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [stateVariant, setStateVariant] = useState(variant);

    useEffect(() => {
        setStateVariant(variant)
    },[variant])
    
    let fetcher = useFetcher()

    const onDeleteClick = (e: Event) => {
        e.preventDefault();
        setDeleteOpen((prevState) => !prevState);
    };

    const onEditClick = (e: Event) => {
        e.preventDefault();
        if (edit) {
            setStateVariant(variant);
        }
        setEdit((prevState) => !prevState);
    };

    const onCancelClick = (e: Event) => {
        e.preventDefault();
        setEdit(false);
    };

    // Generic handler to update stateVariant
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        key?: "options" | "prices" | "inventory",
        id?: string
    ) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? parseFloat(value) || 0 : value; // Parse number inputs

        if (key && id) {
            // Update array fields (options, prices, inventory)
            setStateVariant((prev) => ({
                ...prev,
                [key]: prev[key].map((item) =>
                    item.id === id ? { ...item, [name]: parsedValue } : item
                ),
            }));
        } else {
            // Update non-array fields like barcode
            setStateVariant((prev) => ({
                ...prev,
                [name]: parsedValue,
            }));
        }
    };

    const onSaveClick = (e: Event) => {
        e.preventDefault();
        fetcher.submit({ _action:"update-product-variant", variant: JSON.stringify(stateVariant) }, { method: "post" });
        setEdit(false)
    }

    return (
        <Card className="border dark:text-white dark:bg-gray-800 mb-12" key={stateVariant.id}>
            <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-medium">
                    {stateVariant.title !== "Default" ? stateVariant.title : "Default Variant"}
                </CardTitle>
                <div className="flex gap-4 items-center">
                    {edit ? (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onCancelClick}
                                className="h-8 w-8 p-0 bg-white hover:text-white text-main hover:bg-secondary dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="h-8 w-8 p-0 text-white"
                                onClick={onSaveClick}  
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            {stateVariant.title !== "Default" && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={onDeleteClick}
                                    className="h-8 w-8 p-0 text-destructive"
                                >
                                    <TrashIcon className="h-4 w-4 text-white" />
                                    <span className="sr-only">Delete variant</span>
                                </Button>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onEditClick}
                                className="h-8 w-8 p-0 text-white"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stateVariant.options.map((option) => (
                        option.title !== "Default" && (
                            <div className="space-y-2" key={option.id}>
                                <Label>{option.title}</Label>
                                <Input
                                    disabled={!edit}
                                    name="value"
                                    value={option.value}
                                    onChange={(e) => handleInputChange(e, "options", option.id)}
                                />
                            </div>
                        )
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                            disabled={!edit}
                            name="sku"
                            value={stateVariant.sku}
                            onChange={(e) =>
                                setStateVariant((prev) => ({ ...prev, sku: e.target.value }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Barcode</Label>
                        <Input
                            disabled={!edit}
                            name="barcode"
                            value={stateVariant.barcode}
                            onChange={(e) =>
                                setStateVariant((prev) => ({ ...prev, barcode: e.target.value }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                            disabled={!edit}
                            name="stocked_quantity"
                            value={stateVariant.inventory[0]?.stocked_quantity}
                            onChange={(e) => handleInputChange(e, "inventory", stateVariant.inventory[0]?.id)}
                            type="number"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stateVariant.prices.map((price) => (
                        <div className="space-y-2" key={price.id}>
                            <Label>Price ({price.currency_code?.toUpperCase()})</Label>
                            <div className="flex">
                                <Input
                                    disabled={!edit}
                                    name="amount"
                                    value={price.amount}
                                    onChange={(e) => handleInputChange(e, "prices", price.id)}
                                    type="number"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            {deleteOpen && (
                <DeleteVariantDialog
                    variant={variant}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            )}
        </Card>
    );
};