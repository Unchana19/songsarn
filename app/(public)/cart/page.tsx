"use client";

import { useState } from "react";
import CartSummaryPage from "./cart-summary";
import DeliveryAddressPage from "./delivery-address";
import PaymentPage from "./payment";
import { useSession } from "next-auth/react";

export interface FormData {
  name?: string;
  phone_number?: string;
  address?: string;
  delivery_price: number;
  lat?: number;
  lng?: number;
  payment_method?: string;
}

export default function CartPage() {
  const session = useSession();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    phone_number: "",
    address: "",
    delivery_price: 0,
    lat: undefined,
    lng: undefined,
    payment_method: "qr",
  });

  const nextPage = (page: number) => {
    if (page < 2) {
      setActiveStep(page + 1);
    }
  };

  const prevPage = (page: number) => {
    if (page > 0) {
      setActiveStep(page - 1);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CartSummaryPage
            nextPage={nextPage}
            userId={session.data?.userId || ""}
            accessToken={session.data?.accessToken || ""}
          />
        );
      case 1:
        return (
          <DeliveryAddressPage
            userId={session.data?.userId || ""}
            accessToken={session.data?.accessToken || ""}
            formData={formData}
            setFormData={setFormData}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        );
      case 2:
        return (
          <PaymentPage
            userId={session.data?.userId || ""}
            accessToken={session.data?.accessToken || ""}
            formData={formData}
            setFormData={setFormData}
            prevPage={prevPage}
          />
        );
      default:
        return "unknow step";
    }
  };

  return <div className="">{getStepContent(activeStep)}</div>;
}
