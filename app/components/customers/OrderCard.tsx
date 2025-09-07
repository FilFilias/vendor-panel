
import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { useNavigate } from "react-router";
import { StoreVendorCustomerOrder } from "~/types/vendor";

export function OrderCard({order} : {order:StoreVendorCustomerOrder}) {
  const navigate = useNavigate()

  const onOrderClick = () => {
    navigate(`/order/${order.id}`)
  }

  return (
    <Card
      className="bg-muted cursor-pointer hover:bg-muted/70 transition"
      onClick={onOrderClick}
    >
      <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium">{order.id.slice(-6)}</div>
          <div className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end text-sm mt-2 sm:mt-0">
          <span className={`font-semibold price ${order.currency_code}`}>{order.total}</span>
          <span
            className={
              order.status === "completed"
                ? "text-green-700"
                : order.status === "processing"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {/* {order.status.charAt(0).toUpperCase() + order.status.slice(1)} */}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
