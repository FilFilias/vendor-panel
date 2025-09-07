
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
import { Separator } from "~/components/ui/separator";

// Expand the Order type to include items array
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: string;
};

type Order = {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: string;
  items: number;
  orderItems: OrderItem[];
};

type OrderViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
};

export function OrderViewDialog({ 
  open, 
  onOpenChange, 
  order 
}: OrderViewDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order information and items list</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{order.customer}</p>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </div>
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
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Order ID</span>
              <span className="text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-sm font-semibold">{order.total}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Order Items ({order.orderItems.length})</h3>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="py-2 border-b last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
