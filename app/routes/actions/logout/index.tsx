import { LoaderFunctionArgs } from "react-router";

import { sessionStorage } from "~/lib/medusa-session";
import { redirect } from "@remix-run/node";


export async function loader({
  request,
}: LoaderFunctionArgs) {
  let headers = new Headers(request.headers)
  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  
  try{
    headers.set("Set-Cookie", await sessionStorage.destroySession(session))
  
    return redirect('/login',{headers})
  
  }
  catch (err) {
    console.log(err)
  }

}