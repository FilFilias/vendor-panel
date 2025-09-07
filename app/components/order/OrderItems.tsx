import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "react-i18next";

type OrderItemsProps = {
    items:{
        id:string;
        title:string;
        dimension:string | null;
        price:number;
        totalPrice:number;
        quantity:number;
        imageUrl:string;
    }[];
    currency: string;
}

export const OrderItems: React.FC<OrderItemsProps> = ({items,currency}) => {

    let {t} = useTranslation()

    return (
        <Card className="dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle>{t("order_items")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div className="flex items-start" key={item.id}>
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 bg-gray-100 dark:bg-gray-200 p-2">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-contain mix-blend-multiply"
                    />
                    </div>
                    <div className="ml-4 flex-grow dark:text-white">
                    <p className="font-medium text-sm  leading-tight line-clamp-2">{item.title}</p>
                    {item.dimension && <p className="font-medium text-sm text-muted-foreground">{item.dimension}</p>}
                    <p className="text-sm text-muted-foreground">{t('quantity')}: {item.quantity}</p>
                    <p className={`font-medium price ${currency}`}>{item.price.toFixed(2)}</p>
                    <p className={`text-sm text-muted-foreground price ${currency}`}>{t('tax')}: {item.totalPrice.toFixed(2)}</p>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    )
}