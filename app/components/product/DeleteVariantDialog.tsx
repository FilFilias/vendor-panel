
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

interface DeleteVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: {
    id: string;
    title: string;
  }
}

export function DeleteVariantDialog({
  open,
  onOpenChange,
  variant,
}: DeleteVariantDialogProps) {

  let fetcher = useFetcher()
  
  const onConfirm = () => {
    fetcher.submit({ _action:"delete-product-variant", id: variant.id }, { method: "delete" });
  }

  let {t} = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete_product")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("sure_to_delete_variant")}{' '} "{variant.title}"? {' '} {t("action_irreversible")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel className="bg-white dark:bg-white border-primary dark:border-primary hover:bg-primary dark:hover:bg-primary dark:text-main dark:hover:text-white dark:hover:border-primary">{t("cancel")}</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive dark:bg-destructive  text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive/90">
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
