import { sdk } from "~/lib/config"

export const getTaxTypes = async () => {
    return await sdk.client.fetch(`/store/product/tax-types`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'x-publishable-api-key': import.meta.env.VITE_PUBLISHABLE_KEY
        }
      })
}