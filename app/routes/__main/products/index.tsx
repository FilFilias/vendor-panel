import { useTranslation } from "react-i18next";
import { data, useLoaderData, LoaderFunction } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { getVendorsProducts } from "~/providers/vendor";
import { sessionStorage } from "~/lib/medusa-session";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { ProductsListDesktop } from "~/components/products/ProductsListDesktop";
import { useState } from "react";
import { StoreVendorProduct } from "~/types/vendor";
import { DeleteProductDialog } from "~/components/products/DeleteProductDialog";
import { ProductsListHeader } from "~/components/products/ProductsListHeader";
import { ProductsListFilters } from "~/components/products/ProductsListFilters";
import { ProductsListMobile } from "~/components/products/ProductsListMobile";
import { sdk } from "~/lib/config";
import { UpdateProductStatusDialog } from "~/components/products/UpdateProductStatusDialog";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const _action = body.get("_action");

  console.log(_action)
  switch (_action) {
    case "update-status": {
      try {
        let result = await sdk.client.fetch(`/vendor/product/update-status/${body.get("id")}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          },
          body: {
            "status": body.get("status")
          },
        })
        return data(result);
      } catch (error) {
        console.error(error)
        return data({error:error})
      }
    }
    case "delete-product": {
      try {
        let result = await sdk.client.fetch(`/vendor/product/delete/${body.get("id")}`,{
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

    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let {result,count,take,skip} = await getVendorsProducts(session.data["connect.sid"] as string,parseInt(page));

    let products = result

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.floor(skip / take) + 1;    
    const total = count
    return data({products,count,totalPages,currentPage,total})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function OrdersListPage() {
  
  let {products,currentPage,totalPages} = useLoaderData()
  let {t} = useTranslation()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<StoreVendorProduct | null>(null);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [productToUpdateStatus, setProductToUpdateStatus] = useState<StoreVendorProduct | null>(null);

  const handleDeleteClick = (product: StoreVendorProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handlStatusUpdateClick = (product: StoreVendorProduct) => {
    setProductToUpdateStatus(product);
    setStatusUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <ProductsListHeader />
      <ProductsListFilters />
      <div>
        <ProductsListDesktop products={products} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handlStatusUpdateClick} />
        <ProductsListMobile products={products} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handlStatusUpdateClick} />
        <div className="flex justify-center pt-4">
            <PaginationComp
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/products"
            />
        </div>
      </div>
      {productToDelete && (
        <DeleteProductDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          product={productToDelete}
        />
      )}
      {productToUpdateStatus && (
        <UpdateProductStatusDialog
          open={statusUpdateDialogOpen}
          onOpenChange={setStatusUpdateDialogOpen}
          product={productToUpdateStatus}
        />
      )}
    </div>
  );
}