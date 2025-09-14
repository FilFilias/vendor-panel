import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction, redirect } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { sessionStorage } from "~/lib/medusa-session";
import { salesChannelCookie } from "~/lib/sales-channel-cookie";
import { sdk } from "~/lib/config";
import { OrderProductCard } from "~/components/order/create/ProductsList";
import { getDraftOrder } from "~/providers/orders";
import { CreateOrderCart } from "~/components/order/create/OrderCart";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { OrderSummary } from "~/components/order/create/OrderSummary";
import { getVendorsCustomer } from "~/providers/vendor";
import { OrderCustomerInfo } from "~/components/order/create/OrderCustomerInfo";

export async function action({
  request,
  params
}: ActionFunctionArgs) {
  const body = await request.formData();
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const id = params.orderID as string

  const _action = body.get("_action");
  switch (_action) {
    case "update-address": {
      try {
        const address = body.get("address" as string)

        let result = await sdk.client.fetch(`/vendor/draft-orders/${id}/update-address`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          },
          body: JSON.parse(address),
        })
        return data({result});
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    case "complete-order": {
      try {
        let result = await sdk.client.fetch(`/vendor/draft-orders/${id}/complete`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          }
        })
        return redirect('/orders');
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    default:
      return data({ error: "Unknown action" }, { status: 400 });
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {

    let id = params.orderID as string
    const url = new URL(request.url);
  
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))

    const {draft_order} = await getDraftOrder(session.data['connect.sid'],id)
    const cart = {
      items: draft_order?.items.map( item => ({
        id: item.id,
        name: item.title,
        image: item.thumbnail,
        price: item.unit_price,
        quantity: item.quantity,
        dimension: item.variant_title,
        sku: item.variant_sku,
        variant_id: item.variant_id,
        product_id: item.product_id,
        availability: item.availability,
        total: item.total
      })),
      taxTotal: draft_order.item_tax_total ?? 0,
      subTotal: draft_order.item_subtotal ?? 0,
      total: draft_order.item_total ?? 0,
      currency: draft_order.currency_code
    }

    let {customer} = await getVendorsCustomer(session.data["connect.sid"] as string,1,draft_order.customer_id as string);
  return data({ cart,customer });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function CustomerOrderCreatePage() {
  
  let {cart } = useLoaderData()
  let {t} = useTranslation()
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Complete Order</h1>
          <p className="text-muted-foreground">Step 3: Review and complete</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderSummary />
        <OrderCustomerInfo />
      </div>
    </div>
  );
}