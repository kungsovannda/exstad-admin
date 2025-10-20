/**
 * API slice for managing roadmaps (get, update).
 * Add more endpoints as needed (e.g., POST, DELETE).
 */
/**
 * Endpoints:
 * GET    {{spring-local}}/api/v1/programs/{{uuid}}/roadmaps
 * PUT    {{spring-local}}/api/v1/programs/{{uuid}}/roadmaps
 *
 * Usage:
 * export const {
 *   useGetAllRoadmapsQuery,
 *   useUpdateRoadmapsMutation,
 * } = roadmapApi;
 *
 * // For program overviews:
 * export const {
 *   useGetAllProgramOverviewQuery,
 *   useUpdateProgramOverviewMutation,
 * } = programOverviewsApi;
 */
import { baseQuery } from "@/services/base-query"
import { createApi } from "@reduxjs/toolkit/query/react"

// Type for backend payload
export type RoadmapPayload = {
  title: string
  description: string
  // Add other fields as needed
}

// Define the type for a Roadmap as returned by the backend
export type RoadmapType = {
  title: string
  description: string
  // Add other fields as needed to match the backend response
}

export const roadmapApi = createApi({
  reducerPath: "roadmapApi",
  baseQuery: baseQuery(),
  tagTypes: ["Roadmaps"],
  endpoints: (builder) => ({
    getAllRoadmaps: builder.query<RoadmapType[], string>({
      query: (programUuid) => `/programs/${programUuid}/roadmaps`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Roadmaps" as const,
                id: `${uuid}-${index}`,
              })),
              { type: "Roadmaps", id: "LIST" },
            ]
          : [{ type: "Roadmaps", id: "LIST" }],
    }),

    updateRoadmaps: builder.mutation<void, { programUuid: string; roadmaps: RoadmapPayload[] }>({
      query: ({ programUuid, roadmaps }) => ({
        url: `/programs/${programUuid}/roadmaps`,
        method: "PUT",
        body: roadmaps,
      }),
      invalidatesTags: [{ type: "Roadmaps", id: "LIST" }],
    }),
  }),
})

export const { useGetAllRoadmapsQuery, useUpdateRoadmapsMutation } = roadmapApi
