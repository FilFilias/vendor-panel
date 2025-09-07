import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

type OrderCommentsProps = {
    comments:string;
}

export const OrderComments:React.FC<OrderCommentsProps> = ({comments}) => {

    let {t} = useTranslation()
    
    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
                <CardTitle>{t("order_comments")}</CardTitle>
            </CardHeader>
            <CardContent>
                <span className="text-muted-foreground">{comments}</span>
            </CardContent>
        </Card>
    )
}