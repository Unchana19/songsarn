"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { FaArrowLeftLong } from "react-icons/fa6";
import { getStatusCpo } from "@/utils/get-status-cpo";
import PaymentModal from "@/components/payment-modal";

export default function OrderDetailPage() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const [cpo, setCPO] = useState<CPOGetOne | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchCpo();
    }
  }, [session.status]);

  const fetchCpo = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch(
        `/api/customer-purchase-orders/${params.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const result = await response.json();
      setCPO(result);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-danger">{error}</p>
        <Button color="primary" onPress={fetchCpo}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!cpo) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  const showPaymentButton =
    cpo.cpo.order_status === "NEW" && cpo.cpo.payment_method === "qr";

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
          className="text-default-600"
        >
          <FaArrowLeftLong />
        </Button>
        <h1 className="text-xl font-bold">Order detail</h1>
      </div>

      {/* Order Information */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          <div className="bg-default-50 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Purchase order ID</span>
              <span className="font-mono">{formatId("PO", cpo.cpo.id)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Payment status</span>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  cpo.cpo.payment_status === "Completed"
                    ? "bg-success-100 text-success-600"
                    : "bg-warning-100 text-warning-600"
                }`}
              >
                {cpo.cpo.payment_status}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order status</span>
              <span className="text-primary">
                {getStatusCpo(cpo.cpo.order_status)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Delivery date</span>
              <span>{cpo.cpo.delivery_date}</span>
            </div>
            {showPaymentButton && (
              <div className="pt-4">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full text-white text-lg"
                  onPress={() => setIsPaymentModalOpen(true)}
                >
                  Pay now
                </Button>
              </div>
            )}
          </div>

          <div className="bg-default-50 p-6 rounded-xl space-y-4">
            <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
            <div className="space-y-2">
              <p className="text-sm text-default-600">Address:</p>
              <p>{cpo.cpo.delivery_details.address}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-default-600">Phone:</p>
              <p>{cpo.cpo.delivery_details.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Products and Total */}
        <div className="space-y-6">
          <div className="bg-default-50 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">
                {formatNumberWithComma(cpo.cpo.total_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Delivery fee</span>
              <span>{formatNumberWithComma(cpo.cpo.delivery_price)}</span>
            </div>
          </div>

          <div className="bg-default-50 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">
              Products ({cpo.order_lines.length})
            </h3>
            <div className="space-y-4">
              {cpo.order_lines.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 bg-white rounded-lg"
                >
                  <img
                    src={product.image || "/api/placeholder/100/100"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-default-600">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-primary font-medium">
                      {formatNumberWithComma(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={cpo.cpo.id}
        amount={cpo.cpo.total_price}
      />
    </div>
  );
}
