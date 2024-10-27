"use client";

import { useEffect, useState } from "react";
import CartSummaryPage from "./cart-summary";
import DeliveryAddressPage from "./delivery-address";
import PaymentPage from "./payment";
import { useSession } from "next-auth/react";
import { OrderLine } from "@/interfaces/order-line.interface";

export default function CartPage() {
  const session = useSession();
  const [activeStep, setActiveStep] = useState(1);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderLines = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/carts?id=${session.data?.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setOrderLines(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderLines();
  }, [session]);

  const increaseQuantityOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/carts/increase-quantity/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setOrderLines(
          orderLines.map((orderLine) =>
            orderLine.id === id
              ? { ...orderLine, quantity: orderLine.quantity + 1 }
              : orderLine
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantityOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/carts/decrease-quantity/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        if (result.removed) {
          setOrderLines(orderLines.filter((orderLine) => orderLine.id !== id));
        } else {
          setOrderLines(
            orderLines.map((orderLine) =>
              orderLine.id === id
                ? { ...orderLine, quantity: orderLine.quantity - 1 }
                : orderLine
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/carts/delete-order/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setOrderLines(orderLines.filter((orderLine) => orderLine.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            orderLines={orderLines}
            increateQuantityOrder={increaseQuantityOrder}
            decreateQuantityOrder={decreaseQuantityOrder}
            deleteOrder={deleteOrder}
            isLoading={isLoading}
            nextPage={nextPage}
          />
        );
      case 1:
        return (
          <DeliveryAddressPage
            orderLines={orderLines}
            userId={session.data?.userId || ""}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        );
      case 2:
        return <PaymentPage orderLines={orderLines} prevPage={prevPage} />;
      default:
        return "unknow step";
    }
  };

  return <div className="">{getStepContent(activeStep)}</div>;
}
