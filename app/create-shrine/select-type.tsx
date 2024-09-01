"use client";

import ProductTypeCardComponent from "@/components/product-type-card";
import { Button } from "@nextui-org/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { productTypes } from "../page";
import { useState } from "react";

export default function SelectTypePage() {
  const [selected, setSelected] = useState("ศาลพระพรหม");

  return (
    <div>
      <div className="flex justify-between my-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Step 1 of 3</h3>
          <p>เลือกประเภทศาล</p>
        </div>
        <Button color="primary" variant="bordered" className="rounded-3xl">
          <div className="flex items-center justify-center gap-2">
            <p className="text-black">Next</p>
            <FaArrowRightLong color="black" />
          </div>
        </Button>
      </div>
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
            />
          </div>
        ))}
      </section>
    </div>
  );
}
