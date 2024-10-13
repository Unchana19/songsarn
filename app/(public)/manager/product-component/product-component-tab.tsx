"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TabsSelect from "@/components/tabs-select";
import CategoriesPage from "./categories";
import EditCategory from "./edit-categories";
import ProductsPage from "./products";
import ComponentsPage from "./components";
import EditProduct from "./edit-product";
import EditComponent from "./edit-component";
import { Category } from "@/interfaces/category.interface";
import { Product } from "@/interfaces/product.interface";
import { Component } from "@/interfaces/component.interface";
import { CreateCategorySchema } from "@/lib/schemas/createCategoySchema";
import { productsAll } from "@/data/product-all";
import { componentAll } from "@/data/component-all";
import { Skeleton } from "@nextui-org/skeleton";
import PopupModal from "@/components/popup-modal";
import { useDisclosure } from "@nextui-org/modal";

export default function ProductComponentTab() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState(productsAll);
  const [product, setProduct] = useState<Product | null>(null);
  const [components, setComponents] = useState(componentAll);
  const [component, setComponent] = useState<Component | null>(null);

  const { isOpen, onOpenChange } = useDisclosure();
  const [message, setMessage] = useState("");

  const tabs = [
    { id: "product", label: "Product" },
    { id: "component", label: "Component" },
  ];

  useEffect(() => {
    fetchCategories();
  }, [session]);

  useEffect(() => {
    const type = searchParams.get("type") || "product";
    filterTypeCategories(type);
  }, [searchParams, categories]);

  const fetchCategories = async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setCategories(result);
      }
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    } finally {
      setIsLoading(false);
    }
  };

  const filterTypeCategories = (type: string) => {
    setFilterCategories(
      categories.filter((category) => category.type === type)
    );
  };

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
    if (label === "Product") {
      setProducts(productsAll.filter((p) => p.category === category.id));
      setActiveStep(2);
    } else {
      setComponents(componentAll.filter((c) => c.category === category.id));
      setActiveStep(3);
    }
  };

  const handleCategoryEdit = (category?: Category | null) => {
    setCategory(category || null);
    setActiveStep(1);
  };

  const handleCategorySave = async (
    data: CreateCategorySchema,
    file: File | null
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (file) formData.append("file", file);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.data?.accessToken}` },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        await fetchCategories();
        setActiveStep(0);
      } else {
        setMessage(result.message as string);
        onOpenChange();
      }
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    }
  };

  const handleDelete = (categoryId: string) => {
    // Implement delete logic
  };

  const handleDiscard = () => setActiveStep(0);

  const handleProductEdit = (product: Product | null) => {
    setProduct(product);
    setActiveStep(4);
  };

  const handleProductSave = () => {
    // Implement product save logic
  };

  const handleComponentEdit = (component: Component | null) => {
    setComponent(component);
    setActiveStep(5);
  };

  const handleComponentSave = () => {
    // Implement component save logic
  };

  const handleBack = () => setActiveStep(0);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="w-3/4 h-8 rounded-lg" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      );
    }

    switch (activeStep) {
      case 0:
        return (
          <CategoriesPage
            label={searchParams.get("type") || "product"}
            categories={filterCategories}
            handleSeeAll={handleSeeAll}
            handleEdit={handleCategoryEdit}
            handleDelete={handleDelete}
          />
        );
      case 1:
        return (
          <EditCategory
            label={searchParams.get("type") || "product"}
            category={category}
            handleSave={handleCategorySave}
            handleDiscard={handleDiscard}
          />
        );
      case 2:
        return (
          <ProductsPage
            label="Product"
            category={category?.name}
            products={products}
            handleEdit={handleProductEdit}
            handleDelete={handleDelete}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <ComponentsPage
            label="Component"
            category={category?.name}
            components={components}
            handleEdit={handleComponentEdit}
            handleDelete={handleDelete}
            handleBack={handleBack}
          />
        );
      case 4:
        return (
          <EditProduct
            category={category}
            product={product}
            handleSave={handleProductSave}
            handleDiscard={handleDiscard}
          />
        );
      case 5:
        return (
          <EditComponent
            category={category}
            component={component}
            handleSave={handleComponentSave}
            handleDiscard={handleDiscard}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-40">
      <h3 className="font-bold text-xl mb-5">Product & Component</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
        size="lg"
      />
      <div className="mt-8">{renderContent()}</div>
      <PopupModal message={message} isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}
