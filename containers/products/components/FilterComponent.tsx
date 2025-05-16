import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { useCategories } from "@/lib/hooks/useCategories";

const FilterComponent = ({ 
  onApplyFilters, 
  initialFilters = {
    categoryIds: [],
    dateRange: { from: undefined, to: undefined }
  },
  onClose
}: any) => {
  const t = useTranslations("Products");
  const { categories } = useCategories();
  
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categoryIds || []);
  
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: initialFilters.dateRange?.from,
    to: initialFilters.dateRange?.to
  });
  const [categorySearch, setCategorySearch] = useState("");

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((current: number[]) => {
      if (current.includes(categoryId)) {
        return current.filter((id: number) => id !== categoryId);
      } else {
        return [...current, categoryId];
      }
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      categoryIds: selectedCategories,
      dateRange: {
        from: dateRange.from ? new Date(dateRange.from).toISOString() : undefined,
        to: dateRange.to ? new Date(dateRange.to).toISOString() : undefined
      }
    });
    
    if (onClose) onClose();
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg shadow-lg p-2 min-w-[320px]">
     
      <div>
        <h3 className="text-base font-semibold mb-2">{t("category_label")}</h3>
        <input
          type="text"
          placeholder={t("categoryPlaceholder")}
          value={categorySearch}
          onChange={e => setCategorySearch(e.target.value)}
          className="w-full mb-2 px-2 py-1 border rounded text-sm"
        />
        <ScrollArea className="h-40 rounded-md border p-2 bg-gray-50">
          <div className="grid grid-cols-1 gap-2">
            {categories
              .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
              .map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition"
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Date Range */}
      {/* <div>
        <h3 className="text-base font-semibold mb-2">{t("date_range")}</h3>
        <DatePickerWithRange
          value={dateRange}
          onChange={(range) => {
            if (range && typeof range === "object" && "from" in range && "to" in range) {
              setDateRange(range);
            }
          }}
          className="w-full"
        />
      </div> */}

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-1/2"
        >
          
          {t("clear_filters")}
        </Button>
        <Button
          onClick={handleApplyFilters}
          className="w-1/2 bg-black dark:bg-white"
        >
       
          {t("apply_filters")}
        </Button>
      </div>
    </div>
  );
};

export default FilterComponent;