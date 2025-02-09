"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import CreateStructPage from "./create-component";
import SelectCategoryPage from "./select-category";
import { useSession } from "next-auth/react";
import EmptyComponents from "@/components/empty-components";
import Link from "next/link";

export default function CustomizePage() {
  const session = useSession();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const step = ["เลือกประเภทศาล", "ออกแบบโครงสร้างศาล"];

  const nextPage = (page: number) => {
    if (page < 2) {
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
        return (
          <SelectCategoryPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 2:
        return <CreateStructPage selectedCategory={selectedCategory} />;
      default:
        return "unknow step";
    }
  };

    if (session.status === "unauthenticated") {
      return (
        <div className="flex items-center justify-center">
          <EmptyComponents
            title={"Please login to create own shrine"}
            subTitle={"Let's create own shrine"}
            button={
              <Button
                as={Link}
                href="/login"
                radius="full"
                color="primary"
                className="px-10"
              >
                Login
              </Button>
            }
          />
        </div>
      );
    }

  return (
    <div>
      <h2 className="font-bold text-xl">Customize your shrine</h2>
      <div className="mb-40 mt-10">
        <div>
          <div className="flex justify-between my-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Step {activeStep} of 2</h3>
              <p>{step[activeStep - 1]}</p>
            </div>
            <div className="flex gap-4">
              {activeStep > 1 && (
                <Button
                  color="primary"
                  variant="bordered"
                  radius="full"
                  onClick={() => prevPage(activeStep)}
                >
                  <FaArrowLeftLong />
                  <p>Back</p>
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  color="primary"
                  radius="full"
                  onClick={() => nextPage(activeStep)}
                  isDisabled={activeStep === 1 && selectedCategory === ""}
                >
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-black font-bold">Next</p>
                    <FaArrowRightLong color="black" />
                  </div>
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
