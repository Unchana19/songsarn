import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { MdOutlineLocationOn } from "react-icons/md";
import { FaRegMap } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

export default function DeliveryPricePage() {
  return (
    <div className="flex relative justify-center mb-40 mt-10 w-full">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-3xl font-bold">Checking delivery price</h2>
        <p className="text-xl mb-10 text-center">
          Please pin your location to check delivery price
        </p>
        <Input
          variant="bordered"
          color="primary"
          radius="full"
          placeholder="Search your location"
          size="lg"
          startContent={<MdOutlineLocationOn size={20} />}
        ></Input>
        <Button
          color="primary"
          radius="full"
          fullWidth
          disableRipple
          className="p-0"
          size="lg"
        >
          <Input
            isDisabled
            className="opacity-100"
            classNames={{
              input: ["text-white dark:text-white/90"],
            }}
            color="primary"
            radius="full"
            defaultValue="Choose from map"
            size="lg"
            startContent={<FaRegMap color="white" size={20} />}
            endContent={<IoIosArrowForward color="white" size={20} />}
          ></Input>
        </Button>
      </div>
    </div>
  );
}
