import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { CreateMaterialForm } from "../components/CreateMaterialForm";

export default function MaterialRegistrationPage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/materials")}
                    className="mb-3 -ml-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Materials
                </Button>

                <h1 className="text-2xl font-semibold text-slate-900">
                    Register Material
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Add a new construction material to the
                    SalvageGraph inventory.
                </p>
            </div>

            {/* Form */}
            <CreateMaterialForm
                onSuccess={() => navigate("/materials")}
                onCancel={() => navigate("/materials")}
            />
        </div>
    );
}