import type { MetaFunction } from "@remix-run/node";
import { validateConfirmPassword, validateRoleInput, validateTextInput } from "~/lib/utils";
import { ActionFunctionArgs, data, redirect } from "react-router";
import { CreateVendorUserFormErrorsType, UpdateVendorUserInfoFormErrorsType } from "~/types/vendor";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { UserCreate } from "~/components/settings/UserCreate";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { 
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role
   } = Object.fromEntries(body)

   let errors:CreateVendorUserFormErrorsType = {
    firstName: await validateTextInput('firstName',firstName),
    lastName: await validateTextInput('lastName',lastName),
    email: await validateTextInput('email',email),
    role: await validateRoleInput(role),
    password: await validateTextInput('password',password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendorAdmin = await sdk.client.fetch('/vendor/create-admin',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "first_name": firstName,
        "last_name": lastName,
        "password": password,
        "email": email,
        "role": role
      },
    })

    return redirect('/settings/users-list')
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


export default function CreateUser() {

  return (       
    <UserCreate/>
  );
}