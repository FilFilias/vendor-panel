import { Trash } from "lucide-react"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { ProductsItemProps } from "./ProductItemsDesktop"
import { useTranslation } from "react-i18next"
import { Edit } from "lucide-react";
import { Link } from "react-router"

export const ProductItemMobile:React.FC<ProductsItemProps> = ({product,handleDeleteClick,handleStatusUpdate}) => {
        
    const onDeleteClick = () => {
        handleDeleteClick(product)
    }

    const onStatusChange = () => {
        handleStatusUpdate(product)
    }

    let {t} = useTranslation()

    return (
        <div key={product.id} className="bg-card dark:bg-gray-800 dark:text-white rounded-lg border p-4">
            <div className="flex items-start gap-3">

                <Link to={`/product/edit/${product.id}`} >
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0  bg-gray-200 p-2">
                        <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="h-full w-full object-contain mix-blend-multiply"
                        />
                    </div>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                    <Link to={`/product/edit/${product.id}`} >
                        <h3 className="font-medium text-base leading-tight line-clamp-2">{product.title}</h3>
                    </Link>
                    <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={onDeleteClick}
                        className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive dark:bg-inherit dark:hover:bg-inherit"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">{t("visibility")}:</span>
                        <Switch
                            checked={product.status == 'published'}
                            onCheckedChange={onStatusChange}
                        />
                        <span className="text-sm">
                            {product.status == 'published' ? t("published") : t("unpublished")}
                        </span>
                    </div>
                </div>
            </div>
        </div>

    )
}