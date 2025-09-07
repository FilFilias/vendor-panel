import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProductVariantForm } from "./ProductVariantForm";
import { ProductVariant } from "./ProductVariantForm";
import { VariantBlock } from "./VariantBlock";

type AddProductVariantsProps = {
    options:{Color:boolean;Size:boolean;}
    stateVariants:ProductVariant[]
    setVariants: (k:ProductVariant[] ) => void
}

export const AddProductVariants = ({options,stateVariants,setVariants}:AddProductVariantsProps) => {
    const [showVariantForm,setShowVariantForm] = useState(false)

    const onShowVariantForm = () => {
        setShowVariantForm(prevState => !prevState)
    }

    return (
        <>
            <div className="rounded-lg border p-4">
                <div className="p-6 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="dark:text-white text-lg font-semibold">Product Variants</h2>
                            <Button 
                            type="button"
                            onClick={onShowVariantForm}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>
                    </div>
                </div>
                {showVariantForm &&
                    <AddProductVariantForm 
                        setShowVariantForm={setShowVariantForm} 
                        options={Object.keys(options).filter((key) => options[key])}
                        variants={stateVariants}    
                        setVariants={setVariants}
                    />
                }
                {stateVariants.length > 0 &&
                        <div className="dark:text-white space-y-8">
                            {stateVariants.map( variant => {
                                return (
                                    <div className="rounded-lg border p-4">
                                        <VariantBlock variant={variant} />
                                    </div>
                                )
                            })}
                        </div>
                    // </div>
                }
            </div>

        </>

    )
}