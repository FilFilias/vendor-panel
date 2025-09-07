import { TableCell,TableRow} from "~/components/ui/table";
import { StoreVendorProduct } from "~/types/vendor";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { Edit } from "lucide-react";

export type ProductsItemProps = {
    product: StoreVendorProduct;
    handleDeleteClick: ((product:StoreVendorProduct) => void)
    handleStatusUpdate: ((product:StoreVendorProduct) => void)
}

export const ProductItemsDesktop:React.FC<ProductsItemProps> = ({product,handleDeleteClick,handleStatusUpdate}) => {
    
    const onDeleteClick = () => {
        handleDeleteClick(product)
    }

    const onStatusChange = () => {
        handleStatusUpdate(product)
    }

    return (
        <TableRow>
            <TableCell>
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 p-2">
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="h-full w-full object-contain mix-blend-multiply"
                    onError={(e) => {
                        e.currentTarget.src = "/ventor_placeholder.png";
                    }}
                />
            </div>
            </TableCell>
            <TableCell className="font-medium dark:text-white">{product.title}</TableCell>
            <TableCell className="text-center">
            <Switch
                checked={product.status == 'published'}
                onCheckedChange={onStatusChange}
            />
            </TableCell>
            <TableCell>
                <Link to={`/product/edit/${product.id}`} className="flex justify-center">
                    <Edit className="text-main dark:text-white"/>
                </Link>
            </TableCell>
            <TableCell className="text-center">
            <Button 
                size="icon" 
                variant="ghost"
                onClick={onDeleteClick}
                className="dark:text-destructive text-destructive hover:text-destructive dark:bg-inherit dark:hover:bg-inherit" 
            >
                <Trash className="h-4 w-4" />
            </Button>
            </TableCell>
        </TableRow>
    )
}