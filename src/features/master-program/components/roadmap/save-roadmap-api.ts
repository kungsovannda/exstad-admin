import { baseQuery } from "@/services/base-query"
import { createApi } from "@reduxjs/toolkit/query/react"
import type { RoadmapPayload, RoadmapResponse } from "@/types/roadmap/roadmap"

/**
 * Program types supported by this API slice.
 * Can be "programs" or "opening-programs" for now.
 * Adding new program types in the future is easy.
 */
type ProgramType = "programs" | "opening-programs"

/**
 * RTK Query API slice for managing roadmaps for both programs and opening-programs.
 * Supports GET and PUT endpoints for fetching and updating roadmaps.
 *
 * Endpoints:
 * GET  /{programType}/{programUuid}/roadmaps
 * PUT  /{programType}/{programUuid}/roadmaps
 *
 * Hooks exported:
 * - useGetAllRoadmapsQuery
 * - useUpdateRoadmapsMutation
 */
export const roadmapApi = createApi({
  reducerPath: "roadmapApi", // The key in Redux store
  baseQuery: baseQuery(), // Base query with common config (base URL, headers, etc.)
  tagTypes: ["Roadmaps"], // Cache tag for invalidation
  endpoints: (builder) => ({
    /**
     * GET all roadmaps for a given program type and UUID
     *
     * @param programType "programs" | "opening-programs"
     * @param programUuid string
     * @returns RoadmapResponse
     *
     * Example usage:
     * useGetAllRoadmapsQuery({ programType: "programs", programUuid: "abc-123" })
     */
    getAllRoadmaps: builder.query<
      RoadmapResponse,
      { programType: ProgramType; programUuid: string }
    >({
      query: ({ programType, programUuid }) => `/${programType}/${programUuid}/roadmaps`,
      providesTags: (result, error, { programType, programUuid }) =>
        result
          ? [
              // Tag each roadmap individually for fine-grained cache invalidation
              ...result.map((_, index) => ({
                type: "Roadmaps" as const,
                id: `${programType}-${programUuid}-${index}`,
              })),
              // Tag the full list for general invalidation after updates
              { type: "Roadmaps", id: `${programType}-${programUuid}-LIST` },
            ]
          : [{ type: "Roadmaps", id: `${programType}-${programUuid}-LIST` }],
    }),

    /**
     * PUT / update roadmaps for a given program type and UUID
     *
     * @param programType "programs" | "opening-programs"
     * @param programUuid string
     * @param roadmaps RoadmapPayload
     *
     * Example usage:
     * useUpdateRoadmapsMutation()({ programType: "opening-programs", programUuid: "xyz-456", roadmaps: newRoadmaps })
     */
    updateRoadmaps: builder.mutation<
      void,
      { programType: ProgramType; programUuid: string; roadmaps: RoadmapPayload }
    >({
      query: ({ programType, programUuid, roadmaps }) => ({
        url: `/${programType}/${programUuid}/roadmaps`,
        method: "PUT",
        body: roadmaps,
      }),
      invalidatesTags: (result, error, { programType, programUuid }) => [
        // Invalidate the list tag so GET query refetches updated data
        { type: "Roadmaps", id: `${programType}-${programUuid}-LIST` },
      ],
    }),
  }),
})

/**
 * Exported React hooks for usage in components
 */
export const { useGetAllRoadmapsQuery, useUpdateRoadmapsMutation } = roadmapApi
