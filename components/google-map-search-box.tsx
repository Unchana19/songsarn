import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

interface SearchBoxProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onPlaceSelect }) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setFields(["formatted_address", "geometry", "name"]);
  };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    onPlaceSelect(place);
  };

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium text-default-700 mb-2 block">
        Search location
      </label>
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
        options={{
          componentRestrictions: { country: "th" },
          fields: ["formatted_address", "geometry", "name"],
          types: ["geocode", "establishment"],
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="w-full h-unit-20 py-1.5 px-3 rounded-medium border-2 border-default-200 
                     bg-transparent
                     focus:border-primary focus:outline-none transition-colors"
          placeholder="Search for an address"
        />
      </Autocomplete>
    </div>
  );
};
