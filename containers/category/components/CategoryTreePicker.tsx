"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight, FolderClosed, FolderOpen, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { Category } from "../types/category-type"
import { useCategorySearch } from '@/lib/hooks/useCategories'
import { useTranslations } from "next-intl"

interface CategoryTreePickerProps {
  tree: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  placeholder?: string
  disabled?: boolean
  notSelectedText?: string
}

const flattenTree = (nodes: Category[]): Category[] =>
  nodes.reduce<Category[]>((acc, node) => {
    acc.push(node)
    if (node.children && node.children.length > 0) {
      acc.push(...flattenTree(node.children))
    }
    return acc
  }, [])

export const CategoryTreePicker: React.FC<CategoryTreePickerProps> = ({
  tree,
  selectedId,
  onSelect,
  placeholder = "Kateqoriya seçin...",
  disabled = false,
  notSelectedText,
}) => {
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const searchInputRef = useRef<HTMLInputElement>(null)
  const  t = useTranslations("Categories")

  const { data: searchData, isLoading: isSearchLoading } = useCategorySearch(search)

  const flattened = useMemo(() => flattenTree(tree), [tree])

  const filteredTree = useMemo(() => {
    if (!search) return tree

    const matchingIds = new Set(
      flattened.filter((n) => n.name.toLowerCase().includes(search.toLowerCase())).map((n) => n.id),
    )

    // Find all parent IDs of matching nodes to ensure they're visible
    const relevantIds = new Set<number>(matchingIds)
    const findParents = (nodes: Category[], parentIds: number[] = []) => {
      nodes.forEach((node) => {
        if (matchingIds.has(node.id)) {
          parentIds.forEach((id) => relevantIds.add(id))
        }
        if (node.children && node.children.length > 0) {
          findParents(node.children, [...parentIds, node.id])
        }
      })
    }

    findParents(tree)

    // Auto-expand parents of matching nodes
    setExpanded((prev) => {
      const next = new Set(prev)
      relevantIds.forEach((id) => next.add(id))
      return next
    })

    const filterNodes = (nodes: Category[]): Category[] =>
      nodes
        .filter((n) => relevantIds.has(n.id) || (n.children && n.children.some((c) => relevantIds.has(c.id))))
        .map((n) => ({
          ...n,
          children: n.children ? filterNodes(n.children) : [],
        }))

    return filterNodes(tree)
  }, [search, tree, flattened])

  const expandAllNodes = useCallback((nodes: Category[]) => {
    const ids = new Set<number>()
    const traverse = (items: Category[]) => {
      items.forEach((item) => {
        ids.add(item.id)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    traverse(nodes)
    setExpanded(ids)
  }, [])

  const collapseAllNodes = useCallback(() => {
    setExpanded(new Set())
  }, [])

  useEffect(() => {
    if (search) {
      expandAllNodes(filteredTree)
    }
  }, [search, filteredTree, expandAllNodes])

  const toggleExpand = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const getCategoryName = (id: number | null) => {
    if (id === null) return notSelectedText || "Kateqoriya seçilməyib"
    if (id === 0) return "Ana kateqoriya"
    const found = flattened.find((c) => c.id === id)
    return found ? found.name : "Seçilən kateqoriya tapılmadı"
  }

  const clearSearch = () => {
    setSearch("")
    searchInputRef.current?.focus()
  }

  const renderTreeNode = (node: Category, level = 0) => {
    const isSelected = selectedId === node.id
    const isExpanded = expanded.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={cn(
            "flex items-center py-2 pl-2 pr-3 rounded-md cursor-pointer transition-all duration-200",
            "hover:bg-accent/40",
            isSelected && "bg-primary/15 text-primary font-medium shadow-sm",
          )}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onSelect(node.id)}
        >
          {hasChildren ? (
            <motion.button
              type="button"
              className="mr-2 p-1 rounded-full hover:bg-accent/70 transition-colors duration-200 flex items-center justify-center"
              onClick={(e) => toggleExpand(node.id, e)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
              whileTap={{ scale: 0.9 }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.button>
          ) : (
            <div className="w-6 h-6 mr-2 flex items-center justify-center opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            </div>
          )}

          {hasChildren ? (
            <span className="mr-2 text-muted-foreground">
              {isExpanded ? <FolderOpen className="h-4 w-4" /> : <FolderClosed className="h-4 w-4" />}
            </span>
          ) : null}

          <span
            className={cn(
              "text-sm transition-all duration-200",
              hasChildren && "font-medium",
              isSelected && "text-primary",
            )}
          >
            {node.name}
          </span>

          {node.isActive !== undefined && (
            <motion.span
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "ml-auto px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
                node.isActive
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-rose-100 text-rose-700 border border-rose-200",
              )}
            >
              {node.isActive ? "Aktiv" : "Deaktiv"}
            </motion.span>
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-l-2 border-accent/40 ml-6 pl-2 my-1">
                {node.children!.map((child) => renderTreeNode(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg bg-white border rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md">
      {/* Header with selected category */}
      <div className="mb-4">
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3 rounded-md border border-primary/20"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/70" />
            <div className="text-sm font-medium text-primary/90">
              {selectedId === null
                ? (notSelectedText || "Kateqoriya seçilməyib")
                : `Seçilən: ${getCategoryName(selectedId)}`}
            </div>
          </div>
          {selectedId !== null && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onSelect(null)}
              className="ml-2 text-xs px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              <span>Təmizlə</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Search and controls */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 py-2 bg-accent/5 border-accent/20 focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
            disabled={disabled}
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex justify-between text-xs">
          <button
            onClick={expandAllNodes.bind(null, tree)}
            className="text-primary/80 hover:text-primary transition-colors duration-200"
          >
            Hamısını aç
          </button>
          <button
            onClick={collapseAllNodes}
            className="text-primary/80 hover:text-primary transition-colors duration-200"
          >
            Hamısını bağla
          </button>
        </div>
      </div>

      {/* Tree content or search results */}
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "flex items-center py-2 px-4 rounded-md cursor-pointer transition-all duration-200",
            "hover:bg-accent/40 border border-transparent hover:border-accent/30",
            selectedId === 0 && "bg-primary/15 text-primary font-medium border-primary/20 shadow-sm",
          )}
          onClick={() => onSelect(0)}
        >
          <div className="w-5 h-5 mr-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
          </div>
          <span className="text-sm font-medium">{t("parentCategory")}</span>
        </motion.div>

        {search ? (
          isSearchLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("searching")}</div>
          ) : searchData && searchData.responseValue.length > 0 ? (
            searchData.responseValue.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center py-2 px-4 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent/40",
                  selectedId === item.id && "bg-primary/15 text-primary font-medium border-primary/20 shadow-sm"
                )}
                onClick={() => onSelect(item.id)}
              >
                <span className="text-sm">{item.name}</span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">Nəticə tapılmadı</div>
          )
        ) : (
          filteredTree.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              <Search className="h-5 w-5 mx-auto mb-2 opacity-40" />
              Nəticə tapılmadı
            </motion.div>
          ) : (
            filteredTree.map((node) => renderTreeNode(node))
          )
        )}
      </div>
    </div>
  )
}
