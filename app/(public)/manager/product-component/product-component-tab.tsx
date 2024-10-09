"use client";

import TabsSelect from "@/components/tabs-select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Key, useState, useTransition } from "react";
import { Category } from "@/interfaces/category.interface";
import CategoriesPage from "./categories";
import EditCategory from "./edit-categories";
import { Product } from "@/interfaces/product.interface";
import ProductsPage from "./products";
import { productsAll } from "@/data/product-all";
import { componentAll } from "@/data/component-all";
import ComponentsPage from "./components";
import { Component } from "@/interfaces/component.interface";
import EditComponent from "./edit-component";

interface Props {
  categories: Category[];
}

export default function ProductComponentTab({ categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState(productsAll);
  const [product, setProduct] = useState<Product | null>(null);
  const [components, setComponents] = useState(componentAll);
  const [component, setComponent] = useState<Component | null>(null);

  const getStepContent = (step: number, label: string) => {
    switch (step) {
      case 0:
        return (
          <CategoriesPage
            label={label}
            categories={categories}
            handleSeeAll={handleSeeAll}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case 1:
        return (
          <EditCategory
            label={label}
            category={category}
            handleSave={handleSave}
            handleDiscard={handleDiscard}
          />
        );
      case 2:
        return (
          <ProductsPage
            label={label}
            category={category?.name}
            products={products}
            handleEdit={handleEditProduct}
            handleDelete={handleDelete}
          />
        );
      case 3:
        return (
          <ComponentsPage
            label={label}
            category={category?.name}
            components={components}
            handleEdit={handleEditComponent}
            handleDelete={handleDelete}
          />
        );
      case 5:
        return (
          <EditComponent
            label={label}
            category={category}
            component={component}
            handleSave={handleSave}
            handleDiscard={handleDiscard}
          />
        );
      default:
        return "unknow step";
    }
  };

  const tabs = [
    { id: "product", label: "Product" },
    { id: "component", label: "Component" },
  ];

  const handleTabChange = (key: Key) => {
    setActiveStep(0);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSeeAll = (category?: Category | null, label?: string) => {
    setCategory(category!);
    if (label === "Product") {
      setProducts(productsAll.filter((p) => p.category === category?.id));
      setActiveStep(2);
    } else {
      setComponents(componentAll.filter((c) => c.category === category?.id));
      setActiveStep(3);
    }
  };

  const handleEdit = (category?: Category | null) => {
    if (category) {
      setCategory(category);
    } else {
      setCategory(null);
    }
    setActiveStep(1);
  };

  const handleDelete = (categoryId: string) => {};

  const handleSave = () => {};

  const handleDiscard = () => {
    setActiveStep(0);
  };

  const handleEditProduct = (product?: Product | null) => {};

  const handleEditComponent = (component?: Component | null) => {
    setComponent(component!);
    setActiveStep(5);
  };

  return (
    <div className="mb-40">
      <h3 className="font-bold text-xl mb-5">Product & Component</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div className="mt-8">{getStepContent(activeStep, tab.label)}</div>
          ) : null;
        })}
      </div>
    </div>
  );
}
