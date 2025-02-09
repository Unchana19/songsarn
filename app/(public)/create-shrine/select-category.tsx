"use client";

import CategoryCard from "@/components/categoy-card";
import type { Category } from "@/interfaces/category.interface";
import { useFetchProductCategoriesQuery } from "@/store";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

export default function SelectCategoryPage({
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const { data: productCategories, isLoading } = useFetchProductCategoriesQuery(
    {}
  );

  if (isLoading) {
    return;
  }

  return (
    <div className="flex gap-5 overflow-x-auto p-2">
      {productCategories.map((category: Category) => (
        <div
          key={category.id}
          aria-hidden="true"
          className="flex aspect-[3/5] min-w-40"
          onClick={() => setSelectedCategory(category.id)}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedCategory(category.id);
            }
          }}
        >
          <CategoryCard
            canSelected
            category={category}
            isSelected={category.id === selectedCategory}
          />
        </div>
      ))}
    </div>
  );
}
