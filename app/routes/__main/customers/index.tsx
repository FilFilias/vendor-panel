import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction } from "react-router";
import type { MetaFunction } from "react-router";
import { getVendorsCustomers } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { CustomersList } from "~/components/customers/CustomersList";


export const loader: LoaderFunction = async ({ request, params }) => {

    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let {result,count,take,skip} = await getVendorsCustomers(session.data["connect.sid"] as string,parseInt(page));

    let customers = result?.map( cus => ({
      id: cus.customer_id,
      name: cus.customer.company_name,
      email: cus.customer.email,
      createdAt: new Date(cus.customer.created_at).toLocaleString(),
    }))

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.floor(skip / take) + 1;    
    const total = count;
    
    // Calculate the range for the displayed customers
    const start = skip + 1;
    const end = Math.min(skip + take, count);

    return data({ customers, totalPages, currentPage, total, start, end });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function OrdersListPage() {
  
  let {customers,currentPage,totalPages,total,start,end} = useLoaderData()
  
  return (
    <div className="container mx-auto px-4 py-8">
        <CustomersList
            customers={customers}
            total={total}
            start={start}
            end={end}
        />
        <div className="flex justify-center pt-4">
            <PaginationComp
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/customers"
            />
        </div>
    </div>

  );
}