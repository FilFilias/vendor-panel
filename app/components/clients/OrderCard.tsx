
import React from "react";
import { Card, CardContent } from "~/components/ui/card";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: string;
};

type Order = {
  id: string;
  date: string;
  total: string;
  status: string;
  orderItems: OrderItem[];
};

type OrderCardProps = {
  order: Order;
  onOpen: (order: Order) => void;
};

export function OrderCard({ order, onOpen }: OrderCardProps) {
  return (
    <Card
      className="bg-muted cursor-pointer hover:bg-muted/70 transition"
      onClick={() => onOpen(order)}
    >
      <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium">{order.id}</div>
          <div className="text-sm text-muted-foreground">{order.date}</div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end text-sm mt-2 sm:mt-0">
          <span className="font-semibold">{order.total}</span>
          <span
            className={
              order.status === "completed"
                ? "text-green-700"
                : order.status === "processing"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
