import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { Component } from "@/interfaces/component.interface";
import { Color } from "@/interfaces/color.interface";
import ColorSelect from "./color-select";
import { Category } from "@/interfaces/category.interface";
import { Image } from "@heroui/image";
import { formatNumberWithComma } from "@/utils/num-with-comma";

interface Props {
  category: Category;
  colors: Color[];
  components: Component[];
  selectedComponent: string;
  handleSelectionChange: (value: string) => void;
  selectedPrimaryColor: Color | null;
  setSelectedPrimaryColor: (color: Color | null) => void;
  selectedPatternColor: Color | null;
  setSelectedPatternColor: (color: Color | null) => void;
}

const ComponentPlaceholder = () => (
  <div className="w-16 h-16 rounded-lg bg-default-100 flex items-center justify-center">
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-default-400"
    >
      <path
        d="M3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 15L16 10L5 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ComponentSelectItem = ({ component }: { component: Component }) => {
  return (
    <div className="flex items-center gap-3 py-2">
      {component.img ? (
        <Image
          src={component.img}
          alt={component.name}
          className="w-16 h-16 rounded-lg object-cover border-1 border-default-200"
          radius="lg"
          classNames={{
            wrapper: "min-w-[64px]",
          }}
        />
      ) : (
        <ComponentPlaceholder />
      )}
      <div className="flex flex-col gap-1">
        <span className="text-medium font-semibold">{component.name}</span>
        <span className="text-small font-medium">
          {formatNumberWithComma(component.price)}
        </span>
      </div>
    </div>
  );
};

export default function ComponentSelect({
  category,
  colors,
  components,
  selectedComponent,
  handleSelectionChange,
  selectedPrimaryColor,
  setSelectedPrimaryColor,
  selectedPatternColor,
  setSelectedPatternColor,
}: Props) {
  const selectedComponentObj = components.find(
    (c) => c.id === selectedComponent
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <div>
        <p className="text-primary">{category.name}</p>
      </div>
      <Select
        size="lg"
        radius="full"
        variant="bordered"
        color="primary"
        selectedKeys={
          selectedComponent ? new Set([selectedComponent]) : new Set()
        }
        onChange={(e) => handleSelectionChange(e.target.value)}
        classNames={{
          trigger: "h-[86px] bg-white py-2 transition-colors shadow-small",
          value: "pl-1",
          popoverContent: "min-w-[300px] p-1 m-1 border-1 border-default-200",
          listboxWrapper: "p-1",
          base: "min-h-[86px]",
          innerWrapper: "h-full",
          mainWrapper: "h-full",
          listbox: "p-1",
          selectorIcon: "text-default-400",
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-3 px-1">
              {selectedComponentObj?.img ? (
                <Image
                  src={selectedComponentObj.img}
                  alt={selectedComponentObj.name}
                  className="w-16 h-16 rounded-lg object-cover border-1 border-default-200"
                  radius="lg"
                  classNames={{
                    wrapper: "min-w-[64px]",
                  }}
                />
              ) : (
                <ComponentPlaceholder />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-medium font-semibold">
                  {item.textValue}
                </span>
                {selectedComponentObj && (
                  <span className="text-small font-medium">
                    {formatNumberWithComma(selectedComponentObj.price)}
                  </span>
                )}
              </div>
            </div>
          ));
        }}
      >
        {components.map((component) => (
          <SelectItem
            key={component.id}
            value={component.id}
            textValue={component.name}
            className="data-[selected=true]:bg-primary-50 py-2 px-4 first:mt-1 last:mb-1"
          >
            <ComponentSelectItem component={component} />
          </SelectItem>
        ))}
      </Select>

      <div className="mt-3">
        <p className="font-medium mb-2">เลือกสีหลัก</p>
        <ColorSelect
          isPrimary
          colors={colors}
          selectedColor={selectedPrimaryColor}
          setSelectedColor={setSelectedPrimaryColor}
        />
      </div>

      <div>
        <p className="font-medium mb-2">เลือกสีลาย</p>
        <ColorSelect
          isPrimary={false}
          colors={colors}
          selectedColor={selectedPatternColor}
          setSelectedColor={setSelectedPatternColor}
        />
      </div>
    </div>
  );
}
