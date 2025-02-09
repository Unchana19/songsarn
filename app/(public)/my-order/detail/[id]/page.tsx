"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { FaArrowLeftLong } from "react-icons/fa6";
import { getStatusCpo } from "@/utils/get-status-cpo";
import PaymentModal from "@/components/payment-modal";
import { Image } from "@heroui/image";
import ImagePlaceholder from "@/components/image-placeholder";
import { useFetchCPOByIdQuery, useTestPaymentsMutation } from "@/store";

export default function OrderDetailPage() {
  const session = useSession();
  const router = useRouter();
  const params = useParams();
  const cpoId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: cpo,
    error,
    isLoading,
  } = useFetchCPOByIdQuery({
    id: cpoId,
    accessToken: session.data?.accessToken,
  });

  const [testPayment, results] = useTestPaymentsMutation();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleTestPayment = async () => {
    try {
      const data = {
        cpoId: cpo?.cpo.id,
        amount: cpo?.cpo.total_price,
      };
      await testPayment({ data, accessToken: session.data?.accessToken });
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      router.push("/my-order");
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
        <p className="text-danger">Error</p>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-xl">Order detail</h1>
        </div>
        <div className="flex items-center gap-4" />
        <Button
          color="primary"
          radius="full"
          variant="bordered"
          onPress={() => router.push("/my-order")}
          className="px-8"
        >
          <FaArrowLeftLong />
          <h1 className="">Back</h1>
        </Button>
      </div>

      {/* Order Information */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          <div className="bg-default-50 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Purchase order ID</span>
              <span className="font-mono">{formatId("CPO", cpo.cpo.id)}</span>
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
              <div className="pt-4 space-y-4">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full text-white text-lg"
                  onPress={() => setIsPaymentModalOpen(true)}
                >
                  Pay now
                </Button>
                <Button
                  color="danger"
                  size="lg"
                  className="w-full text-white text-lg"
                  onPress={handleTestPayment}
                  isLoading={results.isLoading}
                >
                  Test payment
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
              {cpo.order_lines.map((product: CPOGetOne) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 bg-white rounded-lg"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <ImagePlaceholder
                      name={product.name}
                      classNames={"w-20 h-20"}
                    />
                  )}
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
