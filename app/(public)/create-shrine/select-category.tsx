"use client";

import CategoryCard from "@/components/categoy-card";
import { Category } from "@/interfaces/category.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

export default function SelectCategoryPage({
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories/product-categories");
      const result = await response.json();
      if (response.ok) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex gap-5 overflow-x-auto p-2">
      {categories.map((category: Category) => (
        <div
          key={category.id}
          aria-hidden="true"
          className="flex aspect-[3/5] min-w-40"
          onClick={() => setSelectedCategory(category.id)}
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
