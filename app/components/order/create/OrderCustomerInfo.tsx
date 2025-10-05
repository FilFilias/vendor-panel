import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { useFetcher, useLoaderData } from "react-router";
import { useState } from "react";
import { StoreVendorCustomerAddress } from "~/types/vendor";

export const OrderCustomerInfo = () => {

    const {customer, cart} = useLoaderData()

    const preselectedAddressId = customer.addresses.filter((a: StoreVendorCustomerAddress) => {
        return a.company === cart.shippingAddress?.company &&
        a.address_1 === cart.shippingAddress?.address_1 &&
        a.city === cart.shippingAddress?.city &&
        a.country_code === cart.shippingAddress?.country_code &&
        a.postal_code === cart.shippingAddress?.postal_code &&
        a.phone === cart.shippingAddress?.phone
    });

    const [selectedAddressId, setSelectedAddressId] = useState<string>(preselectedAddressId?.[0]?.id || "");
    const fetcher = useFetcher()

    const handleAddressChange = (val: string) => {
        setSelectedAddressId(val);
        const addr = customer.addresses.find((a: StoreVendorCustomerAddress) => a.id === val);

        fetcher.submit({ 
            address:JSON.stringify({
                id: addr.id,
                customer_id: customer.id,
                first_name: addr.first_name,
                last_name: addr.last_name,
                company: addr.company,
                address_1: addr.address_1,
                city:addr.city,
                country_code: addr.country_code,
                postal_code: addr.postal_code,
                phone: addr.phone
            }),
            _action: "update-address"
        }, { method: "post" });
    };

    const onOrderComplete = () => {
        fetcher.submit({  _action: "complete-order"}, { method: "post" });
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                    <div className="space-y-1">
                        <p className="font-medium">{customer.company}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
                    <Select 
                    value={selectedAddressId}
                    onValueChange={handleAddressChange}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                        {customer.addresses.map((address: StoreVendorCustomerAddress) => (
                        <SelectItem key={address.id || ''} value={address.id || ''}>
                            {address.address_1} {' '}{address.city}, {address.postal_code}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>                    
                    <Button 
                        className="w-full mt-6 flex items-center justify-center"
                        onClick={onOrderComplete}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Complete Order
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}