import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { data, Link, useLoaderData, LoaderFunction } from "react-router";
import type { MetaFunction } from "react-router";

export const loader: LoaderFunction = async ({ request, params }) => {

  let url =  new URL(request.url);
  let pathname = url.pathname;

  return data({pathname})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Settings() {
  
  let {pathname} = useLoaderData() as { pathname: string };
  let {t} = useTranslation()

  let btnClassName = "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:text-white dark:hover:text-orange";
  let activeBtn = ' bg-primary dark:bg-gray-800 text-white'
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">{t("settings")}</h1>
        <p className="text-muted-foreground">{t("manage_account")}</p>
      </div>
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted dark:bg-gray-800 p-1 text-muted-foreground mb-6">
        <Link to="/settings" className={btnClassName + (pathname == "/settings" ? activeBtn : "")} >{t("company_profile")}</Link>
        <Link to="/settings/user/info" className={btnClassName + (pathname == "/settings/user/info"  ? activeBtn : "")}>{t("user")}</Link>
        <Link to="/settings/users-list" className={btnClassName + (pathname == "/settings/users-list" ? activeBtn : "")}>{t("users_list")}</Link>
      </div>
      <Outlet />  
    </div>
  );
}