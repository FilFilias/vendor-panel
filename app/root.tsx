import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
  data,
  type LoaderFunction,
  type LinksFunction,
  redirect
} from "react-router";
import "./tailwind.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { themeCookie } from "./lib/theme-cookies";
import { sdk } from "./lib/config";
import { sessionStorage } from "./lib/medusa-session";
import { getVendorAdmin, getVendorByDomain } from "./providers/vendor";
import { GlobalLoader } from "./components/atoms/GlobalLoader";
import { i18nCookie } from "./lib/locale-cookie";
import { useTranslation } from "react-i18next";
import { getLocale,i18nextMiddleware } from "./middleware/i18next";

import "./tailwind.css";

export const unstable_middleware = [i18nextMiddleware];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request, context }) => {
  let locale = getLocale(context);
  let headers = new Headers();
  headers.set("Set-Cookie", await i18nCookie.serialize(locale));

  let url =  new URL(request.url);
  let vendorURL = url.host
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const cookieHeader = request.headers.get("Cookie");
  const theme = (await themeCookie.parse(cookieHeader)) || "light";

  let vendor = await getVendorByDomain(vendorURL);

  if (!session.has("connect.sid") && url.pathname !== "/login" ) {
    return redirect("/login");
  }
 
  let user

  if (session.has("connect.sid")) {
    let vendorAdmin = await getVendorAdmin(session.data["connect.sid"]);
    if (!vendorAdmin || vendorAdmin?.vendor_id !== vendor?.id) {
      headers.set("Set-Cookie", await sessionStorage.destroySession(session))
      return redirect("/login", { headers });
    }

    user = {
      id: vendorAdmin.id,
      firstName: vendorAdmin.first_name,
      lastName: vendorAdmin.last_name,
      email: vendorAdmin.email,
      createdAt: vendorAdmin.created_at,
      role: vendorAdmin.role,
    }
  }

  let localeCookie = await i18nCookie.parse(cookieHeader);

  if (!theme) {
    headers.set("Set-Cookie", await themeCookie.serialize('light'));
  }
  if (!localeCookie) {
    headers.set("Set-Cookie", await i18nCookie.serialize('el'));

  }
  return data({ theme, vendor, user }, { headers });

};

export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl }) => {
  if (currentUrl.pathname !== nextUrl.pathname) {
    return true;
  }
  return false;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation()

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)} className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider defaultTheme={theme}>
          <GlobalLoader />
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
