import type { Color } from "@/interfaces/color.interface";
import type { Component } from "@/interfaces/component.interface";
import {
  useFetchBomComponentsCategoriesQuery,
  useFetchComponentsQuery,
  useFetchColorsQuery,
  useCustomizeProductMutation,
} from "@/store";
import { useDisclosure } from "@heroui/modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  selectedCategory: string;
  userId: string;
  accessToken: string;
}

export interface ComponentSelection {
  categoryId: string;
  component: Component | null;
  primaryColor: Color | null;
  patternColor: Color | null;
}

export function useCreateComponents({
  selectedCategory,
  userId,
  accessToken,
}: Props) {
  const router = useRouter();

  const { data: bomCategories, isLoading: isLoadingBOMCateogires } =
    useFetchBomComponentsCategoriesQuery(accessToken);

  const { data: components, isLoading: isLoadingComponents } =
    useFetchComponentsQuery(accessToken);

  const { data: colors, isLoading: isLoadingColors } =
    useFetchColorsQuery(accessToken);

  const [customizeProduct, results] = useCustomizeProductMutation();
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<ComponentSelection[]>([]);

  const isValid = selections.every(
    (selection) =>
      selection.component && selection.primaryColor && selection.patternColor
  );

  function decreateQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function increateQuantity() {
    setQuantity(quantity + 1);
  }

  const handleColorSelect = (
    categoryId: string,
    color: Color,
    type: "primary" | "pattern"
  ) => {
    setSelections((prev) =>
      prev?.map((selection) =>
        selection.categoryId === categoryId
          ? {
              ...selection,
              [type === "primary" ? "primaryColor" : "patternColor"]: color,
            }
          : selection
      )
    );
  };

  const handleProductSave = async () => {
    if (accessToken) {
      try {
        const simplifiedComponents = selections?.map((item) => ({
          id: item.component?.id,
          primary_color: item.primaryColor?.id,
          pattern_color: item.patternColor?.id,
        }));
        const data = {
          user_id: userId,
          category_id: selectedCategory,
          price: totalPrice,
          quantity,
          components: simplifiedComponents,
        };
        await customizeProduct({
          data,
          accessToken,
        }).unwrap();
      } catch (error) {
        setModalMessage("An error occurred. Please try again.");
        onOpen();
      } finally {
        router.push("/cart");
      }
    } else {
      setModalMessage("Please login to add items to cart");
      onOpen();
    }
  };

  return {
    bomCategories,
    isLoadingBOMCateogires,
    components,
    isLoadingComponents,
    colors,
    isLoadingColors,
    results,
    modalMessage,
    isOpen,
    onOpenChange,
    totalPrice,
    setTotalPrice,
    quantity,
    selections,
    setSelections,
    isValid,
    decreateQuantity,
    increateQuantity,
    handleColorSelect,
    handleProductSave,
  };
}
