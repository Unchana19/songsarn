import SelectStructComponent from "@/components/select-struct";
import { poles, poleSizes, tops, topSizes } from "@/data/product-create-option";
import { useState } from "react";

export default function CreateOptionPage() {
  const [selectedPole, setSelectedPole] = useState(poles[0].name);
  const [selectedPoleSize, setSelectedPoleSize] = useState(poleSizes[0]);

  const [seletedTop, setSelectedTop] = useState(
    tops[0].name
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
        structs={tops}
        sizes={topSizes}
        selectedStruct={seletedTop}
        selectedSize={selectedTopSize}
        setSelectedStruct={setSelectedTop}
        setSelectedSize={setSelecteTopSize}
      />
    </div>
  );
}
