import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onSelect: (location: {
    latitude: number;
    longitude: number;
    locationName?: string;
  }) => void;
}

const DEFAULT_CENTER: [number, number] = [28.6, 81.63];

const selectedIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      background: #2563eb;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapClickHandler({
  onSelect,
}: {
  onSelect: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect(
        Number(event.latlng.lat.toFixed(6)),
        Number(event.latlng.lng.toFixed(6))
      );
    },
  });

  return null;
}

function MapViewport({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), 13));
    }
  }, [latitude, longitude, map]);

  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onSelect,
}: LocationPickerProps) {
  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;

  const selectedPosition: [number, number] | null =
    hasCoordinates ? [latitude, longitude] : null;

  const [isResolving, setIsResolving] = useState(false);
  const [geocodingMessage, setGeocodingMessage] = useState("");

  const handleSelect = async (
    selectedLatitude: number,
    selectedLongitude: number
  ) => {
    // Coordinates are immediately available, even if geocoding fails.
    onSelect({
      latitude: selectedLatitude,
      longitude: selectedLongitude,
    });

    setIsResolving(true);
    setGeocodingMessage("");

    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(selectedLatitude),
        lon: String(selectedLongitude),
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Location lookup failed");
      }

      const result: {
        display_name?: string;
      } = await response.json();

      if (result.display_name) {
        onSelect({
          latitude: selectedLatitude,
          longitude: selectedLongitude,
          locationName: result.display_name,
        });

        setGeocodingMessage("Location name found.");
      } else {
        setGeocodingMessage(
          "Coordinates selected. Enter the location name manually."
        );
      }
    } catch {
      setGeocodingMessage(
        "Coordinates selected. Location name lookup is unavailable."
      );
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-800">
          Select a location on the map
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Click the map to place the marker. Click another point to
          move it.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={selectedPosition ?? DEFAULT_CENTER}
          zoom={selectedPosition ? 13 : 7}
          scrollWheelZoom
          className="h-[360px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSelect={handleSelect} />

          <MapViewport
            latitude={latitude ?? null}
            longitude={longitude ?? null}
          />

          {selectedPosition && (
            <Marker
              position={selectedPosition}
              icon={selectedIcon}
            />
          )}
        </MapContainer>
      </div>

      {selectedPosition && (
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p>
            <span className="font-medium">Latitude:</span>{" "}
            {selectedPosition[0].toFixed(6)}
          </p>

          <p className="mt-1">
            <span className="font-medium">Longitude:</span>{" "}
            {selectedPosition[1].toFixed(6)}
          </p>
        </div>
      )}

      {isResolving && (
        <p className="text-sm text-slate-500">
          Looking up the location name...
        </p>
      )}

      {geocodingMessage && (
        <p role="status" className="text-sm text-slate-600">
          {geocodingMessage}
        </p>
      )}
    </div>
  );
}