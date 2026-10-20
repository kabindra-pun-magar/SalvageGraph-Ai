import { api } from "../../../services/api";

export interface MapProject {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  latitude: number;
  longitude: number;
  deadline: string | null;
  createdAt: string;
}

export interface MapMaterial {
  id: string;
  materialCode: string;
  type: string;
  subtype: string | null;
  quantity: string | number;
  unit: string;
  status: string;
  verification: string;
  conditionScore: number | null;
  location: string | null;
  latitude: number;
  longitude: number;
  sourceProject: {
    id: string;
    name: string;
  } | null;
}

export interface MapOverview {
  projects: MapProject[];
  materials: MapMaterial[];
  summary: {
    totalProjects: number;
    totalMaterials: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getMapOverview = async (): Promise<MapOverview> => {
  const response = await api.get<ApiResponse<MapOverview>>(
    "/map/overview"
  );

  return response.data.data;
};