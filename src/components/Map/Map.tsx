import { Flex, Input } from "@mantine/core";
import React, { useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const Map: React.FC<{
  onDrag: (lat: number, lng: number) => void;
  onStreetAddressChange: (streetAddress: string) => void;
}> = ({ onDrag, onStreetAddressChange }) => {
  useEffect(() => {
    window.initMap = initMap;
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-uJD60yVMePHQ_4c_pmh6De9giTBr9rE&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const initMap = () => {
    let autocompleteInput = document.getElementById(
      "autocomplete-input"
    ) as HTMLInputElement;
    let autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput
    );

    autocomplete.addListener(
      "place_changed",
      debounce(function () {
        const place = autocomplete.getPlace();
        marker.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        map.setZoom(14);
        const latLng = marker.getPosition();
        onDrag(latLng.lat(), latLng.lng());

        autocompleteInput.value = place.name;
      }, 500)
    );

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 16.07, lng: 108.15 },
      zoom: 13,
    });

    const marker = new window.google.maps.Marker({
      map: map,
      draggable: true,
    });

    marker.addListener("dragend", function () {
      const latLng = marker.getPosition();
      onDrag(latLng.lat(), latLng.lng());
      localStorage.setItem("defaultLat", latLng.lat().toString());
      localStorage.setItem("defaultLng", latLng.lng().toString());
    });
  };

  return (
    <Flex direction="column" p={10}>
      <Input
        name="streetAddress"
        pb={20}
        required
        type="text"
        id="autocomplete-input"
        placeholder="Địa chỉ cụ thể"
        onChange={(event) => {
          const address = event.target.value;
          if (onStreetAddressChange) {
            onStreetAddressChange(address);
          }
        }}
      />
      <div id="map"></div>
    </Flex>
  );
};

export default Map;
