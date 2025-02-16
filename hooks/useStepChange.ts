import { useState } from "react";

export const useStepChange = (initialStep: number) => {
  const [activeStep, setActiveStepState] = useState(initialStep);

  const setActiveStep = (step: number) => {
    setActiveStepState(step);
    window.scrollTo({ top: 0 });
  };

  return [activeStep, setActiveStep] as const;
};
