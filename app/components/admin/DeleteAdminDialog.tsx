
import { useTranslation } from "react-i18next";
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

interface DeleteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (adminID:string) => void;
  adminName: string;
  adminID: string;
}

export function DeleteAdminDialog({
  open,
  onOpenChange,
  adminName,
  onConfirm,
  adminID
}: DeleteAdminDialogProps) {

  let {t} = useTranslation()

  const handleConfirm = () => {
    onConfirm(adminID)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("user_delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("user_delete_msg")} {adminName}? {t("action_irreversible")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground">
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
