import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: string;
};

type ClientOrder = {
  id: string;
  date: string;
  total: string;
  status: string;
  orderItems: OrderItem[];
};

type ClientOrderViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ClientOrder | null;
};

export function ClientOrderViewDialog({
  open,
  onOpenChange,
  order
}: ClientOrderViewDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.id} overview</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <div className="flex justify-between">
            <span className="font-medium">Order ID:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{order.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span>{order.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <Badge
              variant="outline"
              className={
                order.status === "completed"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : order.status === "processing"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="font-medium mb-2">Products</h3>
          <ScrollArea className="max-h-44">
            <div className="border rounded bg-muted/50 p-2">
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-[13px] text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">{item.price}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">No products in this order.</div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
