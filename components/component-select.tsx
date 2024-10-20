import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Component } from "@/interfaces/component.interface";
import { Color } from "@/interfaces/color.interface";
import ColorSelect from "./color-select";

interface Props {
  colors: Color[];
  components: Component[];
  selectedComponent: string;
  handleSelectionChange: (value: string) => void;
  selectedPrimaryColor: Color | null;
  setSelectedPrimaryColor: (color: Color | null) => void;
  selectedPatternColor: Color | null;
  setSelectedPatternColor: (color: Color | null) => void;
  onAddComponent: (
    component: string,
    primaryColor: Color | null,
    patternColor: Color | null
  ) => void;
}

export default function ComponentSelect({
  colors,
  components,
  selectedComponent,
  handleSelectionChange,
  selectedPrimaryColor,
  setSelectedPrimaryColor,
  selectedPatternColor,
  setSelectedPatternColor,
  onAddComponent,
}: Props) {
  const handleAddClick = () => {
    if (selectedComponent && selectedPrimaryColor) {
      onAddComponent(
        selectedComponent,
        selectedPrimaryColor,
        selectedPatternColor
      );
      handleSelectionChange("");
      setSelectedPrimaryColor(null);
      setSelectedPatternColor(null);
    }
  };

  const isAddButtonDisabled =
    !selectedComponent || !selectedPrimaryColor || !selectedPatternColor;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div>
        <p className="text-lg font-bold">Components</p>
      </div>
      <Select
        size="lg"
        radius="full"
        label="Select Component"
        labelPlacement="outside"
        variant="bordered"
        color="primary"
        selectedKeys={selectedComponent ? [selectedComponent] : []}
        onChange={(e) => handleSelectionChange(e.target.value)}
      >
        {components.map((component) => (
          <SelectItem key={component.id} value={component.id}>
            {component.name}
          </SelectItem>
        ))}
      </Select>

      <div className="mt-3">
        <p>เลือกสีหลัก</p>
        <ColorSelect
          isPrimary
          colors={colors}
          selectedColor={selectedPrimaryColor}
          setSelectedColor={setSelectedPrimaryColor}
        />
      </div>

      <div>
        <p>เลือกสีลาย</p>
        <ColorSelect
          isPrimary={false}
          colors={colors}
          selectedColor={selectedPatternColor}
          setSelectedColor={setSelectedPatternColor}
        />
      </div>

      <Button
        size="lg"
        radius="full"
        color="primary"
        className="text-white"
        onPress={handleAddClick}
        isDisabled={isAddButtonDisabled}
      >
        Add Component
      </Button>
    </div>
  );
}
