import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ExternalLink, User } from "lucide-react";
import { LinkButton } from "../ui/buttoLink";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

type OrderShippingAddressProps = {
    shippingAddress:{
        customerID:string;
        email:string;
        company:string;
        phoneNumber:string;
        address:string;
        city:string;
        postalCode:string;
    }
}

export const OrderShippingAddress: React.FC<OrderShippingAddressProps> = ({shippingAddress}) => {

    let {t} = useTranslation()

    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("customer_info")}
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{shippingAddress.company}</h3>
                    <p className="text-md text-muted-foreground">{shippingAddress.email}</p>
                    <p className="text-md text-muted-foreground">{shippingAddress.phoneNumber}</p>
                </div>
                <LinkButton 
                    variant="outline" 
                    size="sm"
                    to={`/customer/${shippingAddress.customerID}`}
                    className="flex items-center gap-2"
                >
                    {t("view_customer")} <ExternalLink className="h-4 w-4" />
                </LinkButton>
                </div>
                <Separator />
                <div>
                    <h4 className="font-medium mr-2">{t("shipping_address")}</h4>
                    <p className="text-md text-muted-foreground">{shippingAddress.address},{shippingAddress.city},{shippingAddress.postalCode}</p>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}