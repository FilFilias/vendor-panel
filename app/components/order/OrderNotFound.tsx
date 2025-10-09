import { ArrowLeft } from "lucide-react";
import { LinkButton } from "../ui/buttoLink";
import { useTranslation } from "react-i18next";

export const OrderNotFound = () => {

    let {t} = useTranslation()

    return (
        <div className="container mx-auto px-4 py-8">
            <LinkButton variant="outline" to={"/orders"} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("back_to_orders")}
            </LinkButton>
            <div className="text-center py-12">
                <h2 className="dark:text-white text-lg font-medium">{t("order_not_found")}</h2>
                <p className="text-muted-foreground mt-2">{t("order_not_exist")}</p>
            </div>
        </div>
    )
}