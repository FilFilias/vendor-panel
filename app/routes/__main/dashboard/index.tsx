import type { MetaFunction } from "@remix-run/node";
import { BarChart3, Calendar, DollarSign, ShoppingCart } from "lucide-react";
import { StatCard } from "~/components/dashboard/StatCard";
import { RecentOrders } from "~/components/dashboard/RecentOrders";
import { LowStockAlerts } from "~/components/dashboard/LowStockAlerts";
import { ActiveCampaigns } from "~/components/dashboard/ActiveCampaigns";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold dark:text-white ">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your vendor dashboard</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        <StatCard
          title="Sales This Week"
          value="$12,580"
          indicator={<span className="flex items-center gap-1 text-primary">+12.5%</span>}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="New Orders"
          value="18"
          indicator={<span className="text-muted-foreground">Since yesterday</span>}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatCard
          title="Low Stock Items"
          value="7"
          indicator={<span className="text-red-600">Critical</span>}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatCard
          title="Active Campaigns"
          value="3"
          indicator={<span className="text-muted-foreground">Ending soon: 1</span>}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <RecentOrders />
        <div className="grid gap-6">
          <LowStockAlerts />
          <ActiveCampaigns />
        </div>
      </div>
    </div>
  );
}