import SelectStructComponent from "@/components/select-struct";
import { baseStructs, baseSizes, plateStand, plateStandSizes } from "@/data/product-create-struct";
import { useState } from "react";

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
