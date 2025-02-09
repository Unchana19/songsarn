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
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { OrderLine } from "@/interfaces/order-line.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";
import CartCard from "@/components/cart-card";
import { setAddressPOSchema } from "@/lib/schemas/setAddressPOSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Spinner } from "@heroui/spinner";
import { FormData } from "./page";
import { SearchBox } from "@/components/google-map-search-box";

const defaultCenter = {
  lat: 13.7563,
  lng: 100.5018,
};

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Props {
  orderLines: OrderLine[];
  userId: string;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  prevPage(page: number): void;
  nextPage(page: number): void;
}

export default function DeliveryAddressPage({
  orderLines,
  userId,
  formData,
  setFormData,
  prevPage,
  nextPage,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<setAddressPOSchema>({
    resolver: zodResolver(setAddressPOSchema),
    mode: "onTouched",
  });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      if (response.ok) {
        const initialData = {
          name: userData.name,
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          lat: userData.lat || null,
          lng: userData.lng || null,
          delivery_price: 0,
          payment_method: "qr",
        };
        setFormData(initialData);
        if (userData.lat && userData.lng) {
          const deliveryData = await calculateDeliveryPrice(
            userData.lat,
            userData.lng
          );

          const submitData = {
            ...initialData,
            delivery_price: deliveryData.fee,
          };

          setFormData(submitData);

          setSelectedLocation({
            lat: userData.lat,
            lng: userData.lng,
            address: userData.address,
          });
        }
        reset(initialData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleModalChange = (open: boolean) => {
    if (open) {
      reset(formData);
      if (formData.lat && formData.lng) {
        setSelectedLocation({
          lat: formData.lat,
          lng: formData.lng,
          address: formData.address,
        });
      }
      setModalKey((prev) => prev + 1);
    }
    onOpenChange();
  };

  useEffect(() => {
    if (isOpen) {
      reset(formData);
      if (formData.lat && formData.lng) {
        setSelectedLocation({
          lat: formData.lat,
          lng: formData.lng,
          address: formData.address,
        });
      }
    }
  }, [isOpen, formData, reset]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    setSelectedLocation({
      lat,
      lng,
      address,
    });

    setValue("lat", lat, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("lng", lng, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("address", address || "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    const currentPhoneNumber = watch("phone_number");
    setFormData((prev) => ({
      ...prev,
      address: address || "",
      phone_number: currentPhoneNumber || prev.phone_number,
      lat,
      lng,
    }));

    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(17);
    }
  };

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        const result = response.results[0];
        const addressObj = {
          address: result.formatted_address,
        };

        setValue("address", addressObj.address, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        return addressObj;
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      setSelectedLocation({
        lat,
        lng,
      });

      setValue("lat", lat, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("lng", lng, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      const addressInfo = await getAddressFromLatLng(lat, lng);

      if (addressInfo) {
        setSelectedLocation((prev) => ({
          ...prev!,
          address: addressInfo.address,
        }));

        setValue("address", addressInfo.address, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        const currentPhoneNumber = watch("phone_number");

        setFormData((prev) => ({
          ...prev,
          address: addressInfo.address,
          phone_number: currentPhoneNumber || prev.phone_number,
          lat,
          lng,
        }));
      }
    } catch (error) {
      console.error("Error handling map click:", error);
    }
  };

  const calculateDeliveryPrice = async (lat: number, lng: number) => {
    const deliveryResponse = await fetch("/api/delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinationLat: lat,
        destinationLng: lng,
      }),
    });

    if (!deliveryResponse.ok) {
      throw new Error("Failed to calculate delivery fee");
    }

    return await deliveryResponse.json();
  };

  const onSubmit = async (data: setAddressPOSchema) => {
    try {
      if (!selectedLocation) return;

      const deliveryData = await calculateDeliveryPrice(data.lat, data.lng);

      const submitData = {
        ...formData,
        ...data,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        delivery_price: deliveryData.fee,
      };

      setFormData(submitData);
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const hasAddress = Boolean(
    formData.address && formData.phone_number && formData.lat && formData.lng
  );

  const backToCart = () => {
    prevPage(1);
  };

  const continueToPayment = async () => {
    nextPage(1);
  };

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
        <div className="bg-gray-600 h-1 w-1/5 rounded-full"></div>
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
              onClick={continueToPayment}
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
              onClick={() => backToCart()}
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
            {orderLines.map((orderLine, index) => {
              return (
                <div key={index} className="my-5 w-full">
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
                        center={selectedLocation || defaultCenter}
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
