import {Flex, Input, Select} from "@mantine/core";
import React, {useEffect} from "react";
import {Controller} from "react-hook-form";

declare global {
    interface Window {
        initMap: () => void;
        google: any;
    }
}

const Map: React.FC<{
    onDrag: (lat: number, lng: number) => void;
    onStreetAddressChange: (streetAddress: string) => void;
    control: any;
    initialLat: any;
    initialLng: any;
    isView: boolean;
}> = ({
          onDrag,
          onStreetAddressChange,
          control,
          initialLat,
          initialLng,
          isView,
      }) => {
    useEffect(() => {
        window.initMap = initMap;
        if (!document.querySelector('script[src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAHUq7rXW6gtVCss6HHxDGK9Su14uwkdU0&libraries=places&callback=initMap"]')) {
            const script = document.createElement("script");
            script.src =
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHUq7rXW6gtVCss6HHxDGK9Su14uwkdU0&libraries=places&callback=initMap";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        } else {
            initMap();
        }
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

        if (initialLat !== null && initialLng !== null) {
            autocomplete.addListener(
                "place_init",
                debounce(function () {
                    onDrag(initialLat, initialLng);
                }, 500)
            );
        }

        // L cho lat và lng mặc định như ri lúc tạo mới branch cũng được
        // Còn view detail thì pass lat, lng từ dữ liệu của branch vô
        const map = new window.google.maps.Map(document.getElementById("map"), {
            center: {lat: 16.07, lng: 108.15},
            zoom: 13,
        });

        const marker = new window.google.maps.Marker({
            map: map,
            draggable: true,
            position: {lat: 16.07, lng: 108.15},
        });

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

        marker.addListener("dragend", function () {
            const latLng = marker.getPosition();
            onDrag(latLng.lat(), latLng.lng());
        });
    };

    return (
        <>
            <Flex direction="column" p={10}>
                <Controller
                    name="streetAddress"
                    control={control}
                    rules={{required: false}}
                    render={({field}) => (
                        <Input
                            disabled={isView}
                            pb={20}
                            {...field}
                            name="streetAddress"
                            required
                            type="text"
                            id="autocomplete-input"
                            placeholder="Địa chỉ cụ thể"
                            onChange={(event) => {
                                field.onChange(event);
                                const address = event.target.value;
                                if (onStreetAddressChange) {
                                    onStreetAddressChange(address);
                                }
                            }}
                        />
                    )}
                ></Controller>
                <div id="map"></div>
            </Flex>
        </>
    );
};

export default Map;
