import {
    ArrowRight,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";


import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";


import { MatchScoreBreakdown } from "./MatchScoreBreakdown";
import { MatchBenefits } from "./MatchBenefits";


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



    const navigate =
        useNavigate();




    return (


        <Card>


            <div className="space-y-6">



                {/* Header */}

                <div className="flex flex-col justify-between gap-5 md:flex-row">


                    <div>


                        <div className="flex items-center gap-3">


                            <Badge variant="info">

                                Rank #{rank}

                            </Badge>




                            <h2 className="text-lg font-semibold text-slate-900">

                                {
                                    match.material.materialCode
                                }

                            </h2>


                        </div>





                        <p className="mt-2 text-sm text-slate-500">


                            {
                                match.material.type
                            }


                            {" • "}


                            {
                                match.material.quantity
                            }


                            {" "}


                            {
                                match.material.unit
                            }


                        </p>



                    </div>






                    {/* Suitability Score */}


                    <div className="rounded-xl bg-slate-900 px-5 py-3 text-center text-white">


                        <p className="text-xs text-slate-300">

                            Suitability

                        </p>




                        <p className="mt-1 text-2xl font-bold">


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


                <MatchBenefits


                    distanceKm={
                        match.distanceKm
                    }


                    transportCost={
                        match.transportCost
                    }


                    economicBenefit={
                        match.economicBenefit
                    }


                    environmentalBenefit={

                        match.recommendation
                        ?.environmentalBenefit

                    }


                />









                {/* Recommendation */}



                {
                    match.recommendation && (


                        <div className="rounded-xl bg-slate-50 p-5">


                            <h3 className="text-sm font-semibold text-slate-800">


                                Recommendation


                            </h3>





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


                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"


                >


                    View Details


                    <ArrowRight size={16}/>



                </button>





            </div>



        </Card>


    );

}