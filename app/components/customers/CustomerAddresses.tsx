import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "react-i18next";
import { AddressCard } from "./AddressCard";
import { StoreVendorCustomerAddress } from "~/types/vendor";

export function CustomerAddresses({ addresses}: { addresses:StoreVendorCustomerAddress[] | []; }) {

  let {t} = useTranslation()

  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("addresses")}</CardTitle>
        </CardHeader>
        <CardContent>
            {addresses.length === 0 ? (
              <p className="text-muted-foreground">{t("no_saved_addresses")}</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                  />
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
