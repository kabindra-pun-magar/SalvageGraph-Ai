import {
    ArrowLeft,
    CheckCircle,
    ClipboardList,
    Package,
} from "lucide-react";


import {
    useNavigate,
    useParams,
} from "react-router-dom";


import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";


import { VerificationActions } from "../components/VerificationActions";

import { MatchScoreBreakdown } from "../components/MatchScoreBreakdown";

import { MatchBenefits } from "../components/MatchBenefits";

import { MatchComparison } from "../components/MatchComparison";


import { useRequirementMatches } from "../hooks/useRequirementMatches";




export function MatchDetailsPage() {


    const {
        requirementId,
        matchId,

    } = useParams<{
        requirementId:string;
        matchId:string;
    }>();



    const navigate = useNavigate();





    const {
        data: matches,
        isLoading,

    } = useRequirementMatches(
        requirementId
    );





    const match =
        matches?.find(
            (item)=>
                item.id === matchId
        );







    if(isLoading){

        return (

            <div className="h-64 animate-pulse rounded-xl bg-slate-100"/>

        );

    }








    if(!match){

        return (

            <div className="space-y-5">


                <button

                    onClick={() => navigate(-1)}

                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"

                >

                    <ArrowLeft size={16}/>

                    Back


                </button>





                <Card>


                    <p className="text-sm text-slate-600">

                        Match not found.

                    </p>


                </Card>



            </div>

        );

    }







    return (

        <div className="space-y-6">






            {/* Header */}

            <div>


                <button

                    onClick={() => navigate(-1)}

                    className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"

                >

                    <ArrowLeft size={16}/>

                    Back to matches


                </button>





                <div className="flex items-center gap-3">


                    <h1 className="text-2xl font-semibold text-slate-900">

                        Match Details

                    </h1>




                    <Badge variant="info">

                        {match.status}

                    </Badge>


                </div>




                <p className="mt-1 text-sm text-slate-500">

                    Review material compatibility before allocation.

                </p>


            </div>









            {/* Material Information */}


            <Card>


                <div className="flex items-center gap-3">


                    <div className="rounded-lg bg-slate-100 p-3">

                        <Package size={22}/>

                    </div>




                    <div>


                        <h2 className="font-semibold text-slate-900">

                            {match.material.materialCode}

                        </h2>



                        <p className="text-sm text-slate-500">


                            {match.material.type}


                            {" • "}


                            {match.material.quantity}


                            {" "}


                            {match.material.unit}


                        </p>



                    </div>


                </div>



            </Card>









            {/* Requirement Information */}


            {
                match.requirement && (

                    <Card>


                        <div className="flex items-center gap-3">


                            <div className="rounded-lg bg-slate-100 p-3">

                                <ClipboardList size={22}/>

                            </div>



                            <div>


                                <h2 className="font-semibold text-slate-900">

                                    Requirement Information

                                </h2>


                                <p className="text-sm text-slate-500">

                                    Target specification for this match.

                                </p>


                            </div>


                        </div>





                        <div className="mt-5 grid gap-4 md:grid-cols-2">



                            <InfoItem

                                label="Required Material"

                                value={
                                    match.requirement.materialType
                                }

                            />



                            <InfoItem

                                label="Required Quantity"

                                value={
                                    `${match.requirement.quantity} ${match.requirement.unit}`
                                }

                            />



                            <InfoItem

                                label="Required Condition"

                                value={
                                    match.requirement.requiredCondition !== null
                                    ? `${match.requirement.requiredCondition}%`
                                    : "Not specified"
                                }

                            />



                            <InfoItem

                                label="Application"

                                value={
                                    match.requirement.intendedApplication ??
                                    "Not specified"
                                }

                            />


                        </div>



                    </Card>

                )
            }









            {/* Requirement vs Material Comparison */}


            {
                match.requirement && (

                    <MatchComparison

                        requirement={{

                            materialType:
                                match.requirement.materialType,

                            quantity:
                                match.requirement.quantity,

                            unit:
                                match.requirement.unit,

                            requiredCondition:
                                match.requirement.requiredCondition,

                            intendedApplication:
                                match.requirement.intendedApplication,

                        }}



                        material={{

                            type:
                                match.material.type,

                            quantity:
                                match.material.quantity,

                            unit:
                                match.material.unit,

                            conditionScore:
                                match.material.conditionScore,

                            subtype:
                                match.material.subtype,

                        }}


                    />

                )
            }









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

                    <Card>


                        <div className="flex items-center gap-2">


                            <CheckCircle size={18}/>


                            <h2 className="font-semibold">

                                Recommendation Explanation

                            </h2>


                        </div>





                        <p className="mt-4 text-sm leading-6 text-slate-600">

                            {
                                match.recommendation.explanation
                            }

                        </p>


                    </Card>

                )
            }









            {/* Verification */}



            <Card>


                <VerificationActions


                    matchId={
                        match.id
                    }


                    requirementId={
                        requirementId!
                    }


                    currentStatus={
                        match.status
                    }


                />


            </Card>





        </div>

    );

}








function InfoItem({

    label,

    value,

}:{

    label:string;

    value:string;

}){


    return (

        <div className="rounded-lg bg-slate-50 p-4">


            <p className="text-xs uppercase text-slate-400">

                {label}

            </p>


            <p className="mt-1 text-sm font-medium text-slate-800">

                {value}

            </p>


        </div>

    );

}