import { Plus } from "lucide-react"
import { LinkButton } from "../ui/buttoLink"
import { useTranslation } from "react-i18next"

export const ProductsListHeader = () => {

    let {t} = useTranslation()

    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t("products")}</h1>
                <p className="text-muted-foreground">{t("manage_product_inventory")}</p>
            </div>
            <LinkButton className="bg-primary hover:bg-orange" to={"/product/add"} >
            <Plus className="mr-2 h-4 w-4" />
                <span className={"hidden sm:inline"}>{t("add_product")}</span>
                <span className={"inline md:hidden"}>{t("add")}</span>
            </LinkButton>
        </div>
    )
}