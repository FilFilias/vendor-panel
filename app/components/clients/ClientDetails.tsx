
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from "~/components/ui/pagination";
import { OrderCard } from "./OrderCard";
import { ClientOrderViewDialog } from "~/components/clients/ClientOrderViewDialog";

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

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  orders: Order[];
};

type ClientDetailsProps = {
  client: Client;
  onBack: () => void;
  ordersPerPage: number;
  clientOrdersPage: number;
  setClientOrdersPage: (p: number) => void;
  orderDialogOpen: boolean;
  setOrderDialogOpen: (b: boolean) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;
};

export function ClientDetails({
  client,
  onBack,
  ordersPerPage,
  clientOrdersPage,
  setClientOrdersPage,
  orderDialogOpen,
  setOrderDialogOpen,
  selectedOrder,
  setSelectedOrder
}: ClientDetailsProps) {
  const orderPageCount = Math.ceil(client.orders.length / ordersPerPage);
  const ordersOnThisPage = client.orders.slice(
    (clientOrdersPage - 1) * ordersPerPage,
    clientOrdersPage * ordersPerPage
  );

  React.useEffect(() => {
    setClientOrdersPage(1);
    // reset dialog state when switching clients
    setOrderDialogOpen(false);
    setSelectedOrder(null);
    // eslint-disable-next-line
  }, [client.id]);

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Button variant="outline" className="mb-4" onClick={onBack}>
        &larr; Back to Client List
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription>{client.company}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Email:</span> {client.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {client.phone}
            </div>
            <div>
              <span className="font-medium">Address:</span> {client.address}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Orders</h3>
            {client.orders.length === 0 ? (
              <p className="text-muted-foreground">No orders found</p>
            ) : (
              <div className="space-y-3">
                {ordersOnThisPage.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOpen={o => {
                      setSelectedOrder(o);
                      setOrderDialogOpen(true);
                    }}
                  />
                ))}
                {orderPageCount > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            setClientOrdersPage(Math.max(1, clientOrdersPage - 1));
                          }}
                          aria-disabled={clientOrdersPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: orderPageCount }).map((_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink
                            href="#"
                            isActive={clientOrdersPage === idx + 1}
                            onClick={e => {
                              e.preventDefault();
                              setClientOrdersPage(idx + 1);
                            }}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            setClientOrdersPage(Math.min(orderPageCount, clientOrdersPage + 1));
                          }}
                          aria-disabled={clientOrdersPage === orderPageCount}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
                <ClientOrderViewDialog
                  open={orderDialogOpen}
                  onOpenChange={open => {
                    setOrderDialogOpen(open);
                    if (!open) setTimeout(() => setSelectedOrder(null), 200);
                  }}
                  order={selectedOrder}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
