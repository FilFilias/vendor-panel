import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Plus, Minus } from "lucide-react";

import { Form } from "react-router";
import { Image } from "~/components/images/image";

type OrderProductCardType = {
    product: {
        id:string;
        product_id:string;
        name:string;
        dimension:string;
        sku:string;
        image:string;
        price:number;
        price_vat:number;
        cart_count: number;
        cart_id?: string;
        available:number;
    }
    currency:string;
}

export const OrderProductCard:React.FC<OrderProductCardType> = ({product,currency}) => {

    return (
        <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-4">
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image
                        src={product.image} 
                        alt={product.name}
                        className="object-cover h-full w-full rounded-lg"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.dimension !== 'Default' && <p className="text-secondary text-md mb-2">Size: {product.dimension}</p>}

                    <div className="space-y-1">
                        <p className={`font-bold text-lg text-primary price ${currency}`}>
                            {product.price.toFixed(2)}
                        </p>
                        <p className={`text-sm text-muted-foreground price ${currency}`}>
                            VAT included: {product.price_vat.toFixed(2)}
                        </p>
                    </div>
                    <div className="w-full max-w-xs mt-2 gap-3 grid">
                        <div className="grid gap-6 flex-shrink-0">
                            {product.cart_id ? 
                                <>
                                    <div className="flex items-center gap-2 w-full border justify-between p-1">
                                        <Form method="post">
                                            <input hidden name='item_id' defaultValue={product.cart_id} />
                                            <input hidden name='quantity' defaultValue={product.cart_count - 1} key={product.cart_count}/>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 w-8 p-0 border-0" 
                                                name="_action"
                                                value="change-item-quantity"  
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </Form>
                                        <span className="font-medium min-w-[2rem] text-center flex-1 border-x">
                                            {product.cart_count}
                                        </span>
                                        <Form method="post">
                                            <input hidden name='item_id' defaultValue={product.cart_id} />
                                            <input hidden name='quantity' defaultValue={product.cart_count + 1} key={product.cart_count}/>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 w-8 p-0" 
                                                name="_action"
                                                value="change-item-quantity"    
                                                disabled={!(product.available > 0)}  
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </Form>
                                    </div>
                                    {!(product.available > 0)  &&
                                        <em className="text-destructive">Maximum quantity reached</em>
                                    }
                                </>
                            :
                                <Form method="post">
                                    <input hidden name='variant_id' defaultValue={product.id} />
                                    <input hidden name='unit_price' defaultValue={product.price_vat} />
                                    <input hidden name='quantity' defaultValue={1} />
                                    <Button 
                                        className="w-full flex items-center gap-2"
                                        name="_action"
                                        value="add-to-cart"
                                        disabled={!(product.available > 0)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                </Form>
                            }
                        </div>
                    </div>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}