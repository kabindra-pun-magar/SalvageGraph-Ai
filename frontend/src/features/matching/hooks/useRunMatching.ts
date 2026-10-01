import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    runMatching,
} from "../services/matchingService";


export function useRunMatching() {

    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn:
            (requirementId:string)=>
                runMatching(requirementId),


        onSuccess:
            (_, requirementId)=>{

                queryClient.invalidateQueries({
                    queryKey:[
                        "matches",
                        requirementId
                    ]
                });

            }

            

    });

}