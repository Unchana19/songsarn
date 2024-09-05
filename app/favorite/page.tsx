"use client";

import { productFinished } from "@/data/product-finished";
import FavoriteTab from "./favorite-tab";
import { productCustomize } from "@/data/product-customize";

interface Props {
  searchParams: { type: string };
}

export default function FavoritePage({ searchParams }: Props) {
  let products;
  if (searchParams.type === "finished" || undefined) {
    products = productFinished;
  } else {
    products = productCustomize;
  }
  return (
    <div>
      <FavoriteTab products={products} />
    </div>
  );
}
