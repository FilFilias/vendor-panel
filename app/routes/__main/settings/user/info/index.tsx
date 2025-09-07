import type { MetaFunction } from "@remix-run/node";
import { UserInfo } from "~/components/settings/User";
import { validateTextInput } from "~/lib/utils";
import { ActionFunctionArgs, data, useRouteLoaderData } from "react-router";
import { UpdateVendorUserInfoFormErrorsType } from "~/types/vendor";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { rootLoaderDataType } from "~/types/common";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { 
    firstName,
    lastName,
   } = Object.fromEntries(body)

   let errors:UpdateVendorUserInfoFormErrorsType = {
    firstName: await validateTextInput('firstName',firstName),
    lastName: await validateTextInput('lastName',lastName)
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendorAdmin = await sdk.client.fetch('/vendor/update-admin/me',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "first_name": firstName,
        "last_name": lastName
      },
    })

    return data({vendorAdmin,success:true});
  } catch (error) {
    console.error(error)
    return data({error:error})
  }

}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function UserInfoPage() {

  let {user} = useRouteLoaderData('root') as rootLoaderDataType;

  return (       
    <UserInfo user={user} />
  );
}