
import { Bell, ChevronDown, LogOut, Search, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouteLoaderData } from "react-router";
import { rootLoaderDataType } from "~/types/common";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import VentorLogo from "../VentorLogo";

export function TopBar() {

  let {user, vendor} = useRouteLoaderData("root") as rootLoaderDataType;
  let firstChar = user?.firstName?.charAt(0).toUpperCase();
  let lastChar = user?.lastName?.charAt(0).toUpperCase();
  let {t} = useTranslation()

  const handleLogoutClick = () => {
    console.log('Logout')
  }

  return (
    <div className="z-50 left-0 fixed w-full bg-primary dark:bg-gray-900 flex h-16 items-center justify-between border-b px-4">
      <div className={`flex items-center`}>
        <Link to="/dashboard" className="flex items-center gap-2">
          <VentorLogo height={40}/>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-inherit dark:bg-inherit dark:hover:bg-inherit">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-orange dark:bg-orange text-white">{firstChar}{lastChar}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-white dark:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to='/settings' className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-inherit"/>
            <DropdownMenuItem onClick={handleLogoutClick} asChild>
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
