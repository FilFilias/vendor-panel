import type { MetaFunction } from "@remix-run/node";
import { UserInfo } from "~/components/settings/User";
import { validateRoleInput, validateTextInput } from "~/lib/utils";
import { ActionFunctionArgs, data, LoaderFunction, redirect, useLoaderData, useRouteLoaderData } from "react-router";
import { UpdateVendorUserInfoByIDFormErrorsType, UpdateVendorUserInfoFormErrorsType } from "~/types/vendor";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { getVendorAdminByID } from "~/providers/vendor";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { 
    firstName,
    lastName,
    role,
    id
   } = Object.fromEntries(body)

   let errors:UpdateVendorUserInfoByIDFormErrorsType = {
    firstName: await validateTextInput('firstName',firstName),
    lastName: await validateTextInput('lastName',lastName),
    role: await validateRoleInput(role),
    id: await validateTextInput('id',id)
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendorAdmin = await sdk.client.fetch(`/vendor/update-admin/${id}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "first_name": firstName,
        "last_name": lastName,
        "role": role
      },
    })

    return data({vendorAdmin,success:true});
  } catch (error) {
    console.error(error)
    return data({error:error})
  }

}

export const loader: LoaderFunction = async ({ request, params }) => {

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  let userID = params.id
  let currentUser = await getVendorAdminByID(session.data["connect.sid"] as string, userID);

  if (currentUser?.role == 'user') {
    return redirect("/settings");
  }
  
  let user = {
    id: currentUser?.id,
    firstName: currentUser?.first_name,
    lastName: currentUser?.last_name,
    role: currentUser?.role,
    email: currentUser?.email
  }
  return data({user})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function EditUser() {

  let {user} = useLoaderData() 

  return (     
    <UserInfo user={user} includeRole={true} />
  );
}