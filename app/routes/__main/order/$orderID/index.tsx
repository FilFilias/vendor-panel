import type { MetaFunction } from "react-router";
import { data, useLoaderData } from "react-router";
import { LoaderFunction } from "react-router";
import { sdk } from "~/lib/config";
import { LinkButton } from "~/components/ui/buttoLink";
import { ArrowLeft } from "lucide-react";
import { OrderNotFound } from "~/components/order/OrderNotFound";
import { OrderShippingAddress } from "~/components/order/OrderShippingAddress";
import { OrderItems } from "~/components/order/OrderItems";
import { OrderSummary } from "~/components/order/OrderSummary";
import { OrderComments } from "~/components/order/OrderComments";
import { useTranslation } from "react-i18next";
import { getOrder } from "~/providers/orders";

export const loader: LoaderFunction = async ({ request, params }) => {
  let orderID = params.orderID

  let order = await getOrder(orderID as string)

  let orderInfo = null
  if (order?.id && order?.items && order?.shipping_address && order?.billing_address && order?.customer) {
    let surcharge = order.items.filter( item => item.title == 'Surcharge')[0]

    let surchargeCost = surcharge ? surcharge.unit_price * 1.24 : 0
    let surchargeTax = surcharge ? surcharge.unit_price * 0.24 : 0
    let surchargeUnit = surcharge ? surcharge.unit_price : 0

    orderInfo = {
      id: order.id,
      transactionID: order.id.slice(-6),
      shippingAddress: {
        customerID: order.customer.id,
        address: order.shipping_address.address_1,
        city: order.shipping_address.city,
        postalCode: order.shipping_address.postal_code,
        phoneNumber: order.shipping_address.phone,
        countryCode: order.shipping_address.country_code,
        email: order.email,
        company: order.customer.company_name
      },
      items: order.items.filter( item => item.title !== 'Surcharge').map(it => ({
        id: it.variant_id,
        title: it.product_title,
        dimension: it.variant_title == 'Default' ? null : it.variant_title,
        price: it.subtotal,
        totalPrice: it.total,
        quantity: it.quantity,
        imageUrl: it.thumbnail
      })),
      itemsCount: order.items.reduce( (acc,cur) => acc + cur.quantity,0),
      subtotal: Math.round((order.subtotal - surchargeUnit) * 100) / 100,
      taxTotal: Math.round((order.tax_total - surchargeTax) * 100) / 100,
      total: order.total,
      currency: order.currency_code,
      surcharge: surchargeCost,
      date: new Date(order.created_at).toLocaleString(),
      comments: order.billing_address.metadata?.comments

    }
  }

  return data({orderInfo})

};
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function OrderInfdo() {

  let {orderInfo} = useLoaderData();
  let {t} = useTranslation()
  
  if (!orderInfo) {
    return <OrderNotFound />
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <LinkButton variant="outline" to={"/orders"} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back_to_orders")}
        </LinkButton>
      </div>
      {orderInfo &&
        <div className="space-y-6">
          {/* Order Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{orderInfo.transactionID}</h1>
            <p className="text-muted-foreground">{orderInfo.date}</p>
          </div>
          <OrderShippingAddress shippingAddress={orderInfo.shippingAddress} />
          <OrderItems items={orderInfo.items} currency={orderInfo.currency} />
          { orderInfo.comments && <OrderComments comments={orderInfo.comments} /> }
          <OrderSummary
            subtotal={orderInfo.subtotal}
            taxTotal={orderInfo.taxTotal}
            totalAmount={orderInfo.total}
            currency={orderInfo.currency}
            surcharge={orderInfo.surcharge}
          />
        </div>
      }
    </div>
  )
};
