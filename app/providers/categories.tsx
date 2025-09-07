import { sdk } from "~/lib/config"

export const getCategoriesList = async () => {
    return await sdk.client.fetch(`/store/categories/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'x-publishable-api-key': import.meta.env.VITE_PUBLISHABLE_KEY
        }
    })
}