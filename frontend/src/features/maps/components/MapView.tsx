import { useEffect } from "react";

import L from "leaflet";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type {
  LatLngExpression,
  LatLngTuple,
} from "leaflet";

import "leaflet/dist/leaflet.css";

import type {
  MapProject,
  MapMaterial,
} from "../services/mapService";

interface MapViewProps {
  projects: MapProject[];
  materials: MapMaterial[];
  showProjects: boolean;
  showMaterials: boolean;
}

const DEFAULT_CENTER: LatLngExpression = [
  28.6,
  81.63,
];

const DEFAULT_ZOOM = 8;

const projectIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #2563eb;
      border: 3px solid white;
      color: white;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">P</div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

const materialIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #059669;
      border: 3px solid white;
      color: white;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">M</div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

function isValidCoordinate(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): latitude is number {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function FitMapToMarkers({
  projects,
  materials,
  showProjects,
  showMaterials,
}: MapViewProps) {
  const map = useMap();

  useEffect(() => {
    const coordinates: LatLngTuple[] = [];

    if (showProjects) {
      projects.forEach((project) => {
        if (
          isValidCoordinate(
            project.latitude,
            project.longitude
          )
        ) {
          coordinates.push([
            project.latitude,
            project.longitude,
          ]);
        }
      });
    }

    if (showMaterials) {
      materials.forEach((material) => {
        if (
          isValidCoordinate(
            material.latitude,
            material.longitude
          )
        ) {
          coordinates.push([
            material.latitude,
            material.longitude,
          ]);
        }
      });
    }

    if (coordinates.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (coordinates.length === 1) {
      map.setView(coordinates[0], 12);
      return;
    }

    map.fitBounds(
      L.latLngBounds(coordinates),
      {
        padding: [40, 40],
        maxZoom: 12,
      }
    );
  }, [
    map,
    projects,
    materials,
    showProjects,
    showMaterials,
  ]);

  return null;
}

export function MapView({
  projects,
  materials,
  showProjects,
  showMaterials,
}: MapViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-[520px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapToMarkers
          projects={projects}
          materials={materials}
          showProjects={showProjects}
          showMaterials={showMaterials}
        />

        {showProjects &&
          projects.map((project) => {
            if (
              !isValidCoordinate(
                project.latitude,
                project.longitude
              )
            ) {
              return null;
            }

            return (
              <Marker
                key={`project-${project.id}`}
                position={[
                  project.latitude,
                  project.longitude,
                ]}
                icon={projectIcon}
              >
                <Popup>
                  <div className="min-w-[190px] space-y-2">
                    <p className="font-semibold text-blue-700">
                      Construction project
                    </p>

                    <h3 className="text-base font-bold">
                      {project.name}
                    </h3>

                    <p className="text-sm">
                      <strong>Location:</strong>{" "}
                      {project.location || "Not provided"}
                    </p>

                    {project.description && (
                      <p className="text-sm">
                        {project.description}
                      </p>
                    )}

                    {project.deadline && (
                      <p className="text-sm">
                        <strong>Deadline:</strong>{" "}
                        {new Date(
                          project.deadline
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {showMaterials &&
          materials.map((material) => {
            if (
              !isValidCoordinate(
                material.latitude,
                material.longitude
              )
            ) {
              return null;
            }

            return (
              <Marker
                key={`material-${material.id}`}
                position={[
                  material.latitude,
                  material.longitude,
                ]}
                icon={materialIcon}
              >
                <Popup>
                  <div className="min-w-[200px] space-y-2">
                    <p className="font-semibold text-emerald-700">
                      Available material
                    </p>

                    <h3 className="text-base font-bold">
                      {material.type}
                      {material.subtype
                        ? ` — ${material.subtype}`
                        : ""}
                    </h3>

                    <p className="text-sm">
                      <strong>Material code:</strong>{" "}
                      {material.materialCode}
                    </p>

                    <p className="text-sm">
                      <strong>Quantity:</strong>{" "}
                      {Number(
                        material.quantity
                      ).toLocaleString()}{" "}
                      {material.unit}
                    </p>

                    <p className="text-sm">
                      <strong>Condition score:</strong>{" "}
                      {material.conditionScore ?? "Not assessed"}
                    </p>

                    <p className="text-sm">
                      <strong>Verification:</strong>{" "}
                      {material.verification.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                    <p className="text-sm">
                      <strong>Location:</strong>{" "}
                      {material.location || "Not provided"}
                    </p>

                    {material.sourceProject && (
                      <p className="text-sm">
                        <strong>Source project:</strong>{" "}
                        {material.sourceProject.name}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      <div className="flex flex-wrap gap-5 border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            P
          </span>
          Projects
        </span>

        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            M
          </span>
          Available materials
        </span>
      </div>
    </div>
  );
}