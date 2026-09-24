import { api } from "../../../services/api";

export interface DashboardSummary {
    availableMaterials: number;
    activeProjects: number;
    pendingRecommendations: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>(
        "/dashboard/summary",
    );

    return response.data;
}
