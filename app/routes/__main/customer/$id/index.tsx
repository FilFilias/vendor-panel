import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction } from "react-router";
import type { MetaFunction } from "react-router";
import { getVendorsCustomer, getVendorsCustomers } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { CustomersList } from "~/components/customers/CustomersList";
import { CustomerDetails } from "~/components/customers/CustomerDetails";
import { CustomerOrders } from "~/components/customers/CustomerOrders";
import { CustomerAddresses } from "~/components/customers/CustomerAddresses";


export const loader: LoaderFunction = async ({ request, params }) => {

    let id = params.id
    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let {customer,count,take,skip} = await getVendorsCustomer(session.data["connect.sid"] as string,parseInt(page),id as string);
    
    const totalPages = Math.ceil(count / take);
    const currentPage = Math.floor(skip / take) + 1;    
    const total = count;
    
    // Calculate the range for the displayed customers
    const start = skip + 1;
    const end = Math.min(skip + take, count);

    return data({ customer,currentPage,totalPages,total,start,end });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function OrdersListPage() {
  
  let {customer,currentPage,totalPages,total,start,end} = useLoaderData()
  let {t} = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      {customer ?
      <>
        <CustomerDetails customer={customer}/>
        <CustomerAddresses addresses={customer.addresses} />
        <CustomerOrders orders={customer.orders} total={total} start={start} end={end}/>
        <div className="flex justify-center pt-4">
          <PaginationComp
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/customer/${customer.id}`}
          />
        </div>
      </>
      :
        <h6>{t("customer_not_found")}</h6>
      }
    </div>

  );
}