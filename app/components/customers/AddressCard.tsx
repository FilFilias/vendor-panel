import { Card, CardContent } from "~/components/ui/card";
import { useTranslation } from "react-i18next";
import { StoreVendorCustomerAddress } from "~/types/vendor";

export function AddressCard({address} : {address:StoreVendorCustomerAddress}) {

  let {t} = useTranslation();

  return (
    <Card className="bg-muted hover:bg-muted/70 transition" >
      <CardContent className="p-3 flex flex-col">
        <div className="font-medium pb-2">{address.address_name}</div>
        <div className="flex flex-col gap-2 text-sm mt-2 sm:mt-0">
          <span className="font-medium">{t("city")}:{address.city} </span> 
          <span className="font-medium">{t("address")}: {address.address_1}</span>
          <span className="font-medium">{t("postal_code")}: {address.postal_code}</span>
          <span className="font-medium">{t("phone_num")}: {address.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
