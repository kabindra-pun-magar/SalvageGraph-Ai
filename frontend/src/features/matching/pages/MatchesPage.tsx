import {
    ArrowLeft,
    Package,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { useRequirementMatches } from "../hooks/useRequirementMatches";

import { MatchCard } from "../components/MatchCard";


export function MatchesPage() {


    const {
        requirementId,
    } = useParams<{
        requirementId:string;
    }>();


    const navigate = useNavigate();



    const {
        data: matches,
        isLoading,
        isError,

    } = useRequirementMatches(
        requirementId
    );





    if(isLoading){

        return (

            <div className="space-y-5">

                <div className="h-8 w-60 animate-pulse rounded bg-slate-200"/>


                {[1,2,3].map(item=>(

                    <div
                        key={item}
                        className="h-52 animate-pulse rounded-xl bg-slate-100"
                    />

                ))}

            </div>

        );

    }





    if(
        isError ||
        !matches
    ){

        return (

            <Card>

                <div className="rounded-lg bg-red-50 p-5">

                    <p className="font-semibold text-red-800">

                        Unable to load matches

                    </p>


                    <p className="mt-1 text-sm text-red-600">

                        Matching results could not be retrieved.

                    </p>


                </div>

            </Card>

        );

    }





    const rankedMatches =
        [...matches].sort(
            (a,b)=>
                (b.suitabilityScore ?? 0)
                -
                (a.suitabilityScore ?? 0)
        );







    return (

        <div className="space-y-6">


            <div>


                <button

                    onClick={()=>navigate(-1)}

                    className="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"

                >

                    <ArrowLeft size={16}/>

                    Back

                </button>




                <div className="flex items-center justify-between">


                    <div>

                        <h1 className="text-2xl font-semibold text-slate-900">

                            Recommended Matches

                        </h1>


                        <p className="mt-1 text-sm text-slate-500">

                            Ranked reusable materials based on suitability.

                        </p>


                    </div>



                    <Badge variant="info">

                        {rankedMatches.length} Matches

                    </Badge>



                </div>


            </div>







            {
                rankedMatches.length === 0 && (

                    <Card>

                        <div className="py-12 text-center">


                            <Package

                                className="mx-auto text-slate-400"

                                size={42}

                            />


                            <p className="mt-3 font-medium">

                                No suitable materials found

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                Adjust the requirement criteria and try again.

                            </p>


                        </div>

                    </Card>

                )
            }







            <div className="space-y-5">


                {
                    rankedMatches.map(
                        (
                            match,
                            index
                        )=>(


                            <MatchCard

                                key={match.id}

                                match={match}

                                requirementId={
                                    requirementId!
                                }

                                rank={
                                    index + 1
                                }

                            />


                        )
                    )
                }


            </div>


        </div>

    );

}