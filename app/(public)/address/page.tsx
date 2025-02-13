"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Input, Textarea } from "@heroui/input";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import PopupModal from "@/components/popup-modal";
import { MdLocationOn, MdSearch } from "react-icons/md";
import { centerMap } from "@/constants/center-map";
import { useAddress } from "@/hooks/useAddress";

export default function AddressPage() {
  const { data: session } = useSession();

  const {
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
  } = useAddress({
    userId: session?.userId || "",
    accessToken: session?.accessToken || "",
  });

  useEffect(() => {
    if (isSuccess) {
      if (user.lat && user.lng) {
        const location = {
          lat: user.lat,
          lng: user.lng,
          address: user.address,
        };
        setSelectedLocation(location);
        setCurrentAddress(user.address || "");

        if (map) {
          map.panTo({ lat: user.lat, lng: user.lng });
          map.setZoom(15);
        }
      }
    }
  }, [user, isSuccess, map, setSelectedLocation, setCurrentAddress]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

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
                    center={selectedLocation || centerMap}
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
                isLoading={results.isLoading}
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
