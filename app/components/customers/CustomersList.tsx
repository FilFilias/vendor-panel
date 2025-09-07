import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Eye, UserPlus, Mail, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";
import { LinkButton } from "../ui/buttoLink";

type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type CustomersListProps = {
  customers: Customer[];
  total: number;
  start: number;
  end: number;

};

export function CustomersList({
  customers,
  total,
  start,
  end,
}: CustomersListProps) {

  let {t} = useTranslation()

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 dark:text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('customers')}</h1>
          <p className="text-muted-foreground">{t("customers_page_desc")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <LinkButton
            variant="secondary"
            to='/invite-customer'
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span>{t("customer_invite")}</span>
          </LinkButton>
          <LinkButton 
            to='/customer-create'
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t("customer_create")}</span>
          </LinkButton>
        </div>
      </div>
      {/* <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full pl-10"
            // value={search}
            // onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div> */}
      
      {customers.length === 0 ? (
        <div className="col-span-full text-muted-foreground text-center py-16">
          {t("no_customers")}
        </div>
      ) : 
        <>
            <h6 className="pb-4 text-muted-foreground">{`${t("displaying")} ${start} ${t("to")} ${end} ${t("of")} ${total} ${t("customers_lower")}`}</h6>
            <div className="sm:hidden flex flex-col gap-3">
              {customers.map((customer) => (
                <Card
                  key={customer.id}
                  className="flex flex-row items-center gap-6 px-4 py-3 hover:shadow cursor-pointer transition border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate mb-1">{customer.name}</div>
                    <div className="text-sm text-muted-foreground truncate mb-1">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{t("created_date")}: {customer.createdAt}</div>
                  </div>
                  <LinkButton
                    variant="outline"
                    size="sm"
                    to={`/customer/${customer.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </LinkButton>
                </Card>
              ))}
            </div>
            <div className="hidden sm:block border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-inherit">
                    <TableHead>{t("company_name")}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t("created_date")}</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer "
                    >
                      <TableCell className="font-medium dark:text-white">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground dark:text-white">{customer.email}</TableCell>
                      <TableCell className="text-muted-foreground dark:text-white">{customer.createdAt}</TableCell>
                      <TableCell>
                        <LinkButton
                          variant="outline"
                          size="sm"
                          to={`/customer/${customer.id}`}
                          className="border-none bg-primary hover:bg-orange dark:bg-orange dark:hover:bg-orange_hover text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t("view")}
                        </LinkButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          
        </>
      }


    </>
  );
}
