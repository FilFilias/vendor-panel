import { useFetcher, useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { rootLoaderDataType } from "~/types/common";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { DeleteAdminDialog } from "../admin/DeleteAdminDialog";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import { UserBlock } from "./UserBlock";
import { StoreVendorAdmin } from "~/types/vendor";
import { useTranslation } from "react-i18next";

export const UsersList = () => {

    let users = useLoaderData() as StoreVendorAdmin[];
    let rootData = useRouteLoaderData("root") as rootLoaderDataType;
    let currentUser = rootData.user

    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<{ id: string; name: string } | null>(null);
    let fetcher = useFetcher()
    let {t} = useTranslation()

    const handleDeleteAdmin = (adminId: string) => {
        fetcher.submit({'vendorAdminID': adminId},{method:"DELETE"})
        // Close the dialog after action
        setDeleteDialogOpen(false);
                
        // Reset admin to delete
        setAdminToDelete(null);
    };

    const handleCreateAdmin = () => {
        navigate("/settings/user/create");
    };

    const openDeleteDialog = (admin: StoreVendorAdmin) => {
        setAdminToDelete({
            id: admin.id,
            name: `${admin.first_name} ${admin.last_name}`
        });
        setDeleteDialogOpen(true);
    };

    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t("users")}</CardTitle>
                <CardDescription>{t("users_list_desc")}</CardDescription>
            </div>
            <Button onClick={handleCreateAdmin}>
                <Plus className="mr-2 h-4 w-4" />
                {t("add_user")}
            </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow className="hover:bg-inherit">
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        return (
                            <UserBlock user={user} openDeleteDialog={openDeleteDialog} key={user.id} disabled={currentUser?.id == user.id} />
                        );
                    })}
                </TableBody>
            </Table>
            </CardContent>
            {adminToDelete && (
                <DeleteAdminDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteAdmin}
                adminName={adminToDelete.name}
                adminID={adminToDelete.id}
                />
            )}
      </Card>
    )
}