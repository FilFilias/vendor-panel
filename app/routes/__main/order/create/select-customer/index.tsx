import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction, ActionFunctionArgs,redirect } from "react-router";
import type { MetaFunction } from "react-router";
import { getVendorsCustomers } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { OrderCustomersList } from "~/components/order/create/CustomersList";
import { sdk } from "~/lib/config";
import { createDraftOrder } from "~/providers/orders";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  console.log(body)
  let { 
    email,
    customer_id,
    region_id
   } = Object.fromEntries(body)

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let draftOrder = await createDraftOrder(session.data['connect.sid'],email,customer_id,region_id)

    if (draftOrder.id) {
      return redirect(`/order/create/${draftOrder.id}`);
    }
    return data({draftOrder})
  } catch (error) {
    console.error(error)
    return data({error:error})
  }

}


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

    const {regions} = await sdk.store.region.list()
    const selectedRegion = regions.filter( region => region.countries?.filter( country => country.iso_2 == 'gr')[0])[0]
    const region_id = selectedRegion.id

    return data({ customers, totalPages, currentPage, total, start, end, region_id });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

export type CreateOrderSelectClient = {
  customers: Customer[];
  total: number;
  start: number;
  end: number;
  region_id:string;
  currentPage:number;
  totalPages:number;
};

export default function OrdersListPage() {
  
  let {currentPage,totalPages} = useLoaderData()

  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="flex flex-wrap gap-y-4 items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Create New Order</h1>
          <p className="text-muted-foreground">Step 1: Select a client</p>
        </div>
      </div>
      <div className="container mx-auto px-0">
          <OrderCustomersList />
          <div className="flex justify-center pt-4">
              <PaginationComp
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/customers"
              />
          </div>
      </div>
    </div>

  );
}