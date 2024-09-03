import { Product } from "@/types";
import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";
import SelectButtonComponent from "./select-button";

interface Props {
  typeStruct: string;
  structs: Product[];
  sizes: string[];
  selectedStruct: string;
  selectedSize: string;
  setSelectedStruct(name: string): void;
  setSelectedSize(name: string): void;
}

export default function SelectStructComponent({
  typeStruct,
  structs,
  sizes,
  selectedStruct,
  selectedSize,
  setSelectedStruct,
  setSelectedSize,
}: Props) {
  return (
    <div className="flex flex-col my-10">
      <div className="flex items-center justify-between my-2">
        <p className="font-bold text-lg">{typeStruct}</p>
      </div>
      <div className="flex justify-around overflow-x-auto gap-4 mb-10">
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
        <p className="font-bold text-lg">Choose size</p>
        <div className="flex justify-around overflow-x-auto gap-4 mb-5 p-2">
          {sizes.map((size) => {
            let isSelectedBaseSize = selectedSize === size;
            return (
              <Button
                disableRipple
                className="min-w-40"
                color={isSelectedBaseSize ? "primary" : "default"}
                variant={isSelectedBaseSize ? "solid" : "bordered"}
                size="lg"
                onClick={() => setSelectedSize(size)}
              >
                <p>{size}</p>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
