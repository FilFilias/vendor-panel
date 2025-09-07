import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { rootLoaderDataType } from "~/types/common";
import { Button } from "../ui/button";
import { Edit, Save } from "lucide-react";
import { Form, useActionData, useNavigation, useRouteLoaderData } from "react-router";
import { UpdateVendorInfoFormErrorsType } from "~/types/vendor";
import { useTranslation } from "react-i18next";

export const CompanyProfile = () => {

    let {vendor} = useRouteLoaderData("root") as rootLoaderDataType;
    const data = useActionData<{errors:UpdateVendorInfoFormErrorsType }>();
    let errors:UpdateVendorInfoFormErrorsType = data?.errors ?? {}; 
    let {t} = useTranslation()

    const [isEditing, setIsEditing] = useState(false);

    const onEditClick = (e: React.FormEvent) => {
        setIsEditing(true)
    }

    const onCancelClick = () => {
        setIsEditing(false)
    }

    useEffect(() => {
        if (data?.success && isEditing) {
            setIsEditing(false)
        }
    },[data])
    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
                <CardTitle>{t("company_info")}</CardTitle>
                <CardDescription>{t("update_company_info")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form method="post">
                    <div className="space-y-2">
                        {errors.companyName ? (
                            <p className="text-sm text-destructive">{t(errors.companyName)}</p>
                        ) : (
                            <Label htmlFor="company-name">{t("company_name")}</Label>
                        )}
                        <Input name="companyName" id="company-name" defaultValue={vendor.name} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" defaultValue={vendor.email} disabled={true} />
                    </div>
                    <div className="space-y-2">
                        {errors.phoneNumber ? (
                            <p className="text-sm text-destructive">{t(errors.phoneNumber)}</p>
                        ) : (
                            <Label htmlFor="phone">{t("phone_num")}</Label>
                        )}
                        <Input name="phoneNumber" id="phone" defaultValue={vendor.phone} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        {errors.address ? (
                            <p className="text-sm text-destructive">{t(errors.address)}</p>
                        ) : (
                            <Label htmlFor="address">{t("address")}</Label>
                        )}
                        <Input name="address" id="address" defaultValue={vendor.address} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        {errors.city ? (
                            <p className="text-sm text-destructive">{t(errors.city)}</p>
                        ) : (
                            <Label htmlFor="city">{t("city")}</Label>
                        )}
                        <Input name="city" id="city" defaultValue={vendor.city} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        {errors.postalCode ? (
                            <p className="text-sm text-destructive">{t(errors.postalCode)}</p>
                        ) : (
                            <Label htmlFor="postal_code">{t("postal_code")}</Label>
                        )}
                        <Input name="postalCode" id="postal_code" defaultValue={vendor.postal_code} disabled={!isEditing} />
                    </div>
                    <input hidden name="country_code" defaultValue={vendor.country_code} />
                    {isEditing &&
                        <div className="flex gap-2 flex justify-end pt-4">
                            <Button onClick={onCancelClick} variant="outline">
                                {t("cancel")}
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90" type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                {t("save")}
                            </Button>
                        </div>
                    }
                </Form>
                    <div className="flex justify-end pt-4 m-0">
                        {!isEditing &&
                            <Button onClick={onEditClick} variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                {t("edit")}
                            </Button>
                        }
                    </div>
                </CardContent>
        </Card>
    );
}