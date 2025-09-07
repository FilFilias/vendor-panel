import { ActionFunctionArgs, data, LoaderFunction, type MetaFunction } from "react-router";
import { ApiKeyBlock } from "~/components/settings/ApiKeyBlock";
import { CompanyProfile } from "~/components/settings/CompanyProfile";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { validateTextInput } from "~/lib/utils";
import { getVendorApiKey } from "~/providers/vendor";
import { UpdateVendorInfoFormErrorsType } from "~/types/vendor";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { 
    companyName,
    address,
    city,
    postalCode,
    phoneNumber,
    country_code
   } = Object.fromEntries(body)

   let errors:UpdateVendorInfoFormErrorsType = {
    companyName: await validateTextInput('companyName',companyName),
    address: await validateTextInput('address',address),
    city: await validateTextInput('city',city),
    postalCode: await validateTextInput('postalCode',postalCode),
    phoneNumber: await validateTextInput('phoneNumber',phoneNumber),
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendor = await sdk.client.fetch('/vendor/update-info',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "name": companyName,
        "address": address,
        "city": city,
        "postal_code": postalCode,
        "phone": phoneNumber,
        "country_code": country_code
      },
    })

    return data({vendor,success:true});
  } catch (error) {
    console.error(error)
    return data({error:error})
  }

}

export const loader: LoaderFunction = async ({ request, params }) => {

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const apiKey = await getVendorApiKey(session.data["connect.sid"] as string);

  return data({apiKey})
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Settings() {

  return (       
    <>
      <CompanyProfile />
      <ApiKeyBlock />
    </>
  );
}