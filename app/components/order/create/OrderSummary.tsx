import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import { useLoaderData } from "react-router";


export const OrderSummary = () => {

    let {cart} = useLoaderData()

    return (
        <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><span className={`price ${cart.currency}`}>{item.price.toFixed(2)}</span></TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className={`text-right price ${cart.currency}`}>{item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end mt-4">
              <div className="w-1/2">
                <div className="flex justify-between py-2 text-lg font-semibold">
                  <span>Total:</span>
                  <span className={`price ${cart.currency}`}>{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}