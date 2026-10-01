import {
    ArrowLeft,
    MapPin,
    TrendingUp,
    Leaf,
    DollarSign,
    Package,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { useRequirementMatches } from "../hooks/useRequirementMatches";


export function MatchesPage() {

    const {
        requirementId,
    } = useParams<{
        requirementId: string;
    }>();

    const navigate = useNavigate();


    const {
        data: matches,
        isLoading,
        isError,
    } = useRequirementMatches(
        requirementId
    );


    if (isLoading) {

        return (
            <div className="space-y-5">

                <div className="h-8 w-60 animate-pulse rounded bg-slate-200"/>

                <div className="grid gap-5">

                    {[1,2,3].map(
                        (item)=>(
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-xl bg-slate-100"
                            />
                        )
                    )}

                </div>

            </div>
        );
    }


    if (
        isError ||
        !matches
    ) {

        return (
            <div className="space-y-5">

                <button
                    onClick={()=>navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-500"
                >

                    <ArrowLeft size={16}/>
                    Back

                </button>


                <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                    <p className="font-semibold text-red-800">
                        Unable to load matches
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        Matching results could not be retrieved.
                    </p>

                </div>

            </div>
        );
    }



    return (

        <div className="space-y-6">


            {/* Header */}

            <div className="flex items-center justify-between">


                <div>

                    <button
                        onClick={()=>navigate(-1)}
                        className="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
                    >

                        <ArrowLeft size={16}/>
                        Back

                    </button>


                    <h1 className="text-2xl font-semibold text-slate-900">
                        Recommended Matches
                    </h1>


                    <p className="mt-1 text-sm text-slate-500">
                        Ranked reusable materials for this requirement.
                    </p>


                </div>


                <Badge variant="info">

                    {matches.length} Matches

                </Badge>


            </div>




            {/* Empty */}

            {matches.length === 0 && (

                <Card>

                    <div className="py-10 text-center">

                        <Package
                            className="mx-auto text-slate-400"
                            size={40}
                        />


                        <p className="mt-3 font-medium text-slate-700">
                            No suitable materials found
                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Try updating the requirement criteria.
                        </p>

                    </div>

                </Card>

            )}






            {/* Match Cards */}

            <div className="space-y-5">


                {matches.map(
                    (match,index)=>(


                    <Card
                        key={match.id}
                    >


                        <div className="space-y-5">


                            {/* Top */}

                            <div className="flex flex-col justify-between gap-4 md:flex-row">


                                <div>


                                    <div className="flex items-center gap-3">


                                        <h2 className="text-lg font-semibold text-slate-900">

                                            {match.material.materialCode}

                                        </h2>


                                        <Badge variant="success">

                                            Rank #{index + 1}

                                        </Badge>


                                    </div>


                                    <p className="mt-1 text-sm text-slate-500">

                                        {match.material.type}

                                        {" • "}

                                        {match.material.quantity}

                                        {" "}

                                        {match.material.unit}

                                    </p>


                                </div>




                                <div className="rounded-lg bg-slate-900 px-4 py-3 text-center text-white">

                                    <p className="text-xs text-slate-300">
                                        Suitability
                                    </p>

                                    <p className="text-xl font-semibold">

                                        {
                                            match.suitabilityScore?.toFixed(1)
                                            ?? "N/A"
                                        }%

                                    </p>

                                </div>


                            </div>





                            {/* Scores */}

                            <div className="grid gap-4 md:grid-cols-3">


                                <ScoreItem

                                    label="Compatibility"

                                    value={
                                        match.compatibilityScore
                                    }

                                />


                                <ScoreItem

                                    label="Condition"

                                    value={
                                        match.conditionScore
                                    }

                                />


                                <ScoreItem

                                    label="Quantity"

                                    value={
                                        match.quantityScore
                                    }

                                />


                            </div>





                            {/* Logistics */}

                            <div className="grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">


                                <InfoBox

                                    icon={<MapPin size={17}/>}

                                    label="Distance"

                                    value={
                                        match.distanceKm !== null
                                            ? `${match.distanceKm} km`
                                            : "Unavailable"
                                    }

                                />



                                <InfoBox

                                    icon={<DollarSign size={17}/>}

                                    label="Economic Benefit"

                                    value={
                                        match.economicBenefit !== null
                                            ? `${match.economicBenefit}`
                                            : "Unavailable"
                                    }

                                />



                                <InfoBox

                                    icon={<Leaf size={17}/>}

                                    label="Environmental"

                                    value={
                                        match.recommendation
                                            ?.environmentalBenefit
                                            ? "Calculated"
                                            : "Unavailable"
                                    }

                                />


                            </div>





                            {/* Recommendation */}

                            {
                                match.recommendation && (

                                    <div className="rounded-lg bg-slate-50 p-4">


                                        <div className="flex items-center gap-2">

                                            <TrendingUp size={17}/>


                                            <p className="font-medium text-slate-800">

                                                Recommendation

                                            </p>


                                        </div>


                                        <p className="mt-2 text-sm text-slate-600">

                                            {
                                                match.recommendation.explanation
                                            }

                                        </p>


                                    </div>

                                )
                            }



                        </div>


                    </Card>


                ))}


            </div>


        </div>

    );

}




function ScoreItem(
{
    label,
    value,
}:{
    label:string;
    value:number|null;
}){

    return (

        <div className="rounded-lg bg-slate-50 p-4">

            <p className="text-xs uppercase text-slate-400">

                {label}

            </p>


            <p className="mt-1 text-lg font-semibold text-slate-800">

                {
                    value !== null
                    ? `${value.toFixed(1)}%`
                    : "N/A"
                }

            </p>

        </div>

    );

}





function InfoBox(
{
    icon,
    label,
    value,
}:{
    icon:React.ReactNode;
    label:string;
    value:string;
}){

    return (

        <div className="flex items-center gap-3">

            <div className="text-slate-500">

                {icon}

            </div>


            <div>

                <p className="text-xs text-slate-400">

                    {label}

                </p>


                <p className="text-sm font-medium text-slate-800">

                    {value}

                </p>


            </div>


        </div>

    );

}