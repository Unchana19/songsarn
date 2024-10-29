"use client";

import { User } from "@/interfaces/user.interface";
import { useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { Input, Textarea } from "@nextui-org/input";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import PopupModal from "@/components/popup-modal";
import { MdLocationOn, MdSearch } from "react-icons/md";

const defaultCenter = {
  lat: 13.7563,
  lng: 100.5018,
};

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export default function AddressPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
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

  // Autocomplete Options
  const autocompleteOptions = useMemo(
    () => ({
      componentRestrictions: { country: "th" }, // จำกัดการค้นหาในประเทศไทย
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    }),
    []
  );

  // Load user data
   const fetchUser = async () => {
     if (!session?.userId) return;

     try {
       setIsLoading(true);
       const response = await fetch(`/api/users/${session.userId}`);

       if (response.ok) {
         const userData = await response.json();
         setUser(userData);

         if (userData.lat && userData.lng) {
           const location = {
             lat: userData.lat,
             lng: userData.lng,
             address: userData.address,
           };
           setSelectedLocation(location);
           setCurrentAddress(userData.address || "");

           // Update map if it exists
           if (map) {
             map.panTo({ lat: userData.lat, lng: userData.lng });
             map.setZoom(15);
           }
         }
       }
     } catch (error) {
       console.error("Failed to fetch user:", error);
       setMessage("Failed to load user data");
       onOpen();
     } finally {
       setIsLoading(false);
     }
   };

 useEffect(() => {
   if (session?.userId) {
     fetchUser();
   }
 }, [session?.userId]);

 const handleMapLoad = (mapInstance: google.maps.Map) => {
   setMap(mapInstance);

   if (selectedLocation) {
     mapInstance.panTo({
       lat: selectedLocation.lat,
       lng: selectedLocation.lng,
     });
     mapInstance.setZoom(15);
   }
 };

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
    if (place.geometry && place.geometry.location) {
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
    if (!selectedLocation || !session?.accessToken) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/users/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          id: user?.id,
          address: currentAddress,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        }),
      });

      if (response.ok) {
        setMessage("Address updated successfully");
        onOpen();
        fetchUser();
        setMapKey((prev) => prev + 1);
      } else {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setMessage("Failed to update address");
      onOpen();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card shadow="sm" className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col gap-1 px-8 pt-8">
          <h1 className="text-2xl font-bold">Address Settings</h1>
          <p className="text-default-500">Set your delivery location</p>
        </CardHeader>

        <CardBody className="px-8 py-6">
          <div className="space-y-6">
            {/* Current Address Display */}
            <div className="bg-default-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-primary text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Current Address</h3>
                  <p className="text-default-500 mt-1">
                    {user?.address || "No address set"}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Search Box */}
            {isLoaded && (
              <Autocomplete
                onLoad={setSearchBox}
                onPlaceChanged={onPlaceSelected}
                options={autocompleteOptions}
              >
                <Input
                  type="text"
                  label="Search location"
                  placeholder="Enter a location"
                  variant="bordered"
                  startContent={<MdSearch className="text-default-400" />}
                  classNames={{
                    label: "text-sm font-medium text-default-700",
                    input: "text-medium",
                  }}
                />
              </Autocomplete>
            )}

            {/* Map Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Location</h3>
              <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-default-200">
                {!isLoaded ? (
                  <div className="w-full h-full flex items-center justify-center bg-default-50">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <GoogleMap
                    key={mapKey}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={selectedLocation || defaultCenter}
                    zoom={13}
                    onClick={handleMapClick}
                    options={mapOptions}
                    onLoad={(map) => setMap(map)}
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

              {/* Address Input */}
              <Textarea
                label="Full Address"
                placeholder="Select location on map or search above"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                variant="bordered"
                className="w-full"
                minRows={3}
                isReadOnly
              />

              {/* Save Button */}
              <Button
                color="primary"
                size="lg"
                className="w-full font-medium"
                isDisabled={!selectedLocation || !currentAddress}
                isLoading={isSaving}
                onPress={handleSave}
              >
                Save Address
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <PopupModal message={message} isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}
