import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

type OrderSummaryProps = {
    subtotal:number;
    taxTotal:number;
    totalAmount:number;
    surcharge:number;
    currency:string;
}

export const OrderSummary:React.FC<OrderSummaryProps> = ({subtotal,taxTotal,totalAmount,surcharge,currency}) => {

    let {t} = useTranslation()

    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
                <CardTitle>{t("order_summary")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className={`font-medium price ${currency}`}>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("tax_total")}</span>
                    <span className={`font-medium price ${currency}`}>{taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("platform_cost")}</span>
                    <span className={`font-medium price ${currency}`}>{surcharge?.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">{t("total")}</span>
                    <span className={`font-bold price ${currency}`}>{totalAmount.toFixed(2)}</span>
                </div>
                </div>
            </CardContent>
        </Card>
    )
}