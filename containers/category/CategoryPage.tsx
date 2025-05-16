"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import DialogComponent from "@/components/modal/DialogComponent"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"
import type { Category } from "./types/category-type"
import CategoryTable from "./components/CategoryTable"
import Pagination from "@/components/Pagination/Pagination"
import {
  useCategoriesPaginated,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoriesAll,
} from "@/lib/hooks/useCategories"
import FormComponent from "./components/FormComponent"


const CategoryPage = () => {
  const t = useTranslations("Categories")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"parent" | "child">("parent")

  // Fetch paginated categories
  const { data: paginatedData, isLoading, refetch } = useCategoriesPaginated(pageNumber, pageSize, searchTerm)
  const {data:allCategoriesforTree} = useCategoriesAll()
  console.log(allCategoriesforTree,'allCategoriesforTree')



  const allCategories = paginatedData?.responseValue?.items || []
  const categories = searchTerm
    ? allCategories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allCategories

  // Tab filtering
  const parentCategories = categories.filter((cat) => !cat.parentId || cat.parentId === 0)
  const childCategories = categories.filter((cat) => cat.parentId && cat.parentId !== 0)

  const pagination = {
    pageNumber: paginatedData?.responseValue?.pageNumber || 1,
    totalPages: paginatedData?.responseValue?.totalPages || 1,
  }

  // Mutations
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  useEffect(() => {
    setPageNumber(1)
  }, [searchTerm, activeTab])

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
  }

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleSubmit = async (data: Partial<Category>) => {
    setIsSubmitting(true)
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({ id: selectedCategory.id, category: { ...selectedCategory, ...data } })
        toast.success(t("updateSuccess"))
        
      } else {
        await createCategory.mutateAsync({ ...data, isActive: true } as Category)
        toast.success(t("createSuccess"))
      }
      refetch()
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(t("submitError"))
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search_placeholder")}
              className="bg-white dark:bg-background pl-8 py-5 h-12 sm:h-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleAddCategory}
                className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white text-sm"
              >
                <Plus className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">{t?.("add_category")}</span>
                <span className="sm:hidden">{t?.("add")}</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex mt-6 border-b">
          <button
            className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === "parent" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("parent")}
          >
            {t("parentCategory")}
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold focus:outline-none ${activeTab === "child" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("child")}
          >
            {t("childCategory")}
          </button>
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === "parent" ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("parentCategory")}</h2>
          <CategoryTable
            categories={parentCategories}
            onEdit={handleEdit}
            onDelete={(id) => {
              setDeleteId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
            refetch={refetch}
            showParentColumn={false}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("childCategory")}</h2>
          <CategoryTable
            categories={childCategories}
            onEdit={handleEdit}
            onDelete={(id) => {
              setDeleteId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
            refetch={refetch}
            showParentColumn={true}
          />
        </div>
      )}
      <Pagination
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={handleCloseDialog}
        title={selectedCategory ? t("editCategory") : t("createCategory")}
        size="lg"
        className="pb-4 "
      >
        <FormComponent
          setIsDialogOpen={setIsDialogOpen}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          categoryId={selectedCategory?.id}
          initialValues={selectedCategory || undefined}
          tree={allCategoriesforTree?.responseValue || []}
          defaultValues={
            selectedCategory
              ? {
                  name: selectedCategory.name,
                  parentId: selectedCategory.parentId || 0,
                  isActive: selectedCategory.isActive ?? true,
                }
              : undefined
          }
        />
      </DialogComponent>
    </div>
  )
}

export default CategoryPage
