"use client";

import { useState } from "react";
import SelectTypePage from "./select-type";
import { Button } from "@nextui-org/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import CreateStructPage from "./create-struct";
import CreateOptionPage from "./create-option";

const step = [
  "เลือกประเภทศาล",
  "ออกแบบโครงสร้างศาล",
  "ออกแบบส่วนประกอบอื่นๆ เพิ่มเติม (Optional)",
];

export default function CustomizePage() {
  const [activeStep, setActiveStep] = useState(1);

  const nextPage = (page: number) => {
    if (page < 3) {
      setActiveStep(page + 1);
    }
  };

  const prevPage = (page: number) => {
    if (page > 1) {
      setActiveStep(page - 1);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <SelectTypePage />;
      case 2:
        return <CreateStructPage />;
      case 3:
        return <CreateOptionPage />;
      default:
        return "unknow step";
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Customize your shrine</h2>
      <div className="mb-40 mt-10">
        <div>
          <div className="flex justify-between my-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Step {activeStep} of 3</h3>
              <p>{step[activeStep - 1]}</p>
            </div>
            <div className="flex gap-4">
              {activeStep > 1 && (
                <Button
                  isIconOnly
                  color="primary"
                  className="rounded-full"
                  onClick={() => prevPage(activeStep)}
                >
                  <FaArrowLeftLong />
                </Button>
              )}
              {activeStep <= 3 && (
                <Button
                  color="primary"
                  variant={activeStep < 3 ? "bordered" : "solid"}
                  className="rounded-3xl"
                  onClick={() => nextPage(activeStep)}
                >
                  {activeStep < 3 ? (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-black font-bold">Next</p>
                      <FaArrowRightLong color="black" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-black font-bold">Done</p>
                      <FaArrowRightLong color="black" />
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
          {getStepContent(activeStep)}
        </div>
      </div>
    </div>
  );
}
