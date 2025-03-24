"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import TabsSelect from "@/components/tabs-select";
import CategoriesPage from "./categories";
import EditCategory from "./edit-categories";
import ProductsPage from "./products";
import ComponentsPage from "./components";
import EditProduct from "./edit-product";
import EditComponent from "./edit-component";
import { Skeleton } from "@heroui/skeleton";
import PopupModal from "@/components/popup-modal";
import { useProductComponent } from "@/hooks/useProductComponent";
import Loading from "@/app/loading";

// Main content component
function ProductComponentContent() {
  const session = useSession();

  const {
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
  } = useProductComponent({ accessToken: session.data?.accessToken || "" });

  const renderContent = () => {
    if (isLoading || !isSuccess) {
      return <Loading />;
    }

    switch (activeStep) {
      case 0:
        return (
          <CategoriesPage
            label={searchParams.get("type") || "product"}
            categories={categories}
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
            label={category?.name || ""}
            categoryId={category?.id || ""}
            handleEdit={handleProductEdit}
            handleDelete={handleProductDelete}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <ComponentsPage
            label={category?.name || ""}
            categoryId={category?.id || ""}
            handleEdit={handleComponentEdit}
            handleDelete={handleComponentDelete}
            handleBack={handleBack}
          />
        );
      case 4:
        return (
          <EditProduct
            category={category || categories[0]}
            product={product}
            handleSave={handleProductSave}
            handleDiscard={handleProductDiscard}
          />
        );
      case 5:
        return (
          <EditComponent
            category={category || categories[0]}
            component={component}
            handleSave={handleComponentSave}
            handleDiscard={handleComponentDiscard}
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

// Main component wrapped with Suspense
export default function ProductComponentTab() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductComponentContent />
    </Suspense>
  );
}
