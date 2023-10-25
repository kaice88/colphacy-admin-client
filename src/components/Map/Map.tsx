import { Input } from "@mantine/core";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const Map: React.FC = () => {
  useEffect(() => {
    window.initMap = initMap;
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZzKSucg3yB9xvr-k1Ji8SBWBoNuIc4M4&libraries=places&callback=initMap";
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
      console.log("Marker was dragged to:", latLng.lat(), latLng.lng());
      localStorage.setItem("defaultLat", latLng.lat().toString());
      localStorage.setItem("defaultLng", latLng.lng().toString());
    });
  };

  return (
    <div>
      <Input type="text" id="autocomplete-input" placeholder="Địa chỉ cụ thể" />
      <div id="map"></div>
      {/* <a href="saved.html">Saved location</a> */}
      <Link to="/saved">Saved Location</Link>
    </div>
  );
};

export default Map;
