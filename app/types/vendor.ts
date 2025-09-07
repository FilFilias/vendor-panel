import { AddressDTO, CustomerDTO, ProductCategoryDTO, ProductDTO, ProductVariantDTO } from "@medusajs/types";

export interface StoreVendor {
    id: string;
    name: string;
    handle: string;
    email: string;
    logo: string | null;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
    country_code: string;
    sales_channel: string;
}

export interface StoreVendorAdmin {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
    vendor_id: string;
    vendor: StoreVendor;
}

export type UpdateVendorInfoFormErrorsType = {
    companyName:string | null;
    address:string | null;
    city:string | null;
    postalCode:string | null;
    phoneNumber:string | null;
}

export type UpdateVendorUserInfoFormErrorsType = {
    firstName:string | null;
    lastName:string | null;
}

export interface UpdateVendorUserInfoByIDFormErrorsType extends UpdateVendorUserInfoFormErrorsType {
    role: string | null;
    id: string | null;
}

export type VendorUserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

export type CreateVendorUserFormErrorsType = {
    firstName:string | null;
    lastName:string | null;
    email:string | null;
    password:string | null;
    confirmPassword:string | null;
    role:string | null;
}

export interface StoreVendorInvitation {
    invite_id: string;
    invite: {
        id: string;
        email: string;
        accepted: string;
        token: string;
        expires_at: string;
        created_at: string;
    }
}

export type StoreVendorInvitationsResponse = {
    result: StoreVendorInvitation[];
    count: number;
    take: number;
    skip: number;
}

export interface StoreVendorOrder {
    id: string;
    created_at:string;
    total:number;
    currency_code: string;
    customer_id: string;
    customer: {
        id: string;
        company_name: string;
    }
}

export type StoreVendorOrdersResponse = {
    result: StoreVendorOrder[];
    count: number;
    take: number;
    skip: number;
}

export type StoreVendorCustomersResponse = {
    result: StoreVendorCustomer[];
    count: number;
    take: number;
    skip: number;
}

export type StoreVendorCustomerResponse = {
    customer: StoreVendorCustomer;
    count: number;
    take: number;
    skip: number;
}

export type StoreVendorCustomer =  CustomerDTO & {
    addresses: AddressDTO & {address_name:string}
    orders:StoreVendorCustomerOrder[] | [];
};

export type StoreVendorCustomerOrder = {
    id:string;
    status:string;
    total:number;
    created_at:string;
    currency_code:string;
}

export type StoreVendorCustomerAddress = AddressDTO & {address_name:string};

export type CreateVendorCustomerFormErrorsType = {
    companyName:string | null;
    vatNumber: string | null;
    email:string | null;
    phoneNumber:string | null;
    address:string | null;
    postalCode:string | null;
    city:string | null;
    password:string | null;
    confirmPassword:string | null;
}

export type InviteVendorCustomerFormErrorsType = {
    email:string | null;
}

export type StoreVendorProductsResponse = {
    result: StoreVendorProduct[] | [];
    count: number;
    take: number;
    skip: number;
}

export type StoreVendorProduct = {
    id:string;
    title: string;
    status:string;
    image:string;
}

export interface StoreVendorProductByIDResponse extends ProductDTO {
    categories: ProductCategoryDTO[];
    variants: Array<ProductVariantDTO & {
        inventory: Array<{
            id: string;
            stocked_quantity: number;
            location_id:string;
            inventory_item_id:string;
            location: string | null;
        }>;
        prices: Array<{
            id: string;
            amount: number;
            currency_code: string;
            price_list_id: string | null;
        }>;
    }>;
}

export type VendorApiKey = {
    id: string;
    token: string;
    redacted: string;
    title: string;
}