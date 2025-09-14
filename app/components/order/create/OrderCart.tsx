import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { Form, useLoaderData } from "react-router";
import { LinkButton } from "~/components/ui/buttoLink";

export const CreateOrderCart = () => {

    const {cart} = useLoaderData()

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-6">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {cart.items?.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                    No products added yet
                </p>
                ) : (
                <div className="space-y-4">
                    {cart.items.map((item) => (
                    <div key={item.productId} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                            <img 
                            src={item.image} 
                            alt={item.name}
                            className="object-cover h-full w-full rounded-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{item.dimension}</p>
                            </div>
                            <Form method="post">
                                <input hidden name='item_id' defaultValue={item.id} />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                                    name="_action"
                                    value="remove-from-cart"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Form>
                            </div>
                            
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Form method="post">
                                    <input hidden name='item_id' defaultValue={item.id} />
                                    <input hidden name='quantity' defaultValue={item.quantity - 1} key={item.quantity}/>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-6 w-6 p-0" 
                                        name="_action"
                                        value="change-item-quantity"    
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                </Form>
                                <span className="text-sm font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                                <Form method="post">
                                    <input hidden name='item_id' defaultValue={item.id} />
                                    <input hidden name='quantity' defaultValue={item.quantity + 1} key={item.quantity}/>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-6 w-6 p-0"
                                        name="_action"
                                        value="change-item-quantity"   
                                        disabled={!(item.availability > 0)} 
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </Form>
                            </div>
                            <div className="text-right">
                                {/* <p className="text-xs text-muted-foreground">
                                ${(item.price * item.quantity).toFixed(2)} (excl. VAT)
                                </p> */}
                                <p className={`text-sm font-medium price ${cart.currency}`}>
                                {item.price}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                
                <div className="border-t pt-4 mt-6 space-y-2">
                {/* <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className={`price ${cart.currency}`}>{cart.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Tax :</span>
                    <span className={`price ${cart.currency}`}>{cart.taxTotal.toFixed(2)}</span>
                </div> */}
                {/* <div className="flex justify-between font-semibold text-lg border-t pt-2"> */}
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className={`price ${cart.currency}`}>{cart.total.toFixed(2)}</span>
                </div>
                </div>
                
                <LinkButton 
                className="w-full mt-6 flex items-center justify-center"
                disabled={cart.items?.length < 1}
                to={`/order/create/complete/${cart.id}`}
                >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
                </LinkButton>
            </CardContent>
            </Card>
        </div>
    )
}