"use client";

import { useState } from "react";

import ProductTypeCardComponent from "@/components/product-type-card";
import { ProductType } from "@/types";
import { productTypes } from "@/data/product-type";

export default function SelectTypePage() {
  const [selected, setSelected] = useState("ศาลพระพรหม");

  return (
    <section className="flex gap-5 overflow-x-auto p-2">
      {productTypes.map((productType: ProductType) => (
        <div
          key={productType.label}
          aria-hidden="true"
          className="flex aspect-[3/5] min-w-40"
          onClick={() => setSelected(productType.label)}
        >
          <ProductTypeCardComponent
            key={productType.label}
            canSelected
            image={productType.image}
            isSelected={selected === productType.label}
            label={productType.label}
          />
        </div>
      ))}
    </section>
  );
}
