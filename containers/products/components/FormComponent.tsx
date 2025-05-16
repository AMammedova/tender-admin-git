"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Product, ProductFormData } from "../types/product-type";
import { productService } from "@/lib/services/productService";
import { toast } from "react-toastify";
import BasicInfoStep from "./BasicInfoStep";
import AttributesStep from "./AttributesStep";


interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  productId?: number | null;
  initialValues?: Product;
  onSuccess?: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  productId,
  initialValues,
  onSuccess,
}) => {
  const t = useTranslations("Products");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; imageUrl: string }[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        setIsLoading(true);
        try {
          const response = await productService.getProductById(productId);
          if (response.responseValue) {
            console.log("response", response.responseValue)
            const productImages = (response.responseValue.productImageDto || []).map(
              (img: { id: number; imageUrl: string }) => ({ id: img.id, imageUrl: img.imageUrl })
            );
            setExistingImages(productImages);
            setPreviewUrls(productImages.map(img => img.imageUrl));
            
            // Set the product data for the form
            setProductData({
              title: response.responseValue.title,
              detail: response.responseValue.detail,
              categoryDto: response.responseValue.categoryDto,
              image: null // Set image to null since we handle images separately
            });
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProductDetails();
  }, [productId]);

  const handleFormSubmit = async (data: ProductFormData, images: File[]) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("detail", data.detail);
      formData.append("categoryId", data.categoryDto.id.toString());

      // Store data for step 2
      setProductData(data);

      if (productId) {
        // Update existing product
        images.forEach((image) => {
          formData.append("NewImage", image);
        });
        removedExistingImages.forEach((id) => {
          formData.append("DeletedImgId", id.toString());
        });
        formData.append("id", productId.toString());
        await productService.updateProduct(formData);

        // Check if we need to move to attribute step
        let attrRes = await productService.getAttributesByProduct(undefined, productId);

        if (attrRes.responseValue && attrRes.responseValue.length > 0) {
          setStep(2); // Move to attribute step
        } else {
          // No attributes to fill, complete the process
          setIsDialogOpen(false);
          toast.success(t("product_updated_success"));
          onSuccess?.();
        }
      } else {
        // Create new product
        images.forEach((image) => {
          formData.append("Image", image);
        });

        const response = await productService.createProduct(formData);
        if (response?.responseValue?.id) {
          setCreatedProductId(response.responseValue.id);

          let attrRes = await productService.getAttributesByProduct(data.categoryDto.id);
          console.log("atrr", attrRes.responseValue && attrRes.responseValue.length)
          if (attrRes.responseValue && attrRes.responseValue.length > 0) {
            setStep(2); // Move to attributes step if attributes exist
          } else {
            // No attributes to fill, complete the process
            setIsDialogOpen(false);
            toast.success(t("product_created_success"));
            onSuccess?.();
          }
        } else {
          setIsDialogOpen(false);
          toast.success(t("product_created_success"));
          onSuccess?.();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || t("error_occurred"));
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttributeSubmit = async (attributes: { attributeId: number; value: string }[]) => {
    setIsLoading(true);
    try {
      const targetId = productId || createdProductId;
      if (!targetId) return;

      await productService.setProductAttributes(targetId, attributes);

      setIsDialogOpen(false);
      toast.success(productId ? t("product_updated_success") : t("product_created_success"));
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || t("error_occurred"));
      console.error("Error submitting attributes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200
              ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}
              font-semibold text-base`}>
              1
            </div>
            {step === 1 && (
              <span className="mt-2 text-xs text-blue-600 font-medium transition-all duration-200">{t('step_basic_info')}</span>
            )}
          </div>
          {/* Line */}
          <div className={`h-[1px] w-10 mx-2 transition-colors duration-200 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200
              ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}
              font-semibold text-base`}>
              2
            </div>
            {step === 2 && (
              <span className="mt-2 text-xs text-blue-600 font-medium transition-all duration-200">{t('step_attributes')}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-0 md:p-4 space-y-8">
      {renderStepIndicator()}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        step === 1 ? (
          <BasicInfoStep
            initialValues={
              productData
                ? {
                    ...productData,
                    image: productData.image ?? [], // convert null to []
                  }
                : initialValues
            }
            productId={productId}
            existingImages={existingImages}
            previewUrls={previewUrls}
            setPreviewUrls={setPreviewUrls}
            setRemovedExistingImages={setRemovedExistingImages}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
          />
        ) : (
          <AttributesStep
            mode={productId ? 'edit' : 'create'}
            categoryId={productData?.categoryDto.id || 0}
            productId={productId || createdProductId}
            productData={productData}
            onSubmit={handleAttributeSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
            refetch={onSuccess ?? (() => { })}
          />
        )
      )}
    </div>
  );
};

export default FormComponent;