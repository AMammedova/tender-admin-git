"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

import { productService } from "@/lib/services/productService";
import { CheckCircle, ChevronRight, PlusCircle, MinusCircle, Loader2, Check, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Attribute, Section, AttributesStepProps, AttributeValue } from "../types/attribute-type";




// Helper: collect all chosen attributes recursively (root and children)
function collectChosenAttributes(attrs: Attribute[]): { id: number; name: string; value: string }[] {
    let result: { id: number; name: string; value: string }[] = [];
    attrs.forEach(attr => {
        if (attr.attributeValues && attr.attributeValues.some((v: AttributeValue) => v.isChosen)) {
            const chosenValue = attr.attributeValues.find((v: AttributeValue) => v.isChosen);
            result.push({
                id: attr.id,
                name: attr.name,
                value: chosenValue ? chosenValue.value : ''
            });
        }
        if (attr.children && attr.children.length > 0) {
            result = result.concat(collectChosenAttributes(attr.children));
        }
    });
    return result;
}

const AttributesStep: React.FC<AttributesStepProps> = ({
    mode,
    categoryId,
    productId,
    productData,
    onCancel,
    isLoading,
    refetch
}) => {
    const t = useTranslations("Products");
    console.log(mode,"mode")
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);
    const [attributeValues, setAttributeValues] = useState<{ [id: number]: string }>({});
    const [expandedAttrs, setExpandedAttrs] = useState<number[]>([]);
    const [addValueModal, setAddValueModal] = useState<{ open: boolean; attrId: number | null }>({ open: false, attrId: null });
    const [newValue, setNewValue] = useState("");
    const [adding, setAdding] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedAttributesBySection, setSelectedAttributesBySection] = useState<{
        [sectionId: number]: {
            sectionName: string;
            attributes: { id: number; name: string; value: string }[];
        };
    }>({});
    const [expandedSections, setExpandedSections] = useState<{ [sectionId: number]: boolean }>({});

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoading(true);
            try {
                let response;
                if (mode === 'edit' && productId && categoryId) {
                    response = await productService.getAttributesByProduct(categoryId, productId);
                } else if (mode === 'create' && categoryId) {
                    response = await productService.getAttributesByProduct(categoryId);
                }
                if (response && response.responseValue) {
                    setSections(response.responseValue);
                    // Auto-select first section if available
                    if (response.responseValue.length > 0) {
                        setSelectedSectionId(response.responseValue[0].id);
                    }
                    // Pre-select attributes with isChosen: true (root və child-lar üçün)
                    const selectedBySection: {
                        [sectionId: number]: {
                            sectionName: string;
                            attributes: { id: number; name: string; value: string }[];
                        };
                    } = {};
                    response.responseValue.forEach((section: Section) => {
                        const selectedAttrs = collectChosenAttributes(section.attributeDtos);
                        if (selectedAttrs.length > 0) {
                            selectedBySection[section.id] = {
                                sectionName: section.name,
                                attributes: selectedAttrs
                            };
                        }
                    });
                    setSelectedAttributesBySection(selectedBySection);
                }
            } catch (error) {
                console.error('Error fetching attributes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttributes();
    }, [mode, categoryId, productId]);

    const selectedSection = useMemo(() => 
        sections.find(section => section.id === selectedSectionId),
        [sections, selectedSectionId]
    );

    const handleSectionSelect = (sectionId: number) => {
        setSelectedSectionId(sectionId);
        // Clear selected attributes when changing sections
        setSelectedAttributeIds([]);
        setAttributeValues({});
    };

    const handleAttributeSelect = (id: number) => {
        if (!selectedSection) return;

        setSelectedAttributeIds(prev => {
            const isSelected = prev.includes(id);
            const newSelectedIds = isSelected
                ? prev.filter(i => i !== id)
                : [...prev, id];

            setSelectedAttributesBySection(prevSections => {
                const newSections = { ...prevSections };
                const sectionId = selectedSection.id;
                const sectionName = selectedSection.name;
                const attr = findAttributeById(selectedSection.attributeDtos, id);
                if (!attr) return newSections;

                if (!isSelected) {
                    if (!newSections[sectionId]) {
                        newSections[sectionId] = { sectionName, attributes: [] };
                    }
                    // Prevent duplicate
                    if (!newSections[sectionId].attributes.some(a => a.id === id)) {
                        newSections[sectionId].attributes = [
                            ...newSections[sectionId].attributes,
                            {
                                id: attr.id,
                                name: attr.name,
                                value: attributeValues[attr.id] || ''
                            }
                        ];
                    }
                } else {
                    if (newSections[sectionId]) {
                        newSections[sectionId].attributes = newSections[sectionId].attributes.filter(a => a.id !== id);
                        if (newSections[sectionId].attributes.length === 0) {
                            delete newSections[sectionId];
                        }
                    }
                }
                return newSections;
            });

            return newSelectedIds;
        });
    };

    // Helper: attribute-u tapmaq üçün (child-lar da daxil olmaqla)
    function findAttributeById(attrs: Attribute[], id: number): Attribute | undefined {
        for (const attr of attrs) {
            if (attr.id === id) return attr;
            if (attr.children && attr.children.length > 0) {
                const found = findAttributeById(attr.children, id);
                if (found) return found;
            }
        }
        return undefined;
    }

    const handleValueChange = (id: number, value: string) => {
        setAttributeValues(prev => ({ ...prev, [id]: value }));
        
        // Update value in selectedAttributesBySection
        setSelectedAttributesBySection(prevSections => {
            const newSections = { ...prevSections };
            Object.keys(newSections).forEach(sectionId => {
                const section = newSections[Number(sectionId)];
                const attrIndex = section.attributes.findIndex(a => a.id === id);
                if (attrIndex !== -1) {
                    section.attributes[attrIndex].value = value;
                }
            });
            return newSections;
        });
    };

    const toggleExpand = (id: number) => {
        setExpandedAttrs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const renderAttributeTree = (attribute: Attribute, depth = 0) => {
        const hasChildren = attribute.children && attribute.children.length > 0;
        const isExpanded = expandedAttrs.includes(attribute.id);
        // Checkbox is checked if selected or if any value is isChosen
        const isChecked =
            !!selectedAttributesBySection[selectedSection?.id || 0]?.attributes.some(
                (a) => a.id === attribute.id
            );

        return (
            <div key={attribute.id} className={`${depth > 0 ? "ml-4" : ""} my-1`}>
                <div className="flex items-center gap-2 rounded-md hover:bg-gray-50 p-1.5">
                    {hasChildren && (
                        <button
                            type="button"
                            onClick={() => toggleExpand(attribute.id)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-transform"
                        >
                            <ChevronRight className={`w-4 h-4 ${isExpanded ? "rotate-90" : ""} transition-transform`} />
                        </button>
                    )}
                    {!hasChildren && <div className="w-4" />}

                    <label className="flex items-center gap-2 cursor-pointer select-none flex-1">
                        <div className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 bg-white">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleAttributeSelect(attribute.id)}
                                className="opacity-0 absolute"
                            />
                            {isChecked && (
                                <Check className="w-4 h-4 text-blue-600" />
                            )}
                        </div>
                        <span className="text-sm font-medium">{attribute.name}</span>
                    </label>
                </div>

                {hasChildren && isExpanded && (
                    <div className="ml-4 border-l border-gray-200 pl-2 mt-1">
                        {attribute.children.map(child => renderAttributeTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    const handleSubmitAttributes = async (e: React.FormEvent) => {
        e.preventDefault();

        // Bütün seçilmiş atributları və dəyərləri topla
        const attributeValueDtos: { attributeId: number; attributeValueId: number }[] = [];

        Object.values(selectedAttributesBySection).forEach(section => {
            section.attributes.forEach(attr => {
                // Orijinal attribute-u tap (value id-ni tapmaq üçün)
                const originalAttr = findAttributeById(
                    sections.find(s => s.name === section.sectionName)?.attributeDtos || [],
                    attr.id
                );
                if (!originalAttr) return;
                // Seçilmiş value-nu tap
                const selectedValue = attr.value;
                const valueObj = originalAttr.attributeValues.find(v => v.value === selectedValue);
                if (valueObj && typeof valueObj.id === "number") {
                    attributeValueDtos.push({
                        attributeId: attr.id,
                        attributeValueId: valueObj.id
                    });
                }
            });
        });

        if (!productId) {
            toast.error("Product ID tapılmadı!");
            return;
        }

        try {
            let response;
            if (mode === 'edit') {
                response = await productService.updateProductAttributeValues(productId, attributeValueDtos);
            } else {
                response = await productService.setProductAttributeValues(productId, attributeValueDtos);
            }
            if (response.statusCode === 201 || response.statusCode === 200) {
                toast.success(response.message || "Uğurla yadda saxlanıldı!");
                onCancel();
                refetch();
            } else {
                toast.error(response.message || "Xəta baş verdi!");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Xəta baş verdi! Yenidən cəhd edin.");
        }
    };

    const handleAddValue = async () => {
        if (!newValue.trim() || !addValueModal.attrId || !categoryId) return;
        setAdding(true);
        try {
            const res = await productService.addAttributeValue({
                value: newValue.trim(),
                attributeId: addValueModal.attrId,
                categoryId: categoryId
            });
            setSections(prev => prev.map(section => ({
                ...section,
                attributeDtos: section.attributeDtos.map(attr =>
                    attr.id === addValueModal.attrId
                        ? { 
                            ...attr, 
                            attributeValues: [...attr.attributeValues, { 
                                id: Date.now(), // Temporary ID until server response
                                value: newValue.trim(), 
                                isChosen: false 
                            }] 
                        }
                        : attr
                )
            })));
            setAttributeValues(prev => ({ ...prev, [addValueModal.attrId!]: newValue.trim() }));
            setAddValueModal({ open: false, attrId: null });
            setNewValue("");
        } catch (e) {
            toast.error("Xəta baş verdi! Yenidən cəhd edin.");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Product info summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="text-blue-600 w-5 h-5" />
                    <h3 className="text-lg font-semibold text-gray-800">{t("product_info_summary")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">{t("title")}</p>
                        <p className="font-medium truncate">{productData?.title || "-"}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">{t("category")}</p>
                        <p className="font-medium truncate">{productData?.categoryDto?.name || "-"}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">{t("detail")}</p>
                        <p className="font-medium line-clamp-2">{productData?.detail || "-"}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sections and Attributes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700">{t("sections")}</h4>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionSelect(section.id)}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                                        selectedSectionId === section.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {section.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Selected Section Attributes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700">
                            {selectedSection ? `${selectedSection.name} ${t("attributes")}` : t("select_section")}
                        </h4>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                        {selectedSection ? (
                            <div className="space-y-4">
                                {selectedSection.attributeDtos.map(attr => renderAttributeTree(attr))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p>{t("select_section_to_view_attributes")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Selected Attributes Values */}
            {Object.keys(selectedAttributesBySection).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700">
                            {t("selected_attributes")}
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {Object.values(selectedAttributesBySection).reduce(
                                    (sum, section) => sum + section.attributes.length, 
                                    0
                                )}
                            </span>
                        </h4>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleSubmitAttributes} className="space-y-6">
                            {Object.entries(selectedAttributesBySection).map(([sectionId, section]) => {
                                const numericSectionId = Number(sectionId);
                                const isExpanded = expandedSections[numericSectionId] ?? true; // default: open
                                return (
                                    <div key={sectionId} className="space-y-4">
                                        <button
                                            type="button"
                                            className="flex items-center w-full font-medium text-gray-700 border-b pb-2 focus:outline-none"
                                            onClick={() =>
                                                setExpandedSections(prev => ({
                                                    ...prev,
                                                    [numericSectionId]: !prev[numericSectionId]
                                                }))
                                            }
                                        >
                                            <span className="flex-1 text-left">{section.sectionName}</span>
                                            {isExpanded ? (
                                                <ChevronDown className="w-5 h-5" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5" />
                                            )}
                                        </button>
                                        {isExpanded && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {section.attributes.map(attr => {
                                                    const originalAttr = findAttributeById(
                                                        sections.find(s => s.id === numericSectionId)?.attributeDtos || [],
                                                        attr.id
                                                    );
                                                    if (!originalAttr) return null;

                                                    return (
                                                        <div key={attr.id} className="bg-gray-50 p-3 rounded-lg">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                                {attr.name}
                                                            </label>
                                                            {originalAttr.attributeValues && originalAttr.attributeValues.length > 0 ? (
                                                                <div className="flex items-center gap-2">
                                                                    <select
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                        value={attr.value}
                                                                        onChange={e => handleValueChange(attr.id, e.target.value)}
                                                                    >
                                                                        <option value="">{t("select_value")}</option>
                                                                        {originalAttr.attributeValues.map(val => (
                                                                            <option key={val.id} value={val.value}>
                                                                                {val.value}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {originalAttr.isChangeable !== false && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setAddValueModal({ open: true, attrId: attr.id })}
                                                                            className="ml-1 p-1 rounded hover:bg-blue-50"
                                                                        >
                                                                            <PlusCircle className="w-5 h-5 text-blue-600" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    value={attr.value}
                                                                    onChange={e => handleValueChange(attr.id, e.target.value)}
                                                                    className="w-full"
                                                                    placeholder={t("enter_value")}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </form>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isLoading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    {t("cancel")}
                </Button>
                <Button
                    onClick={handleSubmitAttributes}
                    disabled={
                        isLoading ||
                        Object.values(selectedAttributesBySection).reduce(
                            (sum, section) => sum + section.attributes.length, 0
                        ) === 0
                    }
                    className="text-white"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t("saving")}
                        </span>
                    ) : (
                        t("save")
                    )}
                </Button>
            </div>

            {/* Add Value Modal */}
            <Dialog open={addValueModal.open} onOpenChange={open => setAddValueModal(v => ({ ...v, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("add_new_value")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            value={newValue}
                            onChange={e => setNewValue(e.target.value)}
                            placeholder={t("enter_value")}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setAddValueModal({ open: false, attrId: null })}
                                disabled={adding}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                onClick={handleAddValue}
                                disabled={adding || !newValue.trim()}
                                className="bg-blue-600 text-white"
                            >
                                {adding ? t("saving") : t("add")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("confirm_close")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-gray-600">{t("confirm_close_message")}</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                {t("continue_editing")}
                            </Button>
                            <Button onClick={onCancel} className="bg-red-600 text-white">
                                {t("close_anyway")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AttributesStep;