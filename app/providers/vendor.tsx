import { sdk } from "~/lib/config";
import { StoreVendor, StoreVendorAdmin, StoreVendorCustomerResponse, StoreVendorCustomersResponse, StoreVendorInvitationsResponse, StoreVendorOrdersResponse, StoreVendorProductByIDResponse, StoreVendorProductsResponse, VendorApiKey } from "~/types/vendor";

export const getVendorAdmin = async (connectSID: string): Promise<StoreVendorAdmin | null> => {    
  try {
    let vendorAdmin = await sdk.client.fetch(`/vendor/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}` 
      }
    });
    return vendorAdmin as StoreVendorAdmin;
  }
  catch (error) {
    return null;
  }
}

export const getVendorAdmins = async (connectSID: string): Promise<StoreVendorAdmin[] | null> => {    
  try {
    let vendorAdmins = await sdk.client.fetch(`/vendor/admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return vendorAdmins as StoreVendorAdmin[];
  }
  catch (error) {
    return null;
  }
}

export const getVendorAdminByID = async (connectSID: string,id:string): Promise<StoreVendorAdmin | null> => {    
  try {
    let vendorAdmin = await sdk.client.fetch(`/vendor/admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return vendorAdmin as StoreVendorAdmin;
  }
  catch (error) {
    return null;
  }
}

export const getVendorsInvitations = async (connectSID: string,page:number): Promise<StoreVendorInvitationsResponse > => {    
  let skip = (page -1) * 10
  try {
    let invitations = await sdk.client.fetch(`/vendor/invitations?skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return invitations as StoreVendorInvitationsResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorByDomain = async (domain: string): Promise<StoreVendor | null> => {
  try {
    let vendor = await sdk.client.fetch(`/store/vendor/by-domain?handle=${domain}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return vendor as StoreVendor;
  } catch (error) {
    console.error('Error fetching vendor by domain:', error);
    return null;
  }
};

export const getVendorsOrders = async (connectSID: string,page:number): Promise<StoreVendorOrdersResponse > => {    
  let skip = (page -1) * 15
  try {
    let orders = await sdk.client.fetch(`/vendor/orders?skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return orders as StoreVendorOrdersResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorsCustomers = async (connectSID: string,page:number): Promise<StoreVendorCustomersResponse > => {    
  let take = 15
  let skip = (page -1) * take
  try {
    let customers = await sdk.client.fetch(`/vendor/customers?skip=${skip}&take=${take}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return customers as StoreVendorCustomersResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorsCustomer = async (connectSID: string,page:number, customerID:string): Promise<StoreVendorCustomerResponse > => {    
  let skip = (page -1) * 15
  try {
    let customers = await sdk.client.fetch(`/vendor/customer/${customerID}?skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })
    return customers as StoreVendorCustomerResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorsProducts = async (connectSID: string,page:number): Promise<StoreVendorProductsResponse > => {    
  let skip = (page -1) * 15
  try {
    let products = await sdk.client.fetch(`/vendor/products?skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return products as StoreVendorProductsResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorsProductByID = async (connectSID: string,id:string): Promise<StoreVendorProductByIDResponse > => {    

  try {
    let products = await sdk.client.fetch(`/vendor/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return products as StoreVendorProductByIDResponse;
  }
  catch (error) {
    return error;
  }
}

export const getVendorApiKey = async (connectSID: string): Promise<VendorApiKey | null> => {    
  try {
    let apiKey = await sdk.client.fetch(`/vendor/api-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${connectSID}`
      }
    })

    return apiKey as VendorApiKey;
  }
  catch (error) {
    return null;
  }
}