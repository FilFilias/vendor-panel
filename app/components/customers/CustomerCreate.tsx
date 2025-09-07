import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Form, useActionData, useNavigation } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTranslation } from "react-i18next";
import { CreateVendorCustomerFormErrorsType } from "~/types/vendor";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CustomerCreate() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
    const data = useActionData<{errors:CreateVendorCustomerFormErrorsType }>();
    let errors:CreateVendorCustomerFormErrorsType = data?.errors ?? {}; 
    let {t} = useTranslation()

    let navigation = useNavigation();
    let isLoading = navigation.state !== "idle";
  
    const onShowPasswordClick = () => {
        setShowPassword(prevState => !prevState)
    }
    
    const onShowPasswordConfirmClick = () => {
        setShowConfirmPassword(prevState => !prevState)
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t("customer_create")}</h1>
                <p className="text-muted-foreground">{t("add_customer_network")}</p>
            </div>
            <Card className="w-full max-w-3xl mx-auto  dark:bg-gray-800 dark:text-white">
                <CardHeader>
                    <CardTitle>{t("customer_info")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form method="post" className="space-y-6">
                        <input hidden name="countryCode" defaultValue='gr' />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                {errors.companyName ? (
                                    <p className="text-sm text-destructive">{t(errors.companyName)}</p>
                                ) : (
                                    <Label htmlFor="companyName">{t("company_name")}</Label>
                                )}
                                <Input name="companyName" id="companyName" disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                {errors.vatNumber ? (
                                    <p className="text-sm text-destructive">{t(errors.vatNumber)}</p>
                                ) : (
                                    <Label htmlFor="vatNumber">{t("vat_number")}</Label>
                                )}
                                <Input name="vatNumber" id="vatNumber" disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                {errors.companyName ? (
                                    <p className="text-sm text-destructive">{t(errors.email)}</p>
                                ) : (
                                    <Label htmlFor="email">Email</Label>
                                )}
                                <Input name="email" id="email" disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                {errors.phoneNumber ? (
                                    <p className="text-sm text-destructive">{t(errors.phoneNumber)}</p>
                                ) : (
                                    <Label htmlFor="phoneNumber">{t("phone_num")}</Label>
                                )}
                                <Input type='number' name="phoneNumber" id="phoneNumber" disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                {errors.address ? (
                                    <p className="text-sm text-destructive">{t(errors.address)}</p>
                                ) : (
                                    <Label htmlFor="address">{t("address")}</Label>
                                )}
                                <Input name="address" id="address" disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                {errors.postalCode ? (
                                    <p className="text-sm text-destructive">{t(errors.postalCode)}</p>
                                ) : (
                                    <Label htmlFor="postalCode">{t("postal_code")}</Label>
                                )}
                                <Input name="postalCode" id="postalCode" disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                {errors.city ? (
                                    <p className="text-sm text-destructive">{t(errors.city)}</p>
                                ) : (
                                    <Label htmlFor="city">{t("city")}</Label>
                                )}
                                <Input name="city" id="city" disabled={isLoading} />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Account Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    {errors.password ? 
                                        <p className="text-sm text-destructive">{t(errors.password)}</p>
                                    : 
                                        <Label htmlFor="email">{t("password")}</Label>
                                    }
                                    <div className="relative">
                                        <Input 
                                            name='password' 
                                            id="password"               
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={onShowPasswordClick}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {errors.confirmPassword ? 
                                        <p className="text-sm text-destructive">{t(errors.confirmPassword)}</p>
                                    : 
                                        <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
                                    }
                                    <div className="relative">
                                        <Input 
                                            name='confirmPassword' 
                                            id="confirmPassword"               
                                            placeholder="••••••••"
                                            type={showConfirmPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={onShowPasswordConfirmClick}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                            ) : (
                                            <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardFooter className="flex justify-end px-0 pb-0">
                            <Button disabled={isLoading} type="submit">{t("create_customer")}</Button>
                        </CardFooter>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
