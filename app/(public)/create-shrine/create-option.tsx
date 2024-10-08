import SelectStructComponent from "@/components/select-struct";
import {
  baseStructs,
  bodyShrine,
  colorPrimary,
  colorSecondary,
} from "@/data/product-create-struct";
import { useState } from "react";

export default function CreateOptionPage() {
  const [selectedBase, setSelectedBase] = useState(baseStructs[0].name);
  const [selectedBasePrimaryColor, setSelectedBasePrimaryColor] = useState(
    colorPrimary[0]
  );
  const [selectedBaseSecondaryColor, setSelectedBaseSecondaryColor] = useState(
    colorSecondary[0]
  );

  const [seletedBodyShrine, setSelectedBodyShrine] = useState(
    bodyShrine[0].name
  );
  const [selectedBodyShrinePrimaryColor, setSelectedBodyShrinePrimaryColor] =
    useState(colorPrimary[0]);
  const [
    selectedBodyShrineSecondaryColor,
    setSelectedBodyShrineSecondaryColor,
  ] = useState(colorSecondary[0]);

  return (
    <div>
      <SelectStructComponent
        typeStruct="ฐานล่าง"
        structs={baseStructs}
        primaryColor={colorPrimary}
        secondaryColor={colorSecondary}
        selectedStruct={selectedBase}
        selectedPrimaryColor={selectedBasePrimaryColor}
        selectedSecondaryColor={selectedBaseSecondaryColor}
        setSelectedStruct={setSelectedBase}
        setSelectedPrimaryColor={setSelectedBasePrimaryColor}
        setSelectedSecondaryColor={setSelectedBaseSecondaryColor}
      />

      <SelectStructComponent
        typeStruct="ถาดจาน"
        structs={bodyShrine}
        primaryColor={colorPrimary}
        secondaryColor={colorSecondary}
        selectedStruct={seletedBodyShrine}
        selectedPrimaryColor={selectedBodyShrinePrimaryColor}
        selectedSecondaryColor={selectedBodyShrineSecondaryColor}
        setSelectedStruct={setSelectedBodyShrine}
        setSelectedPrimaryColor={setSelectedBodyShrinePrimaryColor}
        setSelectedSecondaryColor={setSelectedBodyShrineSecondaryColor}
      />
    </div>
  );
}
