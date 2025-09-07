import { ActionFunctionArgs, data, Form, redirect, type MetaFunction } from "react-router";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { validateConfirmPassword, validatePassword, validateTextInput } from "~/lib/utils";
import { CreateVendorCustomerFormErrorsType, UpdateVendorInfoFormErrorsType } from "~/types/vendor";
import CustomerCreate from "~/components/customers/CustomerCreate";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { 
    companyName,
    vatNumber,
    email,
    phoneNumber,
    address,
    city,
    postalCode,
    countryCode,
    password,
    confirmPassword
   } = Object.fromEntries(body)

   let errors:CreateVendorCustomerFormErrorsType = {
    companyName: await validateTextInput('companyName',companyName),
    vatNumber: await validateTextInput('vatNumber',vatNumber),
    email: await validateTextInput('email',email),
    phoneNumber: await validateTextInput('phoneNumber',phoneNumber),
    address: await validateTextInput('address',address),
    city: await validateTextInput('city',city),
    postalCode: await validateTextInput('postalCode',postalCode),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword)
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendor = await sdk.client.fetch('/vendor/create-customer',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "email": email,
        "password": password,
        "company": companyName,
        "phoneNumber": phoneNumber,
        "vatNo": vatNumber,
        "address": address,
        "city": city,
        "postalCode": postalCode,
        "countryCode": countryCode
      },
    })
    return redirect("/customers");
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


export default function CreateCustomer() {

  return (       
    <CustomerCreate />
  );
}