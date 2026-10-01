import {
    MapPin,
    DollarSign,
    Leaf,
    ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { MatchScoreBreakdown } from "./MatchScoreBreakdown";

import type { Match } from "../services/matchingService";


interface MatchCardProps {

    match: Match;

    requirementId: string;

    rank: number;

}



export function MatchCard({
    match,
    requirementId,
    rank,
}: MatchCardProps) {


    const navigate = useNavigate();



    return (

        <Card>


            <div className="space-y-5">



                {/* Header */}

                <div className="flex flex-col justify-between gap-4 md:flex-row">


                    <div>


                        <div className="flex items-center gap-3">


                            <Badge variant="info">

                                Rank #{rank}

                            </Badge>



                            <h2 className="text-lg font-semibold text-slate-900">

                                {match.material.materialCode}

                            </h2>


                        </div>



                        <p className="mt-2 text-sm text-slate-500">

                            {match.material.type}

                            {" • "}

                            {match.material.quantity}

                            {" "}

                            {match.material.unit}


                        </p>



                    </div>





                    <div className="rounded-xl bg-slate-900 px-5 py-3 text-center text-white">


                        <p className="text-xs text-slate-300">

                            Suitability

                        </p>



                        <p className="text-2xl font-bold">


                            {
                                match.suitabilityScore !== null
                                ? `${match.suitabilityScore.toFixed(1)}%`
                                : "N/A"
                            }


                        </p>



                    </div>



                </div>






                {/* Score Breakdown */}

                <MatchScoreBreakdown

                    compatibilityScore={
                        match.compatibilityScore
                    }

                    conditionScore={
                        match.conditionScore
                    }

                    quantityScore={
                        match.quantityScore
                    }

                    dimensionScore={
                        match.dimensionScore
                    }

                    suitabilityScore={
                        match.suitabilityScore
                    }

                />








                {/* Benefits */}

                <div className="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">



                    <InfoItem

                        icon={
                            <MapPin size={16}/>
                        }

                        label="Distance"

                        value={
                            match.distanceKm !== null
                            ? `${match.distanceKm} km`
                            : "Unavailable"
                        }

                    />





                    <InfoItem

                        icon={
                            <DollarSign size={16}/>
                        }

                        label="Economic Benefit"

                        value={
                            match.economicBenefit !== null
                            ? String(match.economicBenefit)
                            : "Unavailable"
                        }

                    />






                    <InfoItem

                        icon={
                            <Leaf size={16}/>
                        }

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


                            <p className="text-sm font-medium text-slate-800">

                                Recommendation

                            </p>



                            <p className="mt-2 text-sm leading-6 text-slate-600">


                                {
                                    match.recommendation.explanation
                                }


                            </p>


                        </div>

                    )
                }







                {/* Action */}


                <button

                    onClick={() =>
                        navigate(
                            `/requirements/${requirementId}/matches/${match.id}`
                        )
                    }

                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"

                >

                    View Details

                    <ArrowRight size={16}/>


                </button>



            </div>


        </Card>

    );

}







function InfoItem({

    icon,

    label,

    value,

}:{

    icon: React.ReactNode;

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