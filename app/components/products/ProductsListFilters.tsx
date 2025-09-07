import { Search } from "lucide-react"
import { Input } from "../ui/input"


export const ProductsListFilters = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <div className="flex-1 relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-10 dark:bg-gray-800 dark:text-white"
                            // value={filters.searchTerm}
                            // onChange={(e) => handleFilterChange({...filters, searchTerm: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}