import { Form, useActionData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Edit, Save } from "lucide-react";
import { StoreVendorAdmin, UpdateVendorUserInfoFormErrorsType, VendorUserType } from "~/types/vendor";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface UserInfoInput {
  user:VendorUserType;
  includeRole?: boolean;
}

export const UserInfo:React.FC<UserInfoInput> = ({user,includeRole=false}) => {

    const data = useActionData<{errors:UpdateVendorUserInfoFormErrorsType }>();
    let errors:UpdateVendorUserInfoFormErrorsType = data?.errors ?? {}; 
    let {t} = useTranslation()

    const [isEditing, setIsEditing] = useState(false);
    const [stateRole, setStateRole] = useState(user?.role)

    const onEditClick = () => {
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
            <CardTitle>{t("user_info")}</CardTitle>
            <CardDescription>{t("update_user_info")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form method="post">
                <input defaultValue={user?.id} name='id' hidden/>
                <div className="space-y-2">
                  {errors.firstName ? 
                    <p className="text-sm text-destructive">{t(errors.firstName)}</p>
                  : 
                    <Label htmlFor="first-name">{t("first_name")}</Label>
                  }
                    <Input name='firstName' id="first-name" defaultValue={user?.firstName} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  {errors.firstName ? 
                    <p className="text-sm text-destructive">{t(errors.lastName)}</p>
                  : 
                    <Label htmlFor="first-name">{t("last_name")}</Label>
                  }
                  <Input name='lastName' id="last-name" defaultValue={user?.lastName} disabled={!isEditing} />
                </div>
                {includeRole &&
                <div className="space-y-2">
                    {errors.role ? 
                      <p className="text-sm text-destructive">{t(errors.role)}</p>
                    : 
                      <Label htmlFor="first-name">{t("role")}</Label>
                    }

                    <Select 
                      onValueChange={setStateRole} 
                      value={stateRole}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={stateRole} />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {['admin','user'].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="role" value={stateRole} />
                  </div>
                }
                <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" defaultValue={user?.email} disabled={true} />
                </div>
                <div className="flex justify-end pt-4">
                  {!isEditing ? (
                    <Button onClick={onEditClick} variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={onCancelClick} variant="outline">
                        {t("cancel")}
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" />
                        {t("save")}
                      </Button>
                    </div>
                  )}
                </div>
              </Form>
          </CardContent>
        </Card>
    )
}