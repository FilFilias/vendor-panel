import { AdminDraftOrder } from "@medusajs/types"
import { sdk } from "~/lib/config"

export const createDraftOrder = async (connectionID:string,email:string,customer_id:string,region_id:string) : Promise<AdminDraftOrder > => {
    return await sdk.client.fetch('/vendor/draft-orders/create',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${connectionID}`
        },
        body: {
          "email": email,
          "customer_id": customer_id,
          "region_id": region_id
        },
    })
}


export const getDraftOrder = async (connectionID:string,id:string) : Promise<{draft_order:AdminDraftOrder}> => {
    return await sdk.client.fetch(`/vendor/draft-orders/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${connectionID}`
        }
    })
}