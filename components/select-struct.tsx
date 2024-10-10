import { Product } from "@/types";
import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";
import SelectButtonComponent from "./select-button";
import PatternColorSelect from "./pattern-color-select";
import PrimaryColorSelect from "./primary-color-select";

interface Props {
  typeStruct: string;
  structs: Product[];
  primaryColor: { color: string; label: string }[];
  secondaryColor: { color: string; label: string }[];
  selectedStruct: string;
  selectedPrimaryColor: { color: string; label: string };
  selectedSecondaryColor: { color: string; label: string };
  setSelectedStruct(name: string): void;
  setSelectedPrimaryColor(color: { color: string; label: string }): void;
  setSelectedSecondaryColor(color: { color: string; label: string }): void;
}

export default function SelectStructComponent({
  typeStruct,
  structs,
  primaryColor,
  secondaryColor,
  selectedStruct,
  selectedPrimaryColor,
  selectedSecondaryColor,
  setSelectedStruct,
  setSelectedPrimaryColor,
  setSelectedSecondaryColor,
}: Props) {
  return (
    <div className="flex flex-col my-10">
      <div className="flex items-center justify-between my-2">
        <p className="font-bold text-lg">{typeStruct}</p>
      </div>
      <div className="flex md:justify-around overflow-x-auto gap-4 mb-10">
        {structs.map((struct) => (
          <div key={struct.name} onClick={() => setSelectedStruct(struct.name)}>
            <ProductCardSmallComponent
              image={struct.image}
              price={struct.price}
              name={struct.name}
              cardButton={
                <SelectButtonComponent
                  isSelected={selectedStruct === struct.name}
                />
              }
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg">เลือกสีหลัก</p>
        <PrimaryColorSelect
          selectedColor={selectedPrimaryColor}
          setSelectedColor={setSelectedPrimaryColor}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg">เลือกสีลาย</p>
        <PatternColorSelect
          selectedColor={selectedSecondaryColor}
          setSelectedColor={setSelectedPrimaryColor}
        />
      </div>
    </div>
  );
}
