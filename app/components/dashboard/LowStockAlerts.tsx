
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router";

// Sample data for low stock items
const lowStockItems = [
  {
    id: "PRD-001",
    name: "Organic Coffee Beans",
    stock: 12,
    threshold: 20,
    sku: "CB-ORG-001",
  },
  {
    id: "PRD-002",
    name: "Sparkling Mineral Water",
    stock: 8,
    threshold: 15,
    sku: "WTR-SPK-002",
  },
  {
    id: "PRD-003",
    name: "Artisanal Bread Flour",
    stock: 5,
    threshold: 10,
    sku: "FLR-BRD-003",
  },
];

export function LowStockAlerts() {
  return (
    <Card className="dark:bg-gray-800 dark:text-white">
      <CardHeader className="flex flex-wrap flex-row items-center justify-between">
        <div>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need restocking soon</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/products" className="flex items-center gap-1 dark:bg-gray-800 dark:text-white">
            View Inventory <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-red-600">{item.stock} units</p>
                  <p className="text-xs text-muted-foreground">Threshold: {item.threshold}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
