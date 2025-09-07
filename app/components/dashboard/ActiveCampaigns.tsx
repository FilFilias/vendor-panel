
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router";

// Sample data for active campaigns
const activeCampaigns = [
  {
    id: "CAM-001",
    name: "Spring Promotion",
    discount: "15% off",
    products: 24,
    daysLeft: 8,
  },
  {
    id: "CAM-002",
    name: "Coffee Bundle Special",
    discount: "Buy 3 Get 1 Free",
    products: 8,
    daysLeft: 2,
  },
  {
    id: "CAM-003",
    name: "Eco-Packaging Discount",
    discount: "10% off",
    products: 15,
    daysLeft: 12,
  },
];

export function ActiveCampaigns() {
  return (
    <Card className="dark:bg-gray-800 dark:text-white">
      <CardHeader className="flex flex-wrap flex-row items-center justify-between">
        <div>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Currently running promotional offers</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/campaigns" className="flex items-center gap-1 dark:bg-gray-800 dark:text-white">
            Manage Campaigns <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex flex-wrap gap-y-3 items-center justify-between rounded-lg border p-3">
              <div >
                <p className="font-medium">{campaign.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{campaign.discount}</span>
                  <span>•</span>
                  <span>{campaign.products} products</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${
                    campaign.daysLeft <= 3 ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {campaign.daysLeft} day{campaign.daysLeft !== 1 ? "s" : ""} left
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
