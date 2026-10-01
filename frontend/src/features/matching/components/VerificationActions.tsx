import {
    Check,
    X,
    AlertTriangle,
} from "lucide-react";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    verifyMatch,
} from "../services/matchingService";


interface VerificationActionsProps {

    matchId: string;

    requirementId: string;

    currentStatus?: string;

}


export function VerificationActions({
    matchId,
    requirementId,
    currentStatus,
}: VerificationActionsProps) {


    const queryClient =
        useQueryClient();


    const [note, setNote] =
        useState("");



    const verificationMutation =
        useMutation({

            mutationFn:
                ({
                    decision,
                }:{
                    decision:
                    | "ACCEPTED"
                    | "REJECTED"
                    | "NEEDS_INSPECTION"
                }) =>
                    verifyMatch(
                        matchId,
                        decision,
                        note
                    ),


            onSuccess:()=>{

                queryClient.invalidateQueries({
                    queryKey:[
                        "matches",
                        requirementId
                    ]
                });

            }

        });



    const isPending =
        verificationMutation.isPending;



    return (

        <div className="space-y-4 border-t border-slate-100 pt-5">


            <div>

                <p className="text-sm font-medium text-slate-800">

                    Human Verification

                </p>


                <p className="mt-1 text-xs text-slate-500">

                    Review this recommendation before allocation.

                </p>

            </div>




            <textarea

                value={note}

                onChange={(e)=>
                    setNote(e.target.value)
                }

                placeholder="Add verification note..."

                className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"

            />





            <div className="flex flex-wrap gap-3">


                <button

                    disabled={isPending}

                    onClick={() =>
                        verificationMutation.mutate({
                            decision:
                                "ACCEPTED"
                        })
                    }

                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"

                >

                    <Check size={16}/>

                    Accept

                </button>





                <button

                    disabled={isPending}

                    onClick={() =>
                        verificationMutation.mutate({
                            decision:
                                "REJECTED"
                        })
                    }

                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"

                >

                    <X size={16}/>

                    Reject

                </button>






                <button

                    disabled={isPending}

                    onClick={() =>
                        verificationMutation.mutate({
                            decision:
                                "NEEDS_INSPECTION"
                        })
                    }

                    className="inline-flex items-center gap-2 rounded-lg border border-yellow-200 bg-white px-4 py-2 text-sm font-medium text-yellow-700 transition hover:bg-yellow-50 disabled:opacity-50"

                >

                    <AlertTriangle size={16}/>

                    Needs Inspection

                </button>



            </div>





            {
                currentStatus && (

                    <p className="text-xs text-slate-500">

                        Current status: {currentStatus}

                    </p>

                )
            }



            {
                verificationMutation.isError && (

                    <p className="text-sm text-red-600">

                        Unable to update verification status.

                    </p>

                )
            }



            {
                verificationMutation.isSuccess && (

                    <p className="text-sm text-green-600">

                        Verification updated successfully.

                    </p>

                )
            }



        </div>

    );

}