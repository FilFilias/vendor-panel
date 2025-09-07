import { data, LoaderFunction } from "react-router";
import { themeCookie } from "~/lib/theme-cookies";
  
export let loader: LoaderFunction = async ({ request }) => {
    const theme = await themeCookie.parse(request.headers.get("Cookie"));

    let headers = new Headers()
    headers.append("Set-Cookie", await themeCookie.serialize(theme === "dark" ? "light" : "dark"));
    return data({theme:theme},{headers})
};