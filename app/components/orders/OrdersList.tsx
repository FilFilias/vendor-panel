import { Button } from "~/components/ui/button";
import {  Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";
import { LinkButton } from "../ui/buttoLink";

export type OrdersListProps = {
    id:string;
    transactionID:string;
    customer:string;
    date:string;
    total:number;
    currency:string;
}   

const OrdersList = ({ orders }: { orders: OrdersListProps[] }) => {

  let { t } = useTranslation();
  
  return (
      <div className="hidden sm:block rounded-lg border bg-card overflow-x-auto">
      <div className="w-full min-w-[600px]">
        <Table className="dark:bg-gray-800 dark:text-white">
          <TableHeader>
            <TableRow>
              <TableHead>{t("order_id")}</TableHead>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">{t("total")}</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {orders.map((order) => (
              <TableRow key={order.transactionID}>
                <TableCell className="font-medium">{order.transactionID}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className={`text-right price ${order.currency}`}>{order.total}</TableCell>
                <TableCell className="text-center">
                  <LinkButton 
                    size="sm" 
                    variant="ghost" 
                    className="border-none bg-primary hover:bg-orange dark:bg-orange dark:hover:bg-orange_hover text-white"

                    to={`/order/${order.id}`}
                  >
                    <Eye className="h-4 w-4" />
                    {t("view")}
                  </LinkButton>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center dark:text-white">
                  {t("no_orders_found")}
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default OrdersList;