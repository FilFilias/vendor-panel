import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table";
import { StoreVendorProduct } from "~/types/vendor";
import { ProductItemsDesktop } from "./ProductItemsDesktop";
import { useTranslation } from "react-i18next";
  
export type ProductsListProps = {
    products: StoreVendorProduct[] | [];
    handleDeleteClick: ((product:StoreVendorProduct) => void)
    handleStatusUpdate: ((product:StoreVendorProduct) => void)
}

export const ProductsListDesktop:React.FC<ProductsListProps> = ({products,handleDeleteClick,handleStatusUpdate}) => {
    
    let {t} = useTranslation()

    return (
        <div className="hidden md:block rounded-lg border bg-card dark:bg-gray-800">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-inherit">
                    <TableHead>{t("image")}</TableHead>
                    <TableHead>{t("title")}</TableHead>
                    <TableHead className="text-center">{t("visibility")}</TableHead>
                    <TableHead className="text-right"></TableHead>
                    <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <ProductItemsDesktop product={product} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handleStatusUpdate} key={product.id} />
                    ))}
                    {products.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center dark:text-white">
                            {t("no_products_found")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}