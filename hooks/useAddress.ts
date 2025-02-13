import type { Location } from "@/interfaces/location.interface";
import { useFetchUserQuery, useUpdateUserAddressMutation } from "@/store";
import { useDisclosure } from "@heroui/modal";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useMemo } from "react";

interface Props {
  userId: string;
  accessToken: string;
}

export function useAddress({ userId, accessToken }: Props) {
  const { currentData: user, isLoading, isSuccess } = useFetchUserQuery(userId);

  const [updateUserAddress, results] = useUpdateUserAddressMutation();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [searchBox, setSearchBox] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Google Maps Options
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    []
  );

  const autocompleteOptions = useMemo(
    () => ({
      componentRestrictions: { country: "th" },
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    }),
    []
  );

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        return response.results[0].formatted_address;
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
      const address = await getAddressFromLatLng(lat, lng);
      if (address) {
        setSelectedLocation({
          lat,
          lng,
          address,
        });
        setCurrentAddress(address);
      }
    } catch (error) {
      console.error("Error handling map click:", error);
      setMessage("Failed to get address from location");
      onOpen();
    }
  };

  // Handle place selection from autocomplete
  const onPlaceSelected = async () => {
    if (!searchBox) return;

    const place = searchBox.getPlace();
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name;

      setSelectedLocation({
        lat,
        lng,
        address,
      });
      setCurrentAddress(address || "");

      // Pan map to selected location
      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(17);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedLocation) return;

    try {
      const data = {
        id: userId,
        address: currentAddress,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };

      await updateUserAddress({ data, accessToken }).then(() => {
        setMessage("Address updated successfully");
        onOpen();
        setMapKey((prev) => prev + 1);
      });
    } catch (error) {
      setMessage("Failed to update address");
      onOpen();
    }
  };

  return {
    user,
    isLoading,
    isSuccess,
    selectedLocation,
    currentAddress,
    map,
    mapKey,
    message,
    isOpen,
    onOpenChange,
    isLoaded,
    mapOptions,
    autocompleteOptions,
    setSearchBox,
    setMap,
    handleMapClick,
    onPlaceSelected,
    handleSave,
    setSelectedLocation,
    setCurrentAddress,
    results,
  };
}
