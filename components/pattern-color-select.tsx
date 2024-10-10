import { patternColors } from "@/constants/patternColors";
import { Button } from "@nextui-org/button";

interface Props {
  selectedColor: { color: string; label: string };
  setSelectedColor(color: { color: string; label: string }): void;
}

export default function PatternColorSelect({
  selectedColor,
  setSelectedColor,
}: Props) {
  return (
    <div className="flex flex-wrap gap-8 mb-5 p-2">
      {patternColors.map((color, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-2"
        >
          <div className="relative">
            <Button
              onClick={() => setSelectedColor(color)}
              style={{
                backgroundColor:
                  color.color === "transparent" ? "transparent" : color.color,
              }}
              className={
                selectedColor === color
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
            className={`text-sm ${selectedColor == color ? "text-primary" : ""}`}
          >
            {color.label}
          </p>
        </div>
      ))}
    </div>
  );
}
