import { z } from "zod";

export const generateRecommendationSchema = z.object({
    params: z.object({
        matchId: z.string().uuid("Invalid match ID"),
    }),
});