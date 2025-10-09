import { useState } from "react";
import { Edit, Save, TrashIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { DeleteProductDialog } from "../products/DeleteProductDialog";
import { useLoaderData, Form, useFetcher } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ProductImage } from "~/components/product/ProductImage";
import { SearchableSelect } from "~/components/ui/searchable-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

export const ProductInfo = () => {
    let { product, categories, taxes } = useLoaderData();
    let fetcher = useFetcher()

    const [edit, setEdit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Initialize state with product details
    const [formState, setFormState] = useState({
        id: product.id,
        title: product.title,
        description: product.description,
        color: product.color,
        vatType: product.vatType,
        category: {
            id: product.category.id,
            value: product.category.id,
            label: product.category.mpath,
        },
    });

    const onEditClick = (e: Event) => {
        e.preventDefault();
        setEdit((prevState) => !prevState);
    };

    const onCancelClick = (e: Event) => {
        e.preventDefault();
        setEdit(false);
        // Reset state to initial product details
        setFormState({
            id: product.id,
            title: product.title,
            description: product.description,
            color: product.color,
            vatType: product.vatType,
            category: {
                id: product.category.id,
                value: product.category.id,
                label: product.category.mpath,
            },
        });
    };

    const onDeleteClick = (e: Event) => {
        e.preventDefault();
        setDeleteOpen((prevState) => !prevState);
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (val: string) => {
        const match = categories.find((c) => c.value === val);
        if (match) {
            setFormState((prev) => ({
                ...prev,
                category: match,
            }));
        }
    };

    const onSaveClick = (e: Event) => {
        e.preventDefault();
        fetcher.submit({ _action:"update-product", product: JSON.stringify(formState) }, { method: "post" });
        setEdit(false)
    }

    const handleVatChange = (vatValue:number) => {
        setFormState((prev) => ({
            ...prev,
            vatType: taxes.filter( tax => tax.value == vatValue)[0],
        }));
    }

    return (
        <>
            <Form method="post">
                <input hidden name="id" defaultValue={product.id} />
                <input hidden name="category" defaultValue={formState.category.id} />
                <div className="rounded-lg border py-4">
                    <div className="p-6 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="dark:text-white text-lg font-semibold">Product Info</h2>
                                <div className="flex items-center justify-end gap-4">
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
                                                className="h-8 w-8 p-0 text-primary"
                                                type="submit"
                                                name="_action"
                                                value="update-product"
                                                onClick={onSaveClick}
                                            >
                                                <Save className="h-4 w-4 text-white" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={onDeleteClick}
                                                className="h-8 w-8 p-0 text-destructive"
                                            >
                                                <TrashIcon className="h-4 w-4 text-white" />
                                                <span className="sr-only">Delete variant</span>
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={onEditClick}
                                                className="h-8 w-8 p-0 text-primary"
                                            >
                                                <Edit className="h-4 w-4 text-white" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="grid gap-4 w-full">
                                    <div className="grid grid-cols-1 gap-4">
                                        <Label className="dark:text-white">Product Image</Label>
                                        <ProductImage imageUrl={product.imageUrl} />
                                    </div>
                                    <div>
                                        <Label className="dark:text-white">ID</Label>
                                        <Input
                                            disabled={true}
                                            name="id"
                                            value={product.external_id}
                                            className="dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="dark:text-white">Title</Label>
                                        <Input
                                            disabled={!edit}
                                            name="title"
                                            value={formState.title}
                                            onChange={handleInputChange}
                                            className="dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="dark:text-white">Description</Label>
                                        <Textarea
                                            disabled={!edit}
                                            name="description"
                                            value={formState.description}
                                            onChange={handleInputChange}
                                            className="dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="dark:text-white">Color</Label>
                                        <Input
                                            disabled={!edit}
                                            name="color"
                                            value={formState.color}
                                            onChange={handleInputChange}
                                            className="dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="dark:text-white">Category</Label>
                                        <SearchableSelect
                                            items={categories}
                                            value={formState.category.value}
                                            onValueChange={handleCategoryChange}
                                            placeholder="Select a category"
                                            disabled={!edit}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="dark:text-white">Vat Status</Label>
                                        <Select 
                                            onValueChange={handleVatChange} 
                                            value={formState.vatType.value}
                                            disabled={!edit}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Vat Status' />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80">
                                                {taxes.map((tax) => (
                                                    <SelectItem key={tax.id} value={tax.value}>
                                                    {tax.value}%
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
            {deleteOpen && (
                <DeleteProductDialog
                    product={product}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            )}
        </>
    );
};