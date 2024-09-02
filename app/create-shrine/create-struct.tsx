import SelectStructComponent from "@/components/select-struct";
import { Product } from "@/types";
import { useState } from "react";

const baseStructs = [
  { name: "ฐานล่าง 1", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ฐานล่าง 2", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ฐานล่าง 3", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ฐานล่าง 4", price: 4000, image: "/shrine/sarnpraprom.png" },
] as Product[];

const baseSizes = ["2 x 2 x 2 m", "3 x 3 x 3 m", "4 x 4 x 4 m", "5 x 5 x 5 m"];

const plateStand = [
  { name: "ถาดจาน 1", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ถาดจาน 2", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ถาดจาน 3", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ถาดจาน 4", price: 6000, image: "/shrine/sarnpraprom.png" },
];

const plateStandSizes = [
  "2 x 2 x 2 m",
  "3 x 3 x 3 m",
  "4 x 4 x 4 m",
  "5 x 5 x 5 m",
];

export default function CreateStructPage() {
  const [selectedBase, setSelectedBase] = useState(baseStructs[0].name);
  const [selectedBaseSize, setSelectedBaseSize] = useState(baseSizes[0]);

  const [seletedPlateStand, setSelectedPlateStand] = useState(
    plateStand[0].name
  );
  const [selectedPlateStandSize, setSelectePlateStandSize] = useState(
    plateStandSizes[0]
  );

  return (
    <div>
      <SelectStructComponent
        typeStruct="ฐานล่าง"
        structs={baseStructs}
        sizes={baseSizes}
        selectedStruct={selectedBase}
        selectedSize={selectedBaseSize}
        setSelectedStruct={setSelectedBase}
        setSelectedSize={setSelectedBaseSize}
      />

      <SelectStructComponent
        typeStruct="ถาดจาน"
        structs={plateStand}
        sizes={plateStandSizes}
        selectedStruct={seletedPlateStand}
        selectedSize={selectedPlateStandSize}
        setSelectedStruct={setSelectedPlateStand}
        setSelectedSize={setSelectePlateStandSize}
      />
    </div>
  );
}
