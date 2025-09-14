import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { sessionStorage } from "~/lib/medusa-session";
import { salesChannelCookie } from "~/lib/sales-channel-cookie";
import { sdk } from "~/lib/config";
import { OrderProductCard } from "~/components/order/create/ProductsList";
import { getDraftOrder } from "~/providers/orders";
import { CreateOrderCart } from "~/components/order/create/OrderCart";
import { PaginationComp } from "~/components/pagination/PaginationComp";

export async function action({
  request,
  params
}: ActionFunctionArgs) {
  const body = await request.formData();
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const id = params.orderID as string

  const _action = body.get("_action");

  switch (_action) {
    case "add-to-cart": {
      try {
        const variant_id = body.get("variant_id" as string)
        const unit_price = body.get("unit_price" as string)
        const quantity = body.get("quantity" as string)

        let result = await sdk.client.fetch(`/vendor/draft-orders/${id}/add-to-cart`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          },
          body: {
            variant_id,
            quantity,
            unit_price
          },
        })
        return data(result);
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    case "remove-from-cart": {
      try {
        const item_id = body.get("item_id" as string)

        let result = await sdk.client.fetch(`/vendor/draft-orders/${id}/remove-from-cart/${item_id}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          }
        })
        return data(result);
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    case "change-item-quantity": {
      try {
        const item_id = body.get("item_id" as string)
        const quantity = body.get("quantity" as string)

        let result = await sdk.client.fetch(`/vendor/draft-orders/${id}/update-item-quantity/${item_id}`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          },
          body: {
            quantity: parseInt(quantity)
          },
        })

        return data(result);
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
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
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
        availability: item.availability
      })),
      id: draft_order.id,
      taxTotal: draft_order.item_tax_total ?? 0,
      subTotal: draft_order.item_subtotal ?? 0,
      total: draft_order.item_total ?? 0,
      currency: draft_order.currency_code
    }
    
    const salesChannelID = await salesChannelCookie.parse(request.headers.get("Cookie"));
    console.log('salesChannelID: ',salesChannelID)
    const limit = 12;
    const page = urlSearchParams.page ?? 1;

    const {regions} = await sdk.store.region.list()
    const selectedRegion = regions.filter( region => region.countries?.filter( country => country.iso_2 == 'gr')[0])[0]
    const regionID = selectedRegion.id
    // Fetch products for the current category
    const { products, count, offset } = await sdk.store.product.list({
      sales_channel_id: salesChannelID,
      region_id: regionID,
      country_code: 'gr',
      limit: limit,
      offset: Math.max(0, (parseInt(page) - 1) * limit),
      fields:'+variants.inventory_quantity'
    });

    const totalProducts = count;
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;
  
    // Prepare response data
    const paginationLink = url.pathname;

    let mappedProducts = []
    products.map( prod => {
      prod.variants.map( variant => {
        const cartItem = cart.items.filter( item => item.variant_id == variant.id)[0]
        mappedProducts.push({
          id: variant.id,
          product_id: prod.id,
          name: prod.title,
          dimension: variant.title,
          sku: variant.sku,
          image: prod.thumbnail,
          price: parseFloat(variant.calculated_price?.calculated_amount_without_tax),
          price_vat: parseFloat(variant.calculated_price?.calculated_amount_with_tax),
          cart_count: cartItem?.quantity ?? 0,
          cart_id:cartItem?.id,
          available: variant.inventory_quantity
        })
      })
    })  

  return data({ mappedProducts,cart,currentPage,totalPages,paginationLink });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function CustomerOrderCreatePage() {
  
  let {mappedProducts,cart, currentPage,totalPages,paginationLink} = useLoaderData()
  let {t} = useTranslation()
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="dark:text-white text-2xl font-bold">Create New Order</h1>
          <p className="text-muted-foreground">Step 2: Add products</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            {mappedProducts.map( prod => {
              return <OrderProductCard product={prod} currency={cart.currency} key={prod.id} />
            })}
          </div>
        </div>
        <CreateOrderCart />
      </div>
      <div className="flex justify-center pt-4">
          <PaginationComp
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={paginationLink}
          />
      </div>
    </div>

  );
}