"use client";

import { productTypes } from "@/data/product-type";
import ProductComponentTab from "./product-component-tab";
import { Category } from "@/interfaces/category.interface";

interface Props {
  searchParams: { type: string };
}

export default function ProductPage({ searchParams }: Props) {
  let categories: Category[];
  if (searchParams.type === "product" || undefined) {
    categories = productTypes.filter((p) => p.type === "product")
  } else {
    categories = productTypes.filter((p) => p.type === "component");
  }
  return (
    <div>
      <ProductComponentTab categories={categories} />
    </div>
  );
}
