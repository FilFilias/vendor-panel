import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
    setShowVariantForm: (k:boolean) => void;
    options:string[];
    variants: ProductVariant[] | [];
    setVariants: (k:ProductVariant[] ) => void
}

export const AddProductVariantForm = ({setShowVariantForm,options,variants,setVariants}:AddProductVariantFormProps) => {

    const [currentVariant, setCurrentVariant] = useState<ProductVariant>({
        options: options.map( opt => ({
            name: opt,
            value:''
        })),
        price: 0,
        stock: 0,
        barcode: "",
        sku: ""
    });

    const [stateError, setStateError] = useState({
        Size:null,
        price:null,
        stock:null,
        barcode:null,
        sku:null,
        isDuplicate:false
    })

    const onErrorsReset = () => {
        setStateError({
            Size:null,
            price:null,
            stock:null,
            barcode:null,
            isDuplicate:false
        })
    }

    useEffect(() => {
        if (options.length > 0) {
   
          setCurrentVariant(prev => ({
            ...prev,
            options: options.map(name => ({ name, value: "" }))
          }));
          
        }
      }, [options]);



    const updateOptionValue = (optionName: string, value: string) => {
        setCurrentVariant(prev => ({
          ...prev,
          options: prev.options.map(opt => 
            opt.name === optionName ? { ...opt, value } : opt
          )
        }));
    };

    const onCancelClick = () => {
        setShowVariantForm(false)
    }

    const addNewVariant = () => {
        const missingOptions = currentVariant.options.filter(opt => !opt.value.trim());
        if (missingOptions.length > 0) {
            const optionErrors = missingOptions.reduce((acc, cur) => {
                acc[cur.name] = "Fill option";
                return acc;
            }, {} as Record<string, string>); // Initialize as an empty object with string keys and values
    
            setStateError(prev => ({
                ...prev,
                ...optionErrors
            }));
            return;
        }

        const isDuplicate = variants.some(variant => 
            variant.options.every((opt, index) => 
              opt.value === currentVariant.options[index]?.value && 
              opt.name === currentVariant.options[index]?.name
            )
        );

        if (isDuplicate) {
            setStateError(prev => ({
                ...prev,
                'isDuplicate': true
            }));
            return
        }

        const newVariant = {
            ...currentVariant,
            id: uuidv4()
          };

        setVariants([...variants, newVariant]);

        setCurrentVariant({
            options: options.map( opt => ({
                name: opt,
                value:''
            })),
            price: 0,
            stock: 0,
            barcode: ""
        });
        onErrorsReset()
        setShowVariantForm(false);

    }

    return (
        <Card className="my-4 dark:bg-gray-800 dark:text-white">
            <CardHeader className="py-2 mt-4">
                <CardTitle className="text-sm font-medium"><h2>New Variant</h2></CardTitle>
            </CardHeader>
            <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {currentVariant.options.map((option) => (
                        <div key={option.name}>
                            {stateError[option.name] ?
                                <label className="text-destructive text-sm font-medium mb-1 block">
                                    {stateError[option.name]}
                                </label>
                            :
                                <label className="text-sm font-medium mb-1 block">
                                    {option.name}
                                </label>
                            }
                            <Input
                            value={option.value}
                            onChange={(e) => updateOptionValue(option.name, e.target.value)}
                            placeholder={`Enter ${option.name.toLowerCase()}`}
                            />
                        </div>
                        ))}
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        {stateError['barcode'] ?
                            <label className="text-destructive text-sm font-medium mb-1 block">
                                {stateError['barcode']}
                            </label>
                        :
                            <label className="text-sm font-medium mb-1 block">
                                Barcode
                            </label>
                        }
                        <Input
                            className="max-w-full"
                            value={currentVariant.barcode}
                            onChange={(e) => setCurrentVariant({...currentVariant, barcode: e.target.value})}
                            placeholder="Enter barcode"
                        />
                    </div>
                    <div>
                        {stateError['sku'] ?
                            <label className="text-destructive text-sm font-medium mb-1 block">
                                {stateError['sku']}
                            </label>
                        :
                            <label className="text-sm font-medium mb-1 block">
                                SKU
                            </label>
                        }
                        <Input
                            className="max-w-full"
                            value={currentVariant.sku}
                            onChange={(e) => setCurrentVariant({...currentVariant, sku: e.target.value})}
                            placeholder="Enter SKU"
                        />
                    </div>
                    <div>
                        {stateError['price'] ?
                            <label className="text-destructive text-sm font-medium mb-1 block">
                                {stateError['price']}
                            </label>
                        :
                            <label className="text-sm font-medium mb-1 block">
                                Price
                            </label>
                        }
                        <Input
                            type="number"
                            value={currentVariant.price}
                            onChange={(e) => setCurrentVariant({...currentVariant, price: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Stock</label>
                        <Input
                            type="number"
                            value={currentVariant.stock}
                            onChange={(e) => setCurrentVariant({...currentVariant, stock: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>
                {stateError['isDuplicate'] &&
                    <em className="my-8 text-destructive">Duplicate variant</em>
                }
                <div className="flex justify-end gap-2">
                    <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancelClick}
                    >
                    Cancel
                    </Button>
                    <Button 
                    type="button"
                    onClick={addNewVariant}
                    >
                    Add Variant
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}