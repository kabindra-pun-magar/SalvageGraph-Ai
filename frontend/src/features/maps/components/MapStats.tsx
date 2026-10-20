import { MapPin, Package, Building2 } from "lucide-react";

interface MapStatsProps {
  totalProjects: number;
  totalMaterials: number;
}

export function MapStats({
  totalProjects,
  totalMaterials,
}: MapStatsProps) {
  const stats = [
    {
      label: "Projects on map",
      value: totalProjects,
      icon: Building2,
    },
    {
      label: "Materials on map",
      value: totalMaterials,
      icon: Package,
    },
    {
      label: "Total locations",
      value: totalProjects + totalMaterials,
      icon: MapPin,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3">
                <Icon className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}