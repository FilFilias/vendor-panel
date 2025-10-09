import { data, useLoaderData, LoaderFunction } from "react-router";
import { sessionStorage } from "~/lib/medusa-session";
import { sdk } from "~/lib/config";
import { ProductVariant } from "~/components/product/ProductVariant";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { redirect } from "react-router";
import { ProductInfo } from "~/components/product/ProductInfo";
import { getVendorsProductByID } from "~/providers/vendor";
import { getTaxTypes } from "~/providers/products";
import { getCategoriesList } from "~/providers/categories";
import { useTranslation } from "react-i18next";

export async function action({
    request,
  }: ActionFunctionArgs) {
    const body = await request.formData();
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    const _action = body.get("_action");

    switch (_action) {
      case "update-product": {
        try {
          const product = JSON.parse(body.get("product") as string)
          let result = await sdk.client.fetch(`/vendor/product/update/${product.id}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${session.data['connect.sid']}`
            },
            body: {
              "title": product.title,
              "description": product.description,
              "categories": [{"id": product.category?.id}],
              "vatType": product.vatType,
              "color": product.color
            },
          })
          return data(result);
        } catch (error) {
          console.error(error)
          return data({error:error})
        }
      }
      case "update-product-variant": {
        try {
          let variant = JSON.parse(body.get("variant") as string)
          const size = variant.options.filter( opt => opt.title == 'Size')[0]
          const title = size?.value

          if (title && title !== ' ') {
            variant.title = title  
          }
          
          let result = await sdk.client.fetch(`/vendor/product/variant/update/${variant.id}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${session.data['connect.sid']}`
            },
            body: variant,
          })
          return data(result);
        } catch (error) {
          console.error(error)
          return data({error:error})
        }
      }
      case "delete-product": {
        try {
          await sdk.client.fetch(`/vendor/product/delete/${body.get("id")}`,{
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${session.data['connect.sid']}`
            }
          })
          console.log('product deleted successfully!')
          return redirect('/products');
        } catch (error) {
          console.error(error)
          return data({error:error})
        }
      }
      case "delete-product-variant": {
        try {
          let result = await sdk.client.fetch(`/vendor/product/variant/delete/${body.get("id")}`,{
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
      default:
        return data({ error: "Unknown action" }, { status: 400 });
    }
}

export const loader: LoaderFunction = async ({ request, params }) => {

    let id = params.id
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))

    const [
      rawProduct,
      rawCategories,
      taxTypes
    ] = await Promise.all([
      getVendorsProductByID(session.data["connect.sid"] as string,id as string),
      getCategoriesList(),
      getTaxTypes()
    ])

    if (rawProduct?.id) {
      let product = {
          id: rawProduct.id,
          external_id: rawProduct.external_id,
          title: rawProduct.title,
          description: rawProduct.description,
          imageUrl: rawProduct.thumbnail,
          color: rawProduct.metadata?.color,
          options: rawProduct.options.map( option => ({
              id: option.id,
              title: option.title
          })),
          vatType: {
            id: rawProduct?.type?.id,
            value:rawProduct?.type?.metadata?.vat_status
          },
          category: {
              mpath: rawProduct.categories[0].metadata?.mpath,
              id: rawProduct.categories[0].id
          },
          variants: rawProduct.variants?.map( variant => ({
              id: variant.id,
              product_id: rawProduct.id,
              title: variant.title,
              sku: variant.sku,
              barcode: variant.barcode,
              prices: variant.prices.map( price => ({
                  id: price.id,
                  amount: price.amount,
                  currency_code: price.currency_code,
                  price_list_id: price.price_list_id
              })),
              inventory: variant.inventory,
              options: variant.options.map( option => ({
                  id: option.id,
                  value: option.value,
                  option_id: option.option_id,
                  title: option.option?.title
              }))
          }))
      }

      let taxes = taxTypes.map( tax => ({
        id: tax.id,
        value: tax.metadata.vat_status
      }))
      
      taxes = taxes.sort((a, b) => a.value - b.value);

      const categories = rawCategories.map( category => ({
          id: category.id,
          value: category.id,
          label: category.metadata.mpath
      }))

      return data({ product,categories,taxes });
    }
    else {
      return data({ product:null,categories:null,taxes:null });
    }
};

export const meta: MetaFunction = () => {
    return [
      { title: "New Remix App" },
      { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function ProductPage() {

    let {product} = useLoaderData();
    let {t} = useTranslation();
    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl w-full overflow-x-hidden">
            <div className="mb-6">
                    <h1 className="dark:text-white text-2xl font-bold">Edit Product</h1>
                    <p className="text-muted-foreground">Update the details for this product.</p>
            </div>
            {product ?
              <div className="dark:bg-gray-800 w-full">
                  < ProductInfo />
                  <div className="rounded-lg border my-16">
                      <div className="p-6 space-y-8">
                          <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <h2 className="dark:text-white text-lg font-semibold">Product Variations</h2>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                  <div className="space-y-4 w-full">
                                      {product.variants.map( variant => (
                                          <ProductVariant key={variant.id} variant={variant}/>
                                      ))}

                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            : 
              <div className="text-center py-12">
                  <h2 className="dark:text-white text-lg font-medium">{t("product_not_found")}</h2>
                  <p className="text-muted-foreground mt-2">{t("product_not_exist")}</p>
              </div>

            }
        </div>
    )
}