"use client"

import type React from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { useState } from "react"
import { buildCategoryTree } from "@/lib/utils"
import { Category } from "../types/category-type"
import { formSchema } from "../constants/validations"
import { useTranslations } from "next-intl"
import { useCategoriesAll } from "@/lib/hooks/useCategories"
import { toast } from "react-toastify"
import { CategoryTreePicker } from "./CategoryTreePicker"

// Update the props interface to make tree optional and fix defaultValues type
interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void
  onSubmit: (category: Partial<Category>) => Promise<void>
  isLoading?: boolean
  categoryId?: number | null
  initialValues?: Category
  tree?: Category[]
  defaultValues?: z.infer<typeof formSchema>
}

// Update the component parameters to handle optional props
const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  categoryId,
  initialValues,
  tree = [],
  defaultValues,
}) => {
  const t = useTranslations("Categories")
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)
  const { data: allCategoriesData } = useCategoriesAll()

  // Update form initialization to use defaultValues if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      parentId: 0,
      isActive: true,
    },
  })


  const onFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data)
  }

  // Use the tree prop if provided, otherwise build from allCategoriesData
  const categoryTree =
    tree?.length > 0 ? tree : allCategoriesData?.responseValue ? buildCategoryTree(allCategoriesData.responseValue) : []

  // Update the CategoryTreeSelect usage to use categoryTree
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 p-6">
        {isLoadingCategory ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              <div className="w-1/2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("namePlaceholder")} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("status")}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t("select_value")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">{t("active")}</SelectItem>
                          <SelectItem value="false">{t("inactive")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Tree select for parentId */}
            <FormField
              name="parentId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("selectCategory")}</FormLabel>
                  <FormControl>
                    <CategoryTreePicker
                      tree={categoryTree}
                      selectedId={field.value}
                      onSelect={id => field.onChange(id)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-[120px]">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="w-[120px]">
                {isLoading ? t("saving") : t("save")}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
export default FormComponent;