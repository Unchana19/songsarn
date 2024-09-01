"use client";

import { useState } from "react";
import SelectTypePage from "./select-type";

export default function CustomizePage() {
  const [activeStep, setActiveStep] = useState(0);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SelectTypePage />;
      default:
        return "unknow step";
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Customize your shrine</h2>
      <div className="mb-40">{getStepContent(activeStep)}</div>
    </div>
  );
}
