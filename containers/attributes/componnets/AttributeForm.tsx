import React, { useState, useEffect } from "react";
import { Attribute } from "@/lib/services/attributeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { useAttributeSections } from '@/lib/hooks/useAttributeSection';
import { useAttributeParentTree } from '@/lib/hooks/useAttributeParentTree';
import { useCategoriesAll } from '@/lib/hooks/useCategories';
import { CategoryTreePicker } from '@/containers/category/components/CategoryTreePicker';
import { buildCategoryTree } from '@/lib/utils';

interface AttributeFormProps {
  initialData?: Partial<Attribute>;
  onSubmit: (data: Omit<Attribute, "id">) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const defaultForm: Omit<Attribute, "id"> = {
  name: "",
  valueType: 0,
  categoryId: 0,
  parentAttributeId: 0,
  isChangeable: true,
  attributeSectionId: 0,
  categoryName: "",
  parentAttributeName: "",
  sectionName: "",
};

const AttributeForm: React.FC<AttributeFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const t = useTranslations("Attributes");
  const [form, setForm] = useState<Omit<Attribute, "id">>(defaultForm);
  const { sections, isLoading: isSectionsLoading } = useAttributeSections();
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const { data: parentAttributes, isLoading: isParentLoading } = useAttributeParentTree(selectedSectionId || undefined);
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategoriesAll();
  const categories = categoriesData?.responseValue || [];
  const categoryTree = buildCategoryTree ? buildCategoryTree(categories) : categories;

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData });
      setSelectedSectionId(initialData.attributeSectionId || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSectionChange = (val: string) => {
    setForm((prev) => ({ ...prev, attributeSectionId: Number(val), parentAttributeId: 0 }));
    setSelectedSectionId(Number(val));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isChangeable: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const getCategoryName = (id: number | null) => {
    if (id === null) return "Kateqoriya seçilməyib";
    if (id === 0) return "Ana kateqoriya";
    const found = categories.find((c) => c.id === id);
    return found ? found.name : "Seçilən kateqoriya tapılmadı";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("name")}
          required
        />
        <select
          className="h-10 border rounded px-2"
          value={form.attributeSectionId || ""}
          onChange={(e) => handleSectionChange(e.target.value)}
          disabled={isSectionsLoading}
        >
          <option value="">{t("section")}</option>
          {sections.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CategoryTreePicker
          tree={categoryTree}
          selectedId={form.categoryId || null}
          onSelect={(id) => setForm((prev) => ({ ...prev, categoryId: id ?? 0 }))}
          disabled={isCategoriesLoading}
        />
        <CategoryTreePicker
          tree={parentAttributes || []}
          selectedId={form.parentAttributeId || null}
          onSelect={(id) => setForm((prev) => ({ ...prev, parentAttributeId: id ?? 0 }))}
          placeholder={t("parent_attribute")}
          notSelectedText={t("parent_attribute_not_selected")}
          disabled={!selectedSectionId || isParentLoading}
        />
      </div>
      <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
        <Checkbox
          id="isChangeable"
          checked={form.isChangeable}
          onCheckedChange={handleCheckboxChange}
        />
        <label htmlFor="isChangeable">{t("is_changeable")}</label>
      </div>
      <div className="flex gap-2 justify-end">
       
        <Button type="button" onClick={onClose} variant="secondary">
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
};

export default AttributeForm;
