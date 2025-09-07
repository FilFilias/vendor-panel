import { Link, } from "react-router";
import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { StoreVendorAdmin } from "~/types/vendor";

type UserBlockProps = {
    user: StoreVendorAdmin;
    openDeleteDialog: (user: StoreVendorAdmin) => void;
    disabled: boolean;
}
export const UserBlock: React.FC<UserBlockProps> = ({user,openDeleteDialog,disabled}) => {

    const onDeleteClick = () => {
        openDeleteDialog(user)
    }

    return (
        <TableRow key={user.id} className=" transition-colors">
            <TableCell>
                {user.first_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end gap-2">

                    <Link
                        className="dark:bg-inherit inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                        to={`/settings/user/edit/${user.id}`}
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onDeleteClick}
                        disabled={disabled}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}