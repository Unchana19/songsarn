import { Button } from "@nextui-org/button";

interface Props {
  isSelected?: boolean;
}

export default function SelectButtonComponent({ isSelected }: Props) {
  return (
    <Button
      isDisabled
      fullWidth
      className="opacity-100"
      color={isSelected ? "primary" : "default"}
    >
      <p className="text-white text-lg">Select</p>
    </Button>
  );
}
