import { useTranslation } from "react-i18next"
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLoaderData } from 'react-router';
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { X, Menu } from 'lucide-react';

interface SubCategory {
    id: number;
    name: string;
    link: string;
}
  
interface Category {
    id: number;
    name: string;
    link: string;
    subCategories?: SubCategory[];
}

interface CategoryListProps {
    categories: Category[];
}

export const CategoryList: React.FC<CategoryListProps>  = ({categories}) => {

    const {currentUrl,hasParams} = useLoaderData()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

    const onDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const {t} = useTranslation();

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => ({
          ...prev,
          [categoryId]: !prev[categoryId]
        }));
    };

    return (
        <>
            <div className="flex items-center">
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-2" onClick={onDrawerToggle}/>
                <span className="text-lg font-semibold text-main dark:text-white" >{t('categories')}</span>
            </div>
            <Sheet open={isDrawerOpen} onOpenChange={onDrawerToggle}>
                <SheetContent side="right" className="w-80 p-0 bg-background border-r shadow-lg dark:bg-gray-900 dark:text-white dark:border-gray-900">
                    <SheetHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center justify-between ">
                        <SheetTitle className="text-lg font-semibold dark:text-white">{t('categories')}</SheetTitle>
                    </div>
                    </SheetHeader>
                    
                    <ScrollArea className="h-[calc(100vh-100px)] px-6">
                    <ul className="space-y-2 pb-6">
                        {categories.map(category => {
                            const isExpanded = expandedCategories[category.id];
                            
                            return (
                                <li key={category.id} className="py-1 border-b last:border-0">
                                <div 
                                    className="flex items-center gap-3 py-3 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    onClick={() => {
                                    if (category.subCategories && category.subCategories.length > 0) {
                                        toggleCategory(category.id);
                                    }
                                    }}
                                >
                                    <Link 
                                    to={hasParams ? currentUrl + '&category=' + category.id : '?category=' + category.id} 
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex-grow font-medium"
                                    onClick={(e) => {
                                        if (category.subCategories && category.subCategories.length > 0) {
                                        e.preventDefault();
                                        } else {
                                        onDrawerToggle?.(); // Close drawer when navigating
                                        }
                                    }}
                                    >
                                    {category.name}
                                    </Link>
                                </div>
                                
                                {category.subCategories && isExpanded && (
                                    <ul className="pl-8 mt-1 space-y-1 animate-accordion-down">
                                    {category.subCategories.map(subCategory => (
                                        <li key={subCategory.id} className="py-1">
                                        <Link
                                            to={hasParams ? currentUrl + '&category=' + subCategory.id : subCategory.link}
                                            className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm flex items-center py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                                            onClick={() => onDrawerToggle?.()} // Close drawer when navigating
                                        >
                                            <span className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mr-3"></span>
                                            {subCategory.name}
                                        </Link>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                </li>
                            );
                        })}
                    </ul>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    )
}
   
