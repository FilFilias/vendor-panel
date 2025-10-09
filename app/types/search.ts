export type SearchReponse = {
    hits: {
        id:string;
        title:string;
        status:string;
        thumbnail:string;
    }[]
    query: string;
    estimatedTotalHits: number;
    offset: number;
    limit: number;
    error?:any;
}