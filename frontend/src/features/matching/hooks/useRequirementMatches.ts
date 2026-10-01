import { useQuery } from "@tanstack/react-query";

import {
    getRequirementMatches
} from "../services/matchingService";


export function useRequirementMatches(
    requirementId:string | undefined
){

    return useQuery({

        queryKey:[
            "matches",
            requirementId
        ],


        queryFn:
            ()=>getRequirementMatches(
                requirementId!
            ),


        enabled:
            Boolean(requirementId),


        retry:2,

    });

}