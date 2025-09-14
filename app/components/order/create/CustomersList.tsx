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
import { LinkButton } from "~/components/ui/buttoLink";
import { Form, useLoaderData } from "react-router";
import { CreateOrderSelectClient } from "~/routes/__main/order/create/select-customer";

export function OrderCustomersList() {

  let {t} = useTranslation()
  let {customers,region_id,total,start,end} = useLoaderData() as CreateOrderSelectClient

  return (
    <>
     
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
                    </div>
                    <Form method="post">
                      <input hidden defaultValue={customer.id} name="customer_id" />
                      <input hidden defaultValue={customer.email} name="email" />
                      <input hidden defaultValue={region_id} name="region_id" />
                      <Button
                        variant="outline"
                        size="sm"
                        to={`/customer/${customer.id}`}
                        className="border-none bg-primary hover:bg-orange dark:bg-orange dark:hover:bg-orange_hover text-white"
                      >
                        Select
                      </Button>
                    </Form>
                  </Card>
              ))}
            </div>
            <div className="hidden sm:block border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-inherit">
                    <TableHead>{t("company_name")}</TableHead>
                    <TableHead>Email</TableHead>
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
                        <TableCell>
                          <Form method="post">
                            <input hidden defaultValue={customer.id} name="customer_id" />
                            <input hidden defaultValue={customer.email} name="email" />
                            <input hidden defaultValue={region_id} name="region_id" />
                            <Button
                              variant="outline"
                              size="sm"
                              type='submit'
                              className="border-none bg-primary hover:bg-orange dark:bg-orange dark:hover:bg-orange_hover text-white"
                            >
                              Select
                            </Button>
                          </Form>
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
