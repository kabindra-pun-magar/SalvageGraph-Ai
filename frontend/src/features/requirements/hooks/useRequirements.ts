import { useQuery } from "@tanstack/react-query";

import {
    getProjectRequirements,
    type MaterialRequirement,
} from "../services/requirementService";

import {
    getProjects,
    type Project,
} from "../../projects/services/projectService";


export interface RequirementWithProject
    extends MaterialRequirement {

    projectName: string;

}


export function useRequirements(
    projectId: string | undefined
) {

    return useQuery({

        queryKey: [
            "requirements",
            projectId,
        ],

        queryFn: () =>
            getProjectRequirements(
                projectId!
            ),

        enabled:
            Boolean(projectId),

    });

}


/*
|--------------------------------------------------------------------------
| Global Requirements
|--------------------------------------------------------------------------
|
| Used by the Requirements sidebar page.
|
| It loads the user's projects first and then loads the requirements
| belonging to each project.
|
*/

export function useAllRequirements() {

    return useQuery({

        queryKey: [
            "requirements",
            "all",
        ],

        queryFn:
            async (): Promise<
                RequirementWithProject[]
            > => {

                const projects: Project[] =
                    await getProjects();


                const requirementGroups =
                    await Promise.all(

                        projects.map(
                            async (project) => {

                                const requirements =
                                    await getProjectRequirements(
                                        project.id
                                    );


                                return requirements.map(
                                    (
                                        requirement
                                    ) => ({

                                        ...requirement,

                                        projectName:
                                            project.name,

                                    })
                                );

                            }
                        )

                    );


                return requirementGroups.flat();

            },

    });

}