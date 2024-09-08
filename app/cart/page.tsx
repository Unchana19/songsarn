"use client";

import { useState } from "react";
import CartSummaryPage from "./cart-summary";
import DeliveryAddressPage from "./delivery-address";
import { productCustomize } from "@/data/product-customize";
import { productFinished } from "@/data/product-finished";
import { ProductFinished } from "../favorite/favorite-tab";
import PaymentPage from "./payment";

export default function CartPage() {
  const [activeStep, setActiveStep] = useState(0);

  const products = [
    ...productFinished,
    ...productCustomize,
  ] as ProductFinished[];

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
        return <CartSummaryPage products={products} nextPage={nextPage} />;
      case 1:
        return (
          <DeliveryAddressPage
            products={products}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        );
      case 2:
        return <PaymentPage products={products} prevPage={prevPage} />;
      default:
        return "unknow step";
    }
  };

  return <div className="mb-40">{getStepContent(activeStep)}</div>;
}
