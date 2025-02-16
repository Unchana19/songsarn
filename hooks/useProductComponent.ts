import type { Category } from "@/interfaces/category.interface";
import type { Material } from "@/interfaces/material.interface";
import type { Product } from "@/interfaces/product.interface";
import type { SelectedComponent } from "@/interfaces/select-component";
import type { CreateCategorySchema } from "@/lib/schemas/createCategoySchema";
import type { CreateComponentSchema } from "@/lib/schemas/createComponentSchema";
import type { CreateProductSchema } from "@/lib/schemas/createProductSchema";
import type { Component } from "@/interfaces/component.interface";
import {
  useCreateCategoryMutation,
  useCreateComponentMutation,
  useCreateProductMutation,
  useDeleteCategoryMutation,
  useDeleteComponentMutation,
  useDeleteProductMutation,
  useEditCategoryMutation,
  useEditComponentMutation,
  useEditProductMutation,
  useFetchCategoriesQuery,
} from "@/store";
import { useDisclosure } from "@heroui/modal";
import { useState, useTransition } from "react";
import { useStepChange } from "./useStepChange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  accessToken: string;
}

export function useProductComponent({ accessToken }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useStepChange(0);

  const {
    currentData: categories,
    isLoading,
    isSuccess,
  } = useFetchCategoriesQuery(accessToken);

  const [createCategory] = useCreateCategoryMutation();
  const [editCategory] = useEditCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [createProduct] = useCreateProductMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [createComponent] = useCreateComponentMutation();
  const [editComponent] = useEditComponentMutation();
  const [deleteComponent] = useDeleteComponentMutation();

  const [category, setCategory] = useState<Category | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [component, setComponent] = useState<Component | null>(null);

  const { isOpen, onOpenChange } = useDisclosure();
  const [message, setMessage] = useState("");

  const tabs = [
    { id: "product", label: "Product" },
    { id: "component", label: "Component" },
  ];

  const handleTabChange = (key: string) => {
    setActiveStep(0);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key);
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSeeAll = (category: Category, label: string) => {
    setCategory(category);
    if (label === "product") {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  };

  const handleCategoryEdit = (category: Category | null) => {
    setCategory(category || null);
    setActiveStep(1);
  };

  const handleCategorySave = async (
    data: CreateCategorySchema,
    file: File | null,
    componentCategories?: string[]
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (componentCategories) {
        componentCategories.forEach((category: string, index) => {
          formData.append(`componentCategories[${index}][id]`, category);
        });
      }
      if (category) {
        formData.append("id", category.id);
      }
      if (file) formData.append("file", file);

      if (category) {
        await editCategory({ data: formData, accessToken });
      } else {
        await createCategory({ data: formData, accessToken });
      }

      setActiveStep(0);
    } catch {
      setMessage("Failed to save category");
      onOpenChange();
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory({ id: categoryId, accessToken });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      onOpenChange();
    }
  };

  const handleDiscard = () => setActiveStep(0);

  const handleProductEdit = (product: Product | null) => {
    setProduct(product);
    setActiveStep(4);
  };

  const handleProductSave = async (
    data: CreateProductSchema,
    selectedComponents: SelectedComponent[],
    file: File | null
  ) => {
    try {
      const formData = new FormData();

      if (product) formData.append("id", product.id);

      formData.append("category_id", data.category);
      formData.append("name", data.name);
      formData.append("detail", data.detail);
      formData.append("price", data.price);

      selectedComponents.forEach((component, index) => {
        formData.append(`components[${index}][id]`, component.component);
        formData.append(
          `components[${index}][primary_color]`,
          component.primary_color?.id || ""
        );
        formData.append(
          `components[${index}][pattern_color]`,
          component.pattern_color?.id || ""
        );
      });

      if (file) formData.append("file", file);

      if (product) {
        await editProduct({ data: formData, accessToken });
      } else {
        await createProduct({ data: formData, accessToken });
      }

      setActiveStep(2);
    } catch {
      setMessage("Failed to save product");
      onOpenChange();
    }
  };

  const handleProductDelete = async (productId: string) => {
    try {
      await deleteProduct({ id: productId, accessToken });
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    }
  };

  const handleProductDiscard = () => setActiveStep(2);

  const handleComponentEdit = (component: Component | null) => {
    setComponent(component);
    setActiveStep(5);
  };

  const handleComponentSave = async (
    data: CreateComponentSchema,
    materials: { material: Material; quantity: string }[],
    file: File | null
  ) => {
    try {
      const formData = new FormData();

      if (component) formData.append("id", component.id);

      formData.append("category_id", data.category);
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("color_primary_use", data.color_primary_use);
      formData.append("color_pattern_use", data.color_pattern_use);

      materials.forEach((material, index) => {
        formData.append(
          `materials[${index}][material_id]`,
          material.material.id
        );
        formData.append(`materials[${index}][quantity]`, material.quantity);
      });

      if (file) formData.append("file", file);

      if (component) {
        await editComponent({ data: formData, accessToken });
      } else {
        await createComponent({ data: formData, accessToken });
      }
      setActiveStep(3);
    } catch {
      setMessage("Failed to save component");
      onOpenChange();
    }
  };

  const handleComponentDelete = async (componentId: string) => {
    try {
      await deleteComponent({ id: componentId, accessToken });
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    }
  };

  const handleComponentDiscard = () => setActiveStep(3);

  const handleBack = () => setActiveStep(0);

  return {
    isPending,
    activeStep,
    categories,
    isLoading,
    isSuccess,
    category,
    product,
    component,
    isOpen,
    message,
    tabs,
    searchParams,
    onOpenChange,
    handleTabChange,
    handleSeeAll,
    handleCategoryEdit,
    handleCategorySave,
    handleDelete,
    handleDiscard,
    handleProductEdit,
    handleProductSave,
    handleProductDelete,
    handleProductDiscard,
    handleComponentEdit,
    handleComponentSave,
    handleComponentDelete,
    handleComponentDiscard,
    handleBack,
  };
}
