import { Input } from "../ui/input"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { LinkButton } from "../ui/buttoLink"

export const ProductsListFilters = () => {

    const {q} = useLoaderData()

    const [term,setTerm] = useState(q ??'')
    const navigate = useNavigate()
    const {t} = useTranslation()

    const onTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value)
    }
  
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && term.trim()) {
        navigate(`/products?q=${term}`)
      }
    }
  
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 max-sm:flex-wrap">
                    <div className="w-full flex relative min-w-[200px]">
                        <Input
                            type="text" 
                            placeholder={t("products_search")}
                            value={term}
                            onChange={onTermChange}
                            onKeyDown={onKeyDown}
                            className="w-full pl-10 dark:bg-gray-800 dark:text-white"
                        />
                        <LinkButton to={`/products?q=${term}`} className={`${!term.trim() ? 'cursor-none pointer-events-none' : 'cursor-pointer'}`}>
                            {t("search")}
                        </LinkButton>
                    </div>
                </div>
            </div>
        </div>
    )
}