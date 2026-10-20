import { createBrowserRouter } from "react-router-dom";

import { DashboardPage }
    from "../features/dashboard/pages/DashboardPage";

import { LoginPage }
    from "../features/auth/pages/LoginPage";

import { ProtectedRoute }
    from "../features/auth/components/ProtectedRoute";


import { ProjectsPage }
    from "../features/projects/pages/ProjectsPage";

import { ProjectDetailsPage }
    from "../features/projects/pages/ProjectDetailsPage";


import MaterialsPage
    from "../features/materials/pages/MaterialsPage";

import MaterialDetailsPage
    from "../features/materials/pages/MaterialDetailsPage";

import MaterialRegistrationPage
    from "../features/materials/pages/MaterialRegistrationPage";

import MaterialEditPage
    from "../features/materials/pages/MaterialEditPage";


import PassportPage
    from "../features/passport/pages/PassportPage";

import PassportEditPage
    from "../features/passport/pages/PassportEditPage";


import { RequirementsPage }
    from "../features/requirements/pages/RequirementsPage";

import { RequirementDetailsPage }
    from "../features/requirements/pages/RequirementDetailsPage";


import { MainLayout }
    from "../layouts/MainLayout";


import { MatchesPage }
    from "../features/matching/pages/MatchesPage";

import { MatchDetailsPage }
    from "../features/matching/pages/MatchDetailsPage";

import { MatchingPage }
    from "../features/matching/pages/MatchingPage";

import { RequirementsDashboardPage }
    from "../features/requirements/pages/RequirementsDashboardPage";

import { RecommendationsPage }
    from "../features/recommendations/pages/RecommendationsPage";



export const router = createBrowserRouter([


    {
        path: "/login",
        element: <LoginPage />,
    },



    {
        element: <ProtectedRoute />,

        children: [

            {
                path: "/",

                element: <MainLayout />,

                children: [


                    // Dashboard

                    {
                        index: true,

                        element: <DashboardPage />,
                    },





                    // Projects

                    {
                        path: "projects",

                        element: <ProjectsPage />,
                    },


                    {
                        path: "projects/:projectId",

                        element: <ProjectDetailsPage />,
                    },







                    // Materials

                    {
                        path: "materials",

                        element: <MaterialsPage />,
                    },


                    {
                        path: "materials/new",

                        element: <MaterialRegistrationPage />,
                    },


                    {
                        path: "materials/:materialId",

                        element: <MaterialDetailsPage />,
                    },


                    {
                        path: "materials/:materialId/edit",

                        element: <MaterialEditPage />,
                    },


                    {
                        path: "materials/:materialId/passport",

                        element: <PassportPage />,
                    },


                    {
                        path: "materials/:materialId/passport/edit",

                        element: <PassportEditPage />,
                    },





                    // Requirements Dashboard

                    {
                        path: "requirements",

                        element: <RequirementsDashboardPage />,
                    },

                    {
                        path: "projects/:projectId/requirements",

                        element: <RequirementsPage />,
                    },







                    // Requirement Details

                    {
                        path: "requirements/:requirementId",

                        element: <RequirementDetailsPage />,
                    },








                    // Matching


                    // Matching Dashboard

                    {
                        path: "matching",

                        element: <MatchingPage />,
                    },

                    {
                        path: "requirements/:requirementId/matches",

                        element: <MatchesPage />,
                    },


                    {
                        path: "requirements/:requirementId/matches/:matchId",

                        element: <MatchDetailsPage />,
                    },


                    {
                        path: "recommendations",
                        element: <RecommendationsPage />,
                    },



                ],
            },
        ],
    },

]);