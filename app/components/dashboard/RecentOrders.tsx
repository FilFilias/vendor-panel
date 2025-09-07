
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

// Sample data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "Café Louvre",
    date: "5 Apr 2025",
    total: "$1,240.00",
    status: "processing",
  },
  {
    id: "ORD-002",
    customer: "Hotel Panorama",
    date: "4 Apr 2025",
    total: "$2,860.00",
    status: "completed",
  },
  {
    id: "ORD-003",
    customer: "Meadow Restaurant",
    date: "4 Apr 2025",
    total: "$450.00",
    status: "processing",
  },
  {
    id: "ORD-004",
    customer: "The Continental",
    date: "3 Apr 2025",
    total: "$1,875.00",
    status: "completed",
  },
];

export function RecentOrders() {
  return (
    <Card className=" dark:bg-gray-800 dark:text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Processing and recently completed orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/orders" className="flex items-center gap-1 dark:bg-gray-800 dark:text-white">
            View All <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{order.customer}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{order.id}</span>
                  <span>•</span>
                  <span>{order.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
