"use client";

import { ManagerCPOGetOne } from "@/interfaces/manager-cpo-get-one.interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { formatId } from "@/utils/format-id";
import { getStatusCpo } from "@/utils/get-status-cpo";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { FaArrowLeftLong } from "react-icons/fa6";
import ImagePlaceholder from "@/components/image-placeholder";
import { convertTimestampToDateTime } from "@/utils/convert-timestamp";
import { getDateLabelCPO } from "@/utils/get-date-label-cpo";
import { getPaymentMethod } from "@/utils/get-payment-method";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";

interface Props {
  params: { id: string };
}

export default function CustomerPurchaseOrderDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const session = useSession();
  const [cpo, setCPO] = useState<ManagerCPOGetOne | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCPO();
  }, [session]);

  const fetchCPO = async () => {
    try {
      setError(null);
      const token = session.data?.accessToken;
      const response = await fetch(
        `/api/customer-purchase-orders/manager/${id}`,
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
      console.error("Error fetching CPO:", error);
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-xl">Order detail</h1>
        </div>
        <div className="flex items-center gap-4"></div>
        <Button
          color="primary"
          radius="full"
          variant="bordered"
          onPress={() => router.back()}
          className="px-8"
        >
          <FaArrowLeftLong />
          <h1 className="">Back</h1>
        </Button>
      </div>

      {/* Main Content Grid */}
      {cpo && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-default-50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Purchase order ID</span>
                <span className="font-mono">{formatId("CPO", cpo.id)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status</span>
                <Chip variant="flat" color="primary">
                  {getStatusCpo(cpo.status)}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Customer</span>
                <span>{cpo.user_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {getDateLabelCPO(cpo.status)}
                </span>
                <span>
                  {convertTimestampToDateTime(cpo.last_updated || new Date())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Payment status</span>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    cpo.paid_date_time
                      ? "bg-success-100 text-success-600"
                      : "bg-warning-100 text-warning-600"
                  }`}
                >
                  {cpo.paid_date_time ? "Completed" : "Not paid"}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Payment method</span>
                <span>{getPaymentMethod(cpo.payment_method)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Delivery date</span>
                <span>{cpo.est_delivery_date}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-default-50 p-6 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-default-600">Address:</p>
                <p>{cpo.delivery_details.address}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-default-600">Phone:</p>
                <p>{cpo.delivery_details.phone}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Products Details */}
          <div className="space-y-6">
            <div className="bg-default-50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  {formatNumberWithComma(cpo.total_price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Delivery fee</span>
                <span>{formatNumberWithComma(cpo.delivery_price)}</span>
              </div>
            </div>
            {/* Order Lines */}
            <div className="bg-default-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">
                Products ({cpo.order_lines.length})
              </h3>
              <div className="space-y-4">
                {cpo.order_lines.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg space-y-4"
                  >
                    <div className="flex gap-4">
                      {item.img ? (
                        <Image
                          src={item.img}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <ImagePlaceholder
                          name={item.name.substring(0, 2).toUpperCase()}
                          classNames="w-16 h-16"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-default-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-primary font-medium">
                          {formatNumberWithComma(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Component Details */}
                    <div className="border-t pt-4">
                      {item.components.map((component, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex items-start gap-4 mb-2">
                            {component.img ? (
                              <img
                                src={component.img}
                                alt={component.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <ImagePlaceholder
                                name={component.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                                classNames="w-16 h-16"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium">{component.name}</h5>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                {/* Colors */}
                                <div>
                                  <p className="text-sm text-default-600 mb-2">
                                    Colors:
                                  </p>
                                  <div className="space-y-2">
                                    {component.primary_color && (
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full"
                                          style={{
                                            backgroundColor:
                                              component.primary_color.color,
                                          }}
                                        />
                                        <span className="text-sm">
                                          Primary:{" "}
                                          {component.primary_color.name}
                                        </span>
                                      </div>
                                    )}
                                    {component.pattern_color && (
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full"
                                          style={{
                                            backgroundColor:
                                              component.pattern_color.color,
                                          }}
                                        />
                                        <span className="text-sm">
                                          Pattern:{" "}
                                          {component.pattern_color.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Materials */}
                                <div>
                                  <p className="text-sm text-default-600 mb-2">
                                    Materials:
                                  </p>
                                  <div className="space-y-1">
                                    {component.materials.map(
                                      (material, idx) => (
                                        <p key={idx} className="text-sm">
                                          {material.name}: {material.quantity}{" "}
                                          {material.unit}
                                        </p>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index < item.components.length - 1 && (
                            <div className="border-t my-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
