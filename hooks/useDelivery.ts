"use client";

import { useDisclosure } from "@heroui/modal";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { setAddressPOSchema } from "@/lib/schemas/setAddressPOSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useJsApiLoader } from "@react-google-maps/api";
import type { Location } from "@/interfaces/location.interface";
import { useCalculateDeliveryPriceMutation, useFetchUserQuery } from "@/store";
import type { FormData } from "@/app/(public)/cart/page";

interface Props {
  userId: string;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  prevPage(page: number): void;
  nextPage(page: number): void;
}

export function useDelivery({
  userId,
  formData,
  setFormData,
  prevPage,
  nextPage,
}: Props) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: user, isLoading } = useFetchUserQuery(userId);

  const [calculateDeliveryPrice] = useCalculateDeliveryPriceMutation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
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

  const setDefaultUserData = useCallback(async () => {
    const initialData = {
      name: user.name,
      phone_number: user.phone_number || "",
      address: user.address || "",
      lat: user.lat || null,
      lng: user.lng || null,
      delivery_price: 0,
      payment_method: "qr",
    };
    setFormData(initialData);
    if (user.lat && user.lng && !isLoading) {
      const deliveryData = await calculateDeliveryPrice({
        destinationLat: user.lat,
        destinationLng: user.lng,
      }).unwrap();

      const submitData = {
        ...initialData,
        delivery_price: deliveryData.fee,
      };

      setFormData(submitData);

      setSelectedLocation({
        lat: user.lat,
        lng: user.lng,
        address: user.address,
      });
    }
    reset(initialData);
  }, [
    user.name,
    user.phone_number,
    user.address,
    user.lat,
    user.lng,
    isLoading,
    calculateDeliveryPrice,
    setFormData,
    reset,
  ]);

  useEffect(() => {
    setDefaultUserData();
  }, [setDefaultUserData]);

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
          ...prev,
          address: addressInfo.address,
          lat: prev?.lat ?? 0,
          lng: prev?.lng ?? 0,
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

  const onSubmit = async (data: setAddressPOSchema) => {
    try {
      if (!selectedLocation) return;

      const deliveryData = await calculateDeliveryPrice({
        destinationLat: data.lat,
        destinationLng: data.lng,
      }).unwrap();

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

  return {
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
  };
}
