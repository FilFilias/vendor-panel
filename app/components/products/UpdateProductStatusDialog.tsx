
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { StoreVendorProduct } from "~/types/vendor";

interface UpdateProductStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: StoreVendorProduct;
}

export function UpdateProductStatusDialog({
  open,
  onOpenChange,
  product,
}: UpdateProductStatusDialogProps) {

  let fetcher = useFetcher()
  
  const onConfirm = () => {
    fetcher.submit({ _action:"update-status", id: product.id, status: product.status == 'published' ? 'draft' : 'published' }, { method: "post" });
  }

  let {t} = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("update_product_status")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("sure_to_update_status")}{' '} "{product.title}"? {' '} {t("action_irreversible")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white dark:bg-white border-primary dark:border-primary hover:bg-primary dark:hover:bg-primary dark:text-main dark:hover:text-white dark:hover:border-primary">{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} >
            {t("update")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
