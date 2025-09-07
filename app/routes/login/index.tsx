
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { MetaFunction } from "react-router";
import { data, redirect, Form, useRouteLoaderData, useActionData } from "react-router";
import { ActionFunctionArgs, useNavigation } from "react-router";
import { sdk } from "~/lib/config";
import type { LoginFormErrorsType } from "~/types/customer";
import { validateTextInput, validatePassword } from "~/lib/utils";
import { sessionStorage } from "~/lib/medusa-session";
import { salesChannelCookie } from "~/lib/sales-channel-cookie";
import { rootLoaderDataType } from "~/types/common";
import { useTranslation } from "react-i18next";

export async function action({
    request,
  }: ActionFunctionArgs) {
    const body = await request.formData();
  
    let { 
      email,
      password,
      salesChannel
     } = Object.fromEntries(body)
  
    let errors:LoginFormErrorsType = {
      email: await validateTextInput('email',email),
      password: validatePassword(password),
    }
  
    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  
    if (hasErrors) {
        return data({errors:errors})
    }
  
    try {
  
        let loginToken = await sdk.client.fetch("/auth/vendor/emailpass",  {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
            },
            body: {
                email,
                password,
            }
        })
        if (!loginToken?.token) {
            return data({errors:{status:401}})
        }

        let session = await sessionStorage.getSession(request.headers.get("Cookie"))
        session.set('connect.sid', loginToken.token)
        let headers = new Headers()
        headers.set("Set-Cookie", await sessionStorage.commitSession(session))
        headers.append("Set-Cookie", await salesChannelCookie.serialize(salesChannel));
  
      return redirect('/',{headers})
    } catch (error) {
      console.error(error)
      return data({errors:error})
    }
  
}

export const meta: MetaFunction = () => {
    return [
      { title: "New Remix App" },
      { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Login() {

    let { vendor } = useRouteLoaderData('root') as rootLoaderDataType;
    const data = useActionData<{errors:LoginFormErrorsType}>();
    let navigation = useNavigation();
    let {t} = useTranslation() 

    let isLoading = navigation.state !== "idle";
    let errors:LoginFormErrorsType = data?.errors ?? {}; 

    return (
        <Form method="post"  className="dark:bg-gray-800 min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md dark:bg-gray-800 dark:text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{t('welcome_back')}</CardTitle>
                    <CardDescription>{t('account_sign_in')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <input hidden name="salesChannel" defaultValue={vendor?.sales_channel} />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {errors.email ?
                                <p className="text-sm text-destructive">{t(errors.email)}</p>
                            :
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                            }
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                            />

                        </div>
                        <div className="space-y-2">
                            {errors.password ?
                                <p className="text-sm text-destructive">{t(errors.password)}</p>
                            :
                                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t('password')}
                                </label>
                            }
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button 
                        type="submit" 
                        className="w-full"
                    >
                        {t('sign_in')}
                    </Button>
                    {errors?.status == 401 && (
                        <div className="w-full p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-small">
                            {t('invalid_email_or_password')}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Form>
    );
}