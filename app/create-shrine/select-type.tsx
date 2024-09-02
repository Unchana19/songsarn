"use client";

import ProductTypeCardComponent from "@/components/product-type-card";
import { productTypes } from "../page";
import { useState } from "react";

export default function SelectTypePage() {
  const [selected, setSelected] = useState("ศาลพระพรหม");

  return (
    <section className="flex gap-5 overflow-x-auto p-2">
      {productTypes.map((productType) => (
        <div
          className="flex aspect-[3/5] min-w-40"
          onClick={() => setSelected(productType.label)}
        >
          <ProductTypeCardComponent
            key={productType.label}
            image={productType.image}
            label={productType.label}
            isSelected={selected === productType.label}
            canSelected
          />
        </div>
      ))}
    </section>
  );
}
