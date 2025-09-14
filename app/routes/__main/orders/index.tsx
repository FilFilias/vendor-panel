import { useTranslation } from "react-i18next";
import { data, Link, useLoaderData, LoaderFunction } from "react-router";
import type { MetaFunction } from "react-router";
import { getVendorsOrders } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { Button } from "~/components/ui/button";
import { DownloadCloud, Eye } from "lucide-react";

import OrdersList from "~/components/orders/OrdersList";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import OrdersListMobile from "~/components/orders/OrdersLisMobile";


export const loader: LoaderFunction = async ({ request, params }) => {

    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let {result,count,take,skip} = await getVendorsOrders(session.data["connect.sid"] as string,parseInt(page));
    let orders = result?.map( ord => ({
      id: ord.id,
      transactionID:ord.id.slice(-6),
      customer: ord.customer.company_name,
      date: new Date(ord.created_at).toLocaleString(),
      total: ord.total,
      currency: ord.currency_code
    }))

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.floor(skip / take) + 1;    
    const total = count
    return data({orders,count,totalPages,currentPage,total})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function OrdersListPage() {
  
  let {orders,currentPage,totalPages} = useLoaderData()
  let {t} = useTranslation()

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div className="flex max-sm:flex-col sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t("orders")}</h1>
          <p className="text-muted-foreground">Track and manage your customers orders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <Button variant="outline" className="flex items-center gap-2">
            <DownloadCloud className="h-4 w-4" />
            <span className="hidden sm:inline">{t("export")}</span>
          </Button> */}
          <Link to={`/order/create/select-customer`} className="px-4 py-2 flex items-center gap-2 bg-primary border border-primary rounded-md text-sm font-medium hover:bg-orange hover:border-orange text-white">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t("create")}</span>
          </Link>
        </div>
      </div>

      <div>
          <OrdersList orders={orders} />
          <OrdersListMobile orders={orders} />
          <div className="flex justify-center pt-4">
              <PaginationComp
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/orders"
              />
          </div>
      </div>
    </div>
  );
}