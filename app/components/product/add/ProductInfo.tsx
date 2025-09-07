import { useState } from "react";
import { useLoaderData } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ProductImage } from "~/components/product/ProductImage";
import { SearchableSelect } from "~/components/ui/searchable-select";
import { ProductDefaultVariant } from "./ProductDefaultVariant";
import { ProductVariant } from "./ProductVariantForm";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

type ProductInfo = {
    id: string | undefined;
    title:string | undefined;
    description:string | undefined;
    color: string | undefined;
    category: {
        id:string | undefined;
        value:string | undefined;
        label:string | undefined;
    }
}

type AddProductInfoProps = {
    hasOptions:boolean;    
    formState: ProductInfo;
    setFormState:(k:ProductInfo) => void;
    stateDefaultVariant: ProductVariant;
    setStateDefaultVariant: (k:ProductVariant) => void;
    handleVatChange: (k:number) => void;
    stateVat: {id:string;value:number}[]
}

export const AddProductInfo = ({hasOptions,formState,setFormState,stateDefaultVariant,setStateDefaultVariant,handleVatChange,stateVat}:AddProductInfoProps) => {
    let { categories,taxes } = useLoaderData();

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
    
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="dark:text-white text-lg font-semibold">Product Info</h2>
                </div>
                <div className="mb-2">
                    <div className="grid gap-4 w-full  my-8">
                        <div className="grid grid-cols-1 gap-4">
                            <Label className="dark:text-white">Product Image</Label>
                            <ProductImage />
                        </div>
                        <div>
                            <Label className="dark:text-white">ID</Label>
                            <Input
                                name="id"
                                value={formState.id}
                                onChange={handleInputChange}
                                className="dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="dark:text-white">Title</Label>
                            <Input
                                name="title"
                                value={formState.title}
                                onChange={handleInputChange}
                                className="dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-white">Description</Label>
                            <Textarea
                                name="description"
                                value={formState.description}
                                onChange={handleInputChange}
                                className="dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="dark:text-white">Color</Label>
                            <Input
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
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-white">Vat Status</Label>
                            <Select 
                                onValueChange={handleVatChange} 
                                value={stateVat.value}
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
                    {!hasOptions &&
                        <ProductDefaultVariant stateDefaultVariant={stateDefaultVariant} setStateDefaultVariant={setStateDefaultVariant} />
                    }
                </div>
            </div>
        </div>
    );
};