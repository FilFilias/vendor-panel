import { ActionFunctionArgs, data, Form, redirect, type MetaFunction, useActionData, useNavigation } from "react-router";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { validateTextInput } from "~/lib/utils";
import {  InviteVendorCustomerFormErrorsType } from "~/types/vendor";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTranslation } from "react-i18next";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  let { email } = Object.fromEntries(body)

   let errors:InviteVendorCustomerFormErrorsType = {
    email: await validateTextInput('email',email),
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)

  if (hasErrors) {
      return data({errors:errors})
  }

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  try {
    let vendor = await sdk.client.fetch('/vendor/invite-customer',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session.data['connect.sid']}`
      },
      body: {
        "email": email,
      },
    })
    return redirect("/invitations");
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


export default function CustomerInvite() {

  let {t} = useTranslation()
  const data = useActionData<{errors:InviteVendorCustomerFormErrorsType }>();
  let errors:InviteVendorCustomerFormErrorsType = data?.errors ?? {}; 

  let navigation = useNavigation();
  let isLoading = navigation.state !== "idle";

  return (       
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full mx-auto dark:bg-gray-800">
          <CardHeader>
              <CardTitle>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t("customer_invite")}</h1>
              <p className="text-muted-foreground">{t("add_customer_network")}</p>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <Form method="post" className="space-y-6">
                  <input hidden name="countryCode" defaultValue='gr' />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          {errors.email ? (
                              <p className="text-sm text-destructive">{t(errors.email)}</p>
                          ) : (
                              <Label htmlFor="email" className="dark:text-white">Email</Label>
                          )}
                          <Input name="email" id="email" disabled={isLoading} />
                      </div>
                  </div>
                  <CardFooter className="flex justify-start px-0 pb-0">
                      <Button disabled={isLoading} type="submit">{t("invite_customer")}</Button>
                  </CardFooter>
              </Form>
          </CardContent>
      </Card>
    </div>
  );
}