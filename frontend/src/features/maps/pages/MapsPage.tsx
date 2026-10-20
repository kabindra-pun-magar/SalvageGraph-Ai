import { useState } from "react";

import {
  AlertCircle,
  LoaderCircle,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { MapFilters } from "../components/MapFilters";
import { MapStats } from "../components/MapStats";
import { MapView } from "../components/MapView";

import { useMapOverview } from "../hooks/useMapOverview";

export function MapsPage() {
  const [showProjects, setShowProjects] = useState(true);
  const [showMaterials, setShowMaterials] = useState(true);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useMapOverview();

  if (isPending) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />

        <p className="text-sm text-gray-500">
          Loading map locations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Unable to load map
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred while loading map data."}
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const projects = data?.projects ?? [];
  const materials = data?.materials ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-7 w-7 text-blue-600" />

            <h1 className="text-2xl font-bold text-gray-900">
              Geographic Map
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Explore construction projects and available reusable materials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />

          Refresh map
        </button>
      </div>

      <MapStats
        totalProjects={projects.length}
        totalMaterials={materials.length}
      />

      <MapFilters
        showProjects={showProjects}
        showMaterials={showMaterials}
        onToggleProjects={() =>
          setShowProjects((previous) => !previous)
        }
        onToggleMaterials={() =>
          setShowMaterials((previous) => !previous)
        }
      />

      {projects.length === 0 && materials.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No mapped locations yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Add valid latitude and longitude coordinates to your
            projects or available materials to display them here.
          </p>
        </div>
      ) : (
        <MapView
          projects={projects}
          materials={materials}
          showProjects={showProjects}
          showMaterials={showMaterials}
        />
      )}

      <p className="text-xs text-gray-500">
        Map locations are based on coordinates stored in SalvageGraph.
        Verify coordinates before using them for transport planning.
        Map tiles © OpenStreetMap contributors.
      </p>
    </div>
  );
}