import { useQuery } from "@tanstack/react-query";
import { getMapOverview } from "../services/mapService";

export function useMapOverview() {
  return useQuery({
    queryKey: ["map-overview"],
    queryFn: getMapOverview,
    staleTime: 30_000,
    retry: 1,
  });
}