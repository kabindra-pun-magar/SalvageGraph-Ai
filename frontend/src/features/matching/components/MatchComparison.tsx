import {
    Check,
    X,
    Ruler,
    Package,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";


interface MatchComparisonProps {

    requirement: {

        materialType: string;

        quantity: number | string;

        unit: string;

        requiredCondition: number | null;

        intendedApplication?: string | null;

    };


    material: {

        type: string;

        quantity: number | string;

        unit: string;

        conditionScore: number | null;

        subtype?: string | null;

    };

}



export function MatchComparison({
    requirement,
    material,
}: MatchComparisonProps) {


    return (

        <div className="grid gap-5 md:grid-cols-2">


            {/* Requirement */}

            <Card>

                <div className="flex items-center gap-2 mb-5">

                    <Package size={18}/>

                    <h2 className="font-semibold text-slate-900">

                        Requirement

                    </h2>

                </div>



                <ComparisonRow

                    label="Material Type"

                    value={
                        requirement.materialType
                    }

                />


                <ComparisonRow

                    label="Required Quantity"

                    value={
                        `${requirement.quantity} ${requirement.unit}`
                    }

                />


                <ComparisonRow

                    label="Minimum Condition"

                    value={
                        requirement.requiredCondition !== null
                        ? `${requirement.requiredCondition}%`
                        : "Not specified"
                    }

                />


                <ComparisonRow

                    label="Application"

                    value={
                        requirement.intendedApplication ??
                        "Not specified"
                    }

                />


            </Card>







            {/* Material */}

            <Card>


                <div className="flex items-center gap-2 mb-5">

                    <Ruler size={18}/>

                    <h2 className="font-semibold text-slate-900">

                        Matched Material

                    </h2>

                </div>




                <ComparisonRow

                    label="Material Type"

                    value={
                        material.type
                    }

                    match={
                        material.type ===
                        requirement.materialType
                    }

                />



                <ComparisonRow

                    label="Available Quantity"

                    value={
                        `${material.quantity} ${material.unit}`
                    }

                    match={
                        Number(material.quantity) >=
                        Number(requirement.quantity)
                    }

                />



                <ComparisonRow

                    label="Condition"

                    value={
                        material.conditionScore !== null
                        ? `${material.conditionScore}%`
                        : "Unknown"
                    }

                    match={
                        requirement.requiredCondition === null ||
                        (
                            material.conditionScore !== null &&
                            material.conditionScore >=
                            requirement.requiredCondition
                        )
                    }

                />


            </Card>


        </div>

    );

}







function ComparisonRow({

    label,

    value,

    match,

}:{

    label:string;

    value:string;

    match?:boolean;

}){


    return (

        <div className="flex items-center justify-between border-b border-slate-100 py-3">


            <span className="text-sm text-slate-500">

                {label}

            </span>



            <div className="flex items-center gap-2">


                <span className="text-sm font-medium text-slate-800">

                    {value}

                </span>


                {
                    match !== undefined && (

                        match
                        ?

                        <Check
                            size={16}
                            className="text-green-600"
                        />

                        :

                        <X
                            size={16}
                            className="text-red-600"
                        />

                    )
                }


            </div>


        </div>

    );

}