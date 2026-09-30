import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../../components/ui/Button";
import { CreateMaterialForm } from "../components/CreateMaterialForm";
import { useMaterial } from "../hooks/useMaterial";

export default function MaterialEditPage() {
    const { materialId } = useParams<{
        materialId: string;
    }>();

    const navigate = useNavigate();

    const {
        data: material,
        isLoading,
        isError,
    } = useMaterial(materialId);

    if (isLoading) {
        return <MaterialEditLoadingState />;
    }

    if (isError || !material) {
        return (
            <div className="space-y-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/materials")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Materials
                </Button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load material
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The material could not be found or could not
                        be loaded.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        navigate(`/materials/${material.id}`)
                    }
                    className="mb-3 -ml-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Material
                </Button>

                <h1 className="text-2xl font-semibold text-slate-900">
                    Edit Material
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Update the information for{" "}
                    <span className="font-medium text-slate-700">
                        {material.materialCode}
                    </span>
                    .
                </p>
            </div>

            {/* Edit Form */}
            <CreateMaterialForm
                mode="edit"
                initialData={material}
                onSuccess={() =>
                    navigate(`/materials/${material.id}`, {
                        replace: true,
                    })
                }
                onCancel={() =>
                    navigate(`/materials/${material.id}`)
                }
            />
        </div>
    );
}

function MaterialEditLoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

            <div className="space-y-2">
                <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}