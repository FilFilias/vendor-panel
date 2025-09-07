import { ProductsListProps } from "./ProductsListDesktop"
import { ProductItemMobile } from "./ProductItemMobile"
import { useTranslation } from "react-i18next"

export const ProductsListMobile:React.FC<ProductsListProps> = ({products,handleDeleteClick,handleStatusUpdate}) => {

    let {t} = useTranslation()

    return (
        <div className="md:hidden space-y-4">
            {products.map((product) => (
                <ProductItemMobile product={product} handleDeleteClick={handleDeleteClick} handleStatusUpdate={handleStatusUpdate} key={product.id}/>
            ))}
            {products.length === 0 && (
            <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">{t("no_products_found")}</p>
            </div>
            )}
        </div>
    )
}