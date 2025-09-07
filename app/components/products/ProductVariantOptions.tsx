
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

type VariantOptionsProps = {
  optionTypes: string[];
  onChange: (optionTypes: string[]) => void;
  hasVariants?: boolean;
  onOptionAddBlocked?: () => void;
};

export const ProductVariantOptions: React.FC<VariantOptionsProps> = ({
  optionTypes,
  onChange,
  hasVariants = false,
  onOptionAddBlocked,
}) => {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (hasVariants) {
      if (onOptionAddBlocked) {
        onOptionAddBlocked();
      } else {
        toast.error("Cannot add new options while variants exist. Remove all variants first.");
      }
      setNewOption("");
      return;
    }
    
    if (newOption.trim() && !optionTypes.includes(newOption.trim())) {
      onChange([...optionTypes, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (option: string) => {
    onChange(optionTypes.filter((o) => o !== option));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Variant Options</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {optionTypes.map((option) => (
          <Badge key={option} variant="secondary" className="px-2 py-1">
            {option}
            <button
              onClick={() => handleRemoveOption(option)}
              className="ml-2 text-muted-foreground hover:text-foreground"
              disabled={hasVariants}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {optionTypes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No options added. Add options like "Color", "Size", etc.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add option type (e.g., Color, Size)"
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAddOption} type="button" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      {hasVariants && (
        <p className="text-sm text-amber-500 mt-1">
          Cannot add or remove options while variants exist. Remove all variants first.
        </p>
      )}
    </div>
  );
};
