import { StoreCustomer } from "@medusajs/types";
import { StoreVendor, VendorUserType } from "./vendor";

export interface rootLoaderDataType {
    theme: string;
    customer: StoreCustomer;
    vendor: StoreVendor;
    user: VendorUserType | null;
}