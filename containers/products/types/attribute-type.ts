import { ProductFormData, AttributeSubmission } from "../types/product-type";
export interface AttributeValue {
    id: number;
    value: string;
    isChosen: boolean;
}

export interface Attribute {
    id: number;
    name: string;
    isChangeable?: boolean;
    attributeValues: AttributeValue[];
    children: Attribute[];
}

export interface Section {
    id: number;
    name: string;
    attributeDtos: Attribute[];
}

export interface AttributesStepProps {
    mode: 'edit' | 'create';
    categoryId: number | undefined;
    productId: number | null;
    productData: ProductFormData | null;
    onSubmit: (attributes: AttributeSubmission[]) => void;
    onCancel: () => void;
    isLoading: boolean;
    refetch: () => void;
    buttonText?: string;
}