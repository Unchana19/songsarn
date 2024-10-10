import { Select, SelectItem } from "@nextui-org/select";
import PatternColorSelect from "./pattern-color-select";
import PrimaryColorSelect from "./primary-color-select";
import { Component } from "@/interfaces/component.interface";
import { SetStateAction } from "react";
import { Category } from "@/interfaces/category.interface";

interface Props {
  category: Category;
  components: Component[];
  selectedCompoent: string;
  handleSelectionChange: (e: {
    target: {
      value: SetStateAction<string>;
    };
  }) => void;
  selectedPrimaryColor: { color: string; label: string };
  setSelectedPrimaryColor(color: { color: string; label: string }): void;
  selectedPatternColor: { color: string; label: string };
  setSelectedPatternColor(color: { color: string; label: string }): void;
}

export default function ComponentSelect({
  category,
  components,
  selectedCompoent,
  handleSelectionChange,
  selectedPrimaryColor,
  setSelectedPrimaryColor,
  selectedPatternColor,
  setSelectedPatternColor,
}: Props) {
  return (
    <div className="flex gap-2">
      <div className="flex w-1/6">
        <p>{category.name}</p>
      </div>
      <div className="flex flex-col gap-3 w-5/6">
        <Select
          isRequired
          variant="bordered"
          color="primary"
          selectedKeys={[selectedCompoent]}
          onChange={handleSelectionChange}
        >
          {components
            .filter((component) => component.category === category.id)
            .map((component) => (
              <SelectItem key={component.id}>{component.name}</SelectItem>
            ))}
        </Select>

        <p>เลือกสีหลัก</p>
        <PrimaryColorSelect
          selectedColor={selectedPrimaryColor}
          setSelectedColor={setSelectedPrimaryColor}
        />

        <p>เลือกสีลาย</p>
        <PatternColorSelect
          selectedColor={selectedPatternColor}
          setSelectedColor={setSelectedPatternColor}
        />
      </div>
    </div>
  );
}
