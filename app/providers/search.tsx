import { SearchReponse } from "~/types/search"

export const searchProducts = async (q:string,page=1): Promise<SearchReponse> => {

    let skip = (page -1) * 15
    try {
        const result = await fetch(`${import.meta.env.VITE_MEILISEARCH_HOST}/indexes/products/search`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_MEILISEARCH_API_KEY}`
            },
            body: JSON.stringify({
                q: q,
                "attributesToHighlight": [
                    "id",
                    "title",
                    "status",
                    "thumbnail"
                ],
                "limit": 15,
                "offset": skip
            })
        })

        return result.json()
    }
    catch(error) {
        console.log(error)
        return {
            hits:[],
            estimatedTotalHits:0,
            error:error}
    }
}