import { primaryColors } from "@/constants/primaryColors";
import { Button } from "@nextui-org/button";

interface Props {
  selectedColor: { color: string; label: string };
  setSelectedColor(color: { color: string; label: string }): void;
}

export default function PrimaryColorSelect({
  selectedColor,
  setSelectedColor,
}: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-8 mb-5 p-2">
        {primaryColors.map((color, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Button
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color.color }}
              className={
                selectedColor === color
                  ? `border-primary border-3`
                  : `border-gray-400 border-3`
              }
              isIconOnly
              radius="full"
              size="lg"
            ></Button>
            <p
              className={`text-sm ${selectedColor == color ? "text-primary" : ""}`}
            >
              {color.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
