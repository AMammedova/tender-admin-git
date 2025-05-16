"use client"

import type React from "react"
import { useState } from "react"
import type { Category } from "../types/category-type"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronRight, X, FolderTree } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewCategoryModalProps {
  open: boolean
  onClose: () => void
  category: Category | null
  parentCategory: Category | null
}

const TreeNode: React.FC<{ node: Category; level?: number; isLast?: boolean }> = ({
  node,
  level = 0,
  isLast = false,
}) => {
  const [expanded, setExpanded] = useState(true)
  const t = useTranslations("Categories")
  const isParent = !node.parentId || node.parentId === null
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      {/* Tree connector lines */}
      {level > 0 && (
        <>
          <div
            className="absolute left-[-16px] top-0 h-[16px] w-[16px] border-l-2 border-b-2 border-gray-300 dark:border-gray-700 rounded-bl-lg"
            style={{ top: "10px", height: isLast ? "10px" : "100%" }}
          />
          {!isLast && (
            <div className="absolute left-[-16px] top-[20px] h-full w-[1px] border-l-2 border-gray-300 dark:border-gray-700" />
          )}
        </>
      )}

      <div className="flex items-center py-2 pl-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg mr-2",
            isParent
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          <FolderTree className="h-4 w-4" />
        </div>

        <div className="flex flex-1 items-center">
          <span
            className={cn(
              "font-medium",
              isParent ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200",
            )}
          >
            {node.name}
          </span>

          <span
            className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs font-medium",
              node.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {node.isActive ? t("active") : t("inactive")}
          </span>

          {isParent && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {t("parentCategory")}
            </span>
          )}
        </div>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-8 pl-8 animate-fadeIn">
          {node.children && node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isLast={node.children ? index === node.children.length - 1 : false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({ open, onClose, category, parentCategory }) => {
  const t = useTranslations("Categories")

  if (!open || !category) return null

  const isParent = !category.parentId || category.parentId === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl max-w-4xl w-full p-6 relative mx-4 max-h-[90vh] overflow-auto animate-scaleIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center border-b pb-3 dark:border-gray-700">
          {t("category")}: {category.name}
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
              {t("categoryInfo")}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("parentName")}</span>
                {parentCategory ? (
                  <div className="flex items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg mr-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <FolderTree className="h-3 w-3" />
                    </div>
                    <span className="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium">
                      {parentCategory.name}
                    </span>
                  </div>
                ) : (
                  <span className="inline-block text-gray-400 italic">{t("noParent")}</span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("status")}</span>
                <div className="flex gap-2">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium",
                      category.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                    )}
                  >
                    {category.isActive ? t("active") : t("inactive")}
                  </span>

                  {isParent && (
                    <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {t("parentCategory")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">{t("hierarchy")}</h3>

            <div className="mt-2 border rounded-lg p-4 bg-white dark:bg-gray-900 dark:border-gray-700">
              {category.children && category.children.length > 0 ? (
                <div className="overflow-auto max-h-[40vh]">
                  <div className="diagram-container">
                    {category.children && category.children.map((child, index) => (
                      <TreeNode
                        key={child.id}
                        node={child}
                        isLast={category.children ? index === category.children.length - 1 : false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400 italic">{t("noChildren")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCategoryModal
