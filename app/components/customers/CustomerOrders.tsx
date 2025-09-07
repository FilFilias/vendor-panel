
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { OrderCard } from "./OrderCard";
import { StoreVendorCustomerOrder } from "~/types/vendor";
import { useTranslation } from "react-i18next";


export function CustomerOrders({
  orders,
  total,
  start,
  end
}: {
    orders:StoreVendorCustomerOrder[] | [];
    total:number;
    start:number;
    end:number;
}) {

let {t} = useTranslation()

  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("orders")}</CardTitle>
          {total > 0 && <h6 className="pb-4 text-muted-foreground">{`${t("displaying")} ${start} ${t("to")} ${end} ${t("of")} ${total} ${t("orders")}`}</h6>}
        </CardHeader>
        <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">{t("no_completed_orders")}</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
