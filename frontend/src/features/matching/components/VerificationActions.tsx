import {
    Check,
    X,
    AlertTriangle,
} from "lucide-react";

import { useState } from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    verifyMatch,
} from "../services/matchingService";


interface VerificationActionsProps {

    matchId:string;

    requirementId:string;

    currentStatus?:string;

}



export function VerificationActions({

    matchId,

    requirementId,

    currentStatus,

}:VerificationActionsProps){


    const queryClient =
        useQueryClient();



    const [note,setNote] =
        useState("");



    const [confirmAction,setConfirmAction] =
        useState<
            "ACCEPTED" |
            "REJECTED" |
            "NEEDS_INSPECTION" |
            null
        >(null);




    const mutation =
        useMutation({

            mutationFn:
                ()=>verifyMatch(
                    matchId,
                    confirmAction!,
                    note
                ),


            onSuccess:()=>{

                queryClient.invalidateQueries({

                    queryKey:[
                        "matches",
                        requirementId
                    ]

                });


                setConfirmAction(null);

            }

        });




    const submitDecision = ()=>{

        if(!confirmAction)
            return;


        mutation.mutate();

    };



    const disabled =
        mutation.isPending ||
        currentStatus === "ACCEPTED" ||
        currentStatus === "REJECTED";



    return (

        <div className="space-y-5 border-t border-slate-100 pt-5">


            <div className="flex items-center justify-between">


                <div>

                    <h3 className="text-sm font-semibold text-slate-900">

                        Human Verification

                    </h3>


                    <p className="mt-1 text-xs text-slate-500">

                        Approve or reject this AI recommendation.

                    </p>

                </div>




                {
                    currentStatus && (

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">

                            {currentStatus}

                        </span>

                    )
                }


            </div>






            <textarea

                value={note}

                onChange={
                    (e)=>
                    setNote(e.target.value)
                }

                placeholder="Verification note..."

                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"

            />







            <div className="flex flex-wrap gap-3">



                <ActionButton

                    icon={<Check size={16}/>}

                    label="Accept"

                    disabled={disabled}

                    active={
                        confirmAction==="ACCEPTED"
                    }

                    onClick={()=>
                        setConfirmAction("ACCEPTED")
                    }

                />



                <ActionButton

                    icon={<X size={16}/>}

                    label="Reject"

                    disabled={disabled}

                    active={
                        confirmAction==="REJECTED"
                    }

                    onClick={()=>
                        setConfirmAction("REJECTED")
                    }

                />



                <ActionButton

                    icon={<AlertTriangle size={16}/>}

                    label="Needs Inspection"

                    disabled={disabled}

                    active={
                        confirmAction==="NEEDS_INSPECTION"
                    }

                    onClick={()=>
                        setConfirmAction(
                            "NEEDS_INSPECTION"
                        )
                    }

                />



            </div>






            {
                confirmAction && (

                    <div className="rounded-lg bg-slate-50 p-4">


                        <p className="text-sm text-slate-700">

                            Confirm decision:

                            {" "}

                            <strong>
                                {confirmAction}
                            </strong>

                        </p>


                        <button

                            onClick={submitDecision}

                            disabled={mutation.isPending}

                            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"

                        >

                            {
                                mutation.isPending
                                ? "Updating..."
                                : "Confirm"

                            }

                        </button>


                    </div>

                )
            }






            {
                mutation.isSuccess && (

                    <p className="text-sm text-green-600">

                        Verification updated successfully.

                    </p>

                )
            }




            {
                mutation.isError && (

                    <p className="text-sm text-red-600">

                        Failed to update verification.

                    </p>

                )
            }



        </div>

    );

}






function ActionButton({

    icon,

    label,

    disabled,

    active,

    onClick,

}:{

    icon:React.ReactNode;

    label:string;

    disabled:boolean;

    active:boolean;

    onClick:()=>void;

}){


    return (

        <button

            onClick={onClick}

            disabled={disabled}

            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition

            ${
                active
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }

            disabled:opacity-50`}

        >

            {icon}

            {label}

        </button>

    );

}