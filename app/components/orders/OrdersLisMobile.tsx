import { Button } from "~/components/ui/button";
import { Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { OrdersListProps } from "./OrdersList";
import { useTranslation } from "react-i18next";

const OrdersListMobile = ({ orders }: { orders: OrdersListProps[] }) => {

  let {t} = useTranslation();

  return (
    <div className="grid sm:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden w-full dark:bg-gray-800 dark:text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{order.transactionID}</span>
            </div>
            <h3 className="font-semibold text-lg">{order.customer}</h3>
            <div className="flex flex-wrap gap-y-2 justify-between mt-2 text-sm">
              <span className="text-muted-foreground">{order.date}</span>
              <span className={`font-medium price ${order.currency}`}>{order.total}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t flex justify-center">
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex items-center gap-1"
              // onClick={() => handleViewOrder(order)}
            >
              <Eye className="h-4 w-4" />
              {t("view_order_details")}
            </Button>
          </CardFooter>
        </Card>
      ))}
      {orders.length === 0 && (
        <Card className="overflow-hidden w-full dark:bg-gray-800 dark:text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{t("no_orders_found")}</span>
            </div>
          </CardContent>
        </Card>  
      )}
  </div>
  )
}

export default OrdersListMobile;