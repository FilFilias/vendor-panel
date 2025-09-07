import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { StoreVendorCustomerResponse } from "~/types/vendor";
import { useTranslation } from "react-i18next";


export function CustomerDetails({
  customer,
}: StoreVendorCustomerResponse) {

  let {t} = useTranslation();

  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{customer.company_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Email:</span> {customer.email}
            </div>
            <div>
              <span className="font-medium">{t("phone_num")}:</span> {customer.phone}
            </div>
            {typeof customer?.metadata?.vat_number == 'string' &&
              <div>
                <span className="font-medium">{t("vat_number")}:</span> {customer.metadata?.vat_number}
              </div>
            }

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
