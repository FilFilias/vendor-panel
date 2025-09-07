
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Filter } from "lucide-react";
import { ProductFilters, ProductFilterValues } from "./ProductFilters";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog";
import { useIsMobile } from "~/hooks/use-mobile";
import { ScrollArea } from "~/components/ui/scroll-area";

type ProductFilterDrawerProps = {
  filters: ProductFilterValues;
  onFilterChange: (newFilters: ProductFilterValues) => void;
  onClearFilters: () => void;
  filtersApplied: boolean;
};

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  filtersApplied
}) => {
  const isMobile = useIsMobile();
  const [tempFilters, setTempFilters] = useState<ProductFilterValues>(filters);
  const [open, setOpen] = useState(false);

  // Reset temp filters whenever the drawer/dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempFilters({...filters});
    }
    setOpen(isOpen);
  };

  const handleTempFilterChange = (newFilters: ProductFilterValues) => {
    setTempFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setOpen(false);
  };

  // For mobile, use a Sheet (drawer) that slides in from the side
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 relative">
            <Filter className="h-4 w-4" />
            Filters
            {filtersApplied && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"></span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-6">
              <ProductFilters
                filters={tempFilters}
                onFilterChange={handleTempFilterChange}
                onClearFilters={handleClearFilters}
                className="mb-8"
                showMobileView
              />
            </div>
          </ScrollArea>
          <div className="p-4 border-t flex justify-between items-center gap-2 bg-background">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="text-destructive hover:text-destructive"
            >
              Clear Filters
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop, use a Dialog (modal) that appears in the center of the screen
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 relative ${filtersApplied ? 'border-primary text-primary' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {filtersApplied && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] p-0">
        <ScrollArea className="max-h-[calc(80vh-7rem)]">
          <div className="p-6">
            <ProductFilters
              filters={tempFilters}
              onFilterChange={handleTempFilterChange}
              onClearFilters={handleClearFilters}
              className="mb-6"
              showMobileView
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex justify-between items-center gap-2 bg-background">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="text-destructive hover:text-destructive"
          >
            Clear Filters
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
