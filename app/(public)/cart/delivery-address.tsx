"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { FiTruck } from "react-icons/fi";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { calTotal } from "@/utils/cal-total";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import type { OrderLine } from "@/interfaces/order-line.interface";
import type { Dispatch, SetStateAction } from "react";
import { Skeleton } from "@heroui/skeleton";
import CartCard from "@/components/cart-card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Spinner } from "@heroui/spinner";
import type { FormData } from "./page";
import { SearchBox } from "@/components/google-map-search-box";
import { centerMap } from "@/constants/center-map";
import { useDelivery } from "@/hooks/useDelivery";
import { useCarts } from "@/hooks/useCarts";

interface Props {
  userId: string;
  accessToken: string;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  prevPage(page: number): void;
  nextPage(page: number): void;
}

export default function DeliveryAddressPage({
  userId,
  accessToken,
  formData,
  setFormData,
  prevPage,
  nextPage,
}: Props) {
  const {
    isLoading,
    onOpen,
    hasAddress,
    continueToPayment,
    isSubmitting,
    backToCart,
    modalKey,
    isOpen,
    handleModalChange,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isLoaded,
    handlePlaceSelect,
    selectedLocation,
    handleMapClick,
    setMap,
    isValid,
  } = useDelivery({
    userId,
    formData,
    setFormData,
    prevPage,
    nextPage,
  });

  const { orderLines, isSuccess } = useCarts({ userId, accessToken });

  const LoadingSkeleton = () => (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-10 mb-20">
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
          color="primary"
          variant="light"
          isDisabled
        >
          <div className="flex flex-col items-center">
            <FiTruck size={25} />
            <p>Delivery</p>
          </div>
        </Button>
        <div className="bg-gray-600 h-1 w-1/5 rounded-full" />
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
          variant="light"
          isDisabled
        >
          <div className="flex flex-col items-center">
            <MdOutlinePayment size={25} />
            <p>Payment</p>
          </div>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-around">
        <div className="flex flex-col md:w-5/12 items-center gap-5">
          <div className="flex w-full justify-between">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-xl">Delivery address</h3>
                  <p>{formData.name || ""}</p>
                  <p className="my-2">{formData.address}</p>
                  <p>{formData.phone_number || ""}</p>
                </div>
                <Button color="primary" radius="full" onPress={onOpen}>
                  <p className="text-white">
                    {hasAddress ? "Edit" : "Add address"}
                  </p>
                </Button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-5 w-full">
            <Button
              color="primary"
              radius="full"
              size="lg"
              endContent={<IoIosArrowRoundForward size={25} color="white" />}
              onPress={continueToPayment}
              isDisabled={isLoading || !hasAddress}
              isLoading={isSubmitting}
            >
              <p className="text-white">Continue to payment</p>
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="bordered"
              size="lg"
              startContent={<IoIosArrowRoundBack size={25} />}
              onPress={() => backToCart()}
            >
              <p>Back to cart</p>
            </Button>
          </div>
        </div>

        <div>
          <Divider orientation="vertical" />
        </div>

        <div className="flex flex-col md:w-5/12 mt-20 md:mt-0">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Total price</h3>
              <p
                className={`${formData.delivery_price > 0 ? "text-primary" : "text-black"}`}
              >
                {formData.delivery_price > 0
                  ? "Include delivery price"
                  : "Not include delivery price"}
              </p>
            </div>
            <h3 className="font-bold text-xl">
              {formatNumberWithComma(
                calTotal(orderLines) + formData.delivery_price
              )}
            </h3>
          </div>
          {formData.delivery_price > 0 && (
            <div>
              <Divider className="my-4" />
              <div className="flex justify-between">
                <h3>Delivery price</h3>
                <p>{formatNumberWithComma(formData.delivery_price)}</p>
              </div>
            </div>
          )}
          <Divider className="my-4" />
          <p className="font-bold text-lg">Products</p>
          <div className="flex flex-col items-center">
            {isSuccess &&
              orderLines.map((orderLine: OrderLine) => {
                return (
                  <div key={orderLine.id} className="my-5 w-full">
                    <CartCard orderLine={orderLine} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Modal
        key={modalKey}
        isOpen={isOpen}
        onOpenChange={handleModalChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
      >
        <ModalContent>
          {() => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                {hasAddress ? "Edit address" : "Add address"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-8">
                  <Input
                    type="phone"
                    label="Phone number"
                    placeholder="Phone number"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("phone_number")}
                    isInvalid={!!errors.phone_number}
                    errorMessage={errors.phone_number?.message as string}
                  />

                  {isLoaded && (
                    <div className="w-full">
                      <SearchBox onPlaceSelect={handlePlaceSelect} />
                    </div>
                  )}

                  <div className="w-full h-[400px] rounded-lg overflow-hidden">
                    {!isLoaded ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={selectedLocation || centerMap}
                        zoom={13}
                        onClick={handleMapClick}
                        onLoad={setMap}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                          zoomControl: true,
                        }}
                      >
                        {selectedLocation && (
                          <Marker
                            position={{
                              lat: selectedLocation.lat,
                              lng: selectedLocation.lng,
                            }}
                          />
                        )}
                      </GoogleMap>
                    )}
                  </div>

                  <Textarea
                    type="text"
                    label="Address"
                    placeholder="Enter address"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("address")}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message as string}
                    isDisabled
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="lg"
                  color="primary"
                  type="submit"
                  radius="full"
                  fullWidth
                  isDisabled={!isValid || !selectedLocation}
                  isLoading={isSubmitting}
                >
                  <p className="text-white">
                    {hasAddress ? "Save changes" : "Add address"}
                  </p>
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
