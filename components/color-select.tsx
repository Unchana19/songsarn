import { Color } from "@/interfaces/color.interface";
import { Button } from "@nextui-org/button";

interface Props {
  isPrimary: boolean;
  colors: Color[];
  selectedColor: Color | null;
  setSelectedColor(color: Color | null): void;
}

export default function ColorSelect({
  isPrimary,
  colors,
  selectedColor,
  setSelectedColor,
}: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-8 mb-5 p-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Button
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color.color }}
              className={
                selectedColor?.id === color.id
                  ? `border-primary border-3`
                  : `border-gray-400 border-3`
              }
              isIconOnly
              radius="full"
              size="lg"
            ></Button>
            <p
              className={`text-sm ${selectedColor?.id === color.id ? "text-primary" : ""}`}
            >
              {color.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
