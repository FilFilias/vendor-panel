import { Form, useActionData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff, Save } from "lucide-react";
import { CreateVendorUserFormErrorsType, UpdateVendorUserInfoFormErrorsType } from "~/types/vendor";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const UserCreate = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const data = useActionData<{errors:CreateVendorUserFormErrorsType }>();
  let errors:CreateVendorUserFormErrorsType = data?.errors ?? {}; 
  let {t} = useTranslation()

  const [stateRole, setStateRole] = useState()

  const onShowPasswordClick = () => {
    setShowPassword(prevState => !prevState)
  }

  const onShowPasswordConfirmClick = () => {
    setShowConfirmPassword(prevState => !prevState)
  }

  return (
    <Card className="dark:bg-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle>{t("user_create")}</CardTitle>
        <CardDescription>{t("user_create_desc")}</CardDescription>
      </CardHeader>
        <CardContent className="space-y-4">
          <Form method="post">
            <div className="space-y-2">
              {errors.email ? 
                <p className="text-sm text-destructive">{t(errors.email)}</p>
              : 
                <Label htmlFor="email">Email</Label>
              }
                <Input name='email' id="email" />
            </div>
            <div className="space-y-2">
              {errors.firstName ? 
                <p className="text-sm text-destructive">{t(errors.firstName)}</p>
              : 
                <Label htmlFor="first-name">{t("first_name")}</Label>
              }
                <Input name='firstName' id="first-name" />
            </div>
            <div className="space-y-2">
              {errors.firstName ? 
                <p className="text-sm text-destructive">{t(errors.lastName)}</p>
              : 
                <Label htmlFor="first-name">{t("last_name")}</Label>
              }
              <Input name='lastName' id="last-name" />
            </div>
            <div className="space-y-2">
              {errors.role ? 
                <p className="text-sm text-destructive">{t(errors.role)}</p>
              : 
                <Label htmlFor="first-name">{t("role")}</Label>
              }

              <Select 
                onValueChange={setStateRole} 
                value={stateRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_role")} />
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
            <div className="flex justify-end pt-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                {t("save")}
              </Button>
            </div>
          </Form>
      </CardContent>
    </Card>
  )
}