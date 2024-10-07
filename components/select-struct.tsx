import { Product } from "@/types";
import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";
import SelectButtonComponent from "./select-button";

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
        <div className="flex overflow-x-auto gap-8 mb-5 p-2">
          {primaryColor.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Button
                onClick={() => setSelectedPrimaryColor(color)}
                style={{ backgroundColor: color.color }}
                className={
                  selectedPrimaryColor == color
                    ? `border-primary border-3`
                    : `border-gray-400 border-3`
                }
                isIconOnly
                radius="full"
                size="lg"
              ></Button>
              <p
                className={`text-sm ${selectedPrimaryColor == color ? "text-primary" : ""}`}
              >
                {color.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg">เลือกสีลาย</p>
        <div className="flex overflow-x-auto gap-8 mb-5 p-2">
          {secondaryColor.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className="relative">
                <Button
                  onClick={() => setSelectedSecondaryColor(color)}
                  style={{
                    backgroundColor:
                      color.color === "transparent"
                        ? "transparent"
                        : color.color,
                  }}
                  className={
                    selectedSecondaryColor == color
                      ? `border-primary border-3`
                      : `border-gray-400 border-3`
                  }
                  isIconOnly
                  radius="full"
                  size="lg"
                ></Button>

                {color.label === "ไม่มีสี" && (
                  <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center justify-center">
                    <div
                      style={{
                        borderTop: "2px solid gray",
                        width: "100%",
                        transform: "rotate(-45deg)",
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <p
                className={`text-sm ${selectedSecondaryColor == color ? "text-primary" : ""}`}
              >
                {color.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
