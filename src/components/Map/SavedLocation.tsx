import React, { useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const SavedLocation: React.FC = () => {
  useEffect(() => {
    window.initMap = initMap;
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZzKSucg3yB9xvr-k1Ji8SBWBoNuIc4M4&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    const defaultLat = parseFloat(localStorage.getItem("defaultLat") || "0");
    const defaultLng = parseFloat(localStorage.getItem("defaultLng") || "0");

    const defaultLocation = new window.google.maps.LatLng(
      defaultLat,
      defaultLng
    );

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 14,
    });

    const marker = new window.google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
    });
  };

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default SavedLocation;
