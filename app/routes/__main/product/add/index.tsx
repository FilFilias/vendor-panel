import { data, useLoaderData, LoaderFunction, useFetcher } from "react-router";
import { sessionStorage } from "~/lib/medusa-session";
import { sdk } from "~/lib/config";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { redirect } from "react-router";
import { AddProductInfo } from "~/components/product/add/ProductInfo";
import { useState } from "react";
import { AddProductOptions } from "~/components/product/add/ProductOptions";
import { AddProductVariants } from "~/components/product/add/ProductVariant";
import { ProductVariant } from "~/components/product/add/ProductVariantForm";
import { LinkButton } from "~/components/ui/buttoLink";
import { Button } from "~/components/ui/button";
import { getCategoriesList } from "~/providers/categories";
import { getTaxTypes } from "~/providers/products";

export async function action({
    request,
  }: ActionFunctionArgs) {
  const body = await request.formData();
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    const product = JSON.parse(body.get("product") as string)
    console.log(product)
    let result = await sdk.client.fetch(`/vendor/product/create`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: product,
    })

    if (result?.product?.id) {
      return redirect(`/product/edit/${result.product.id}`)
    }

    return data({result});
  } catch (error) {
    console.error(error)
    return data({error:error})
  }

}

export const loader: LoaderFunction = async ({ request, params }) => {

    let session = await sessionStorage.getSession(request.headers.get("Cookie"))

    const [
      rawCategories,
      taxTypes
    ] = await Promise.all([
      getCategoriesList(),
      getTaxTypes()
    ])
    
    const categories = rawCategories.map( category => ({
        id: category.id,
        value: category.id,
        label: category.metadata.mpath
    }))

    let taxes = taxTypes.map( tax => ({
      id: tax.id,
      value: tax.metadata.vat_status
    }))
    
    taxes = taxes.sort((a, b) => a.value - b.value);

    return data({ categories,taxes });
};

export const meta: MetaFunction = () => {
    return [
      { title: "New Remix App" },
      { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function ProductPage() {

  let fetcher = useFetcher()
  let { taxes } = useLoaderData();

  const [stateVariants, setVariants] = useState<ProductVariant[]>([])
  const [stateDefaultVariant, setStateDefaultVariant] = useState<ProductVariant>({
    options: [{
        name: "Default",
        value:"Default"
    }],
    price: 0,
    stock: 0,
    barcode: "",
    sku: ""
  })
  const [stateVat, setStateVat] = useState(taxes.filter( tax => tax.value == 24)[0])

  const [formState, setFormState] = useState({
    id: undefined,
    title: undefined,
    description: undefined,
    color: undefined,
    category: {
        id: undefined,
        value: undefined,
        label: undefined
    },
  });
  const [hasOptions, setHasOption] = useState(false);
  const [options,setOptions] = useState({Size:false})

  const onOptionsSwitchClick = () => {
    setHasOption(prevState => !prevState)
    setVariants([])
  }

  const onProductCreate = (e:Event) => {
    e.preventDefault();

    const payload = {
      ...formState,
      vatType: stateVat,
      category: [formState.category?.id],
      variants: hasOptions ? stateVariants : [stateDefaultVariant]
    }

    fetcher.submit({ _action:"create-product", product: JSON.stringify(payload) }, { method: "post" });
  }

  const handleVatChange = (vatValue:number) => {
    setStateVat( taxes.filter( tax => tax.value == vatValue)[0])
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl w-full overflow-x-hidden">
      <div className="mb-6">
              <h1 className="dark:text-white text-2xl font-bold">Add Product</h1>
              <p className="text-muted-foreground">Add details for this product.</p>
      </div>
      <div className="dark:bg-gray-800 w-full space-y-8">
        <div className="rounded-lg border p-6 ">
            < AddProductInfo 
              hasOptions={hasOptions} 
              stateDefaultVariant={stateDefaultVariant}
              setStateDefaultVariant={setStateDefaultVariant}
              formState={formState}
              setFormState={setFormState} 
              handleVatChange={handleVatChange} 
              stateVat={stateVat}
            />
            <AddProductOptions onOptionsSwitchClick={onOptionsSwitchClick} hasOptions={hasOptions} options={options} setOptions={setOptions} />
            {hasOptions &&
              <AddProductVariants options={options} stateVariants={stateVariants} setVariants={setVariants}/>
            }
            <div className="flex flex-wrap justify-end gap-2 pt-8 mt-2">
              <LinkButton 
                variant="outline" 
                to={"/products"}
                className="grow"
              >
                Cancel
              </LinkButton>
              <Button onClick={onProductCreate} className="grow">
                Create Product
              </Button>
            </div>
          </div>

      </div>
    </div>
  )
}