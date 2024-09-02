import SelectStructComponent from "@/components/select-struct";
import { Product } from "@/types";
import { useState } from "react";

const poles = [
  { name: "ลายเสา 1", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ลายเสา 2", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ลายเสา 3", price: 4000, image: "/shrine/sarnpraprom.png" },
  { name: "ลายเสา 4", price: 4000, image: "/shrine/sarnpraprom.png" },
] as Product[];

const poleSizes = ["2 x 2 x 2 m", "3 x 3 x 3 m", "4 x 4 x 4 m", "5 x 5 x 5 m"];

const top = [
  { name: "ยอด 1", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ยอด 2", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ยอด 3", price: 6000, image: "/shrine/sarnpraprom.png" },
  { name: "ยอด 4", price: 6000, image: "/shrine/sarnpraprom.png" },
];

const topSizes = [
  "2 x 2 x 2 m",
  "3 x 3 x 3 m",
  "4 x 4 x 4 m",
  "5 x 5 x 5 m",
];

export default function CreateOptionPage() {
  const [selectedPole, setSelectedPole] = useState(poles[0].name);
  const [selectedPoleSize, setSelectedPoleSize] = useState(poleSizes[0]);

  const [seletedTop, setSelectedTop] = useState(
    top[0].name
  );
  const [selectedTopSize, setSelecteTopSize] = useState(
    topSizes[0]
  );

  return (
    <div>
      <SelectStructComponent
        typeStruct="ลายเสา"
        structs={poles}
        sizes={poleSizes}
        selectedStruct={selectedPole}
        selectedSize={selectedPoleSize}
        setSelectedStruct={setSelectedPole}
        setSelectedSize={setSelectedPoleSize}
      />

      <SelectStructComponent
        typeStruct="ยอด"
        structs={top}
        sizes={topSizes}
        selectedStruct={seletedTop}
        selectedSize={selectedTopSize}
        setSelectedStruct={setSelectedTop}
        setSelectedSize={setSelecteTopSize}
      />
    </div>
  );
}
