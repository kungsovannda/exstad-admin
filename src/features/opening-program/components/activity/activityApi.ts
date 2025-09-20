import { useBaseQuery } from "@/services/use-base-query";
import { ActivityType } from "@/types/opening-program";
import { createApi } from "@reduxjs/toolkit/query/react";

// Separate type for backend payload
export type ActivityPayload = {
    title:string;
    description:string;
    image:string;
};

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Activities"],
  endpoints: (builder) => ({
    getAllActivity: builder.query<ActivityType[], string>({
      query: (openingProgramUuid) => `/api/v1/opening-programs/${openingProgramUuid}/activities`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Activities" as const,
                id: `${uuid}-${index}`, // unique for caching
              })),
              { type: "Activities", id: "LIST" },
            ]
          : [{ type: "Activities", id: "LIST" }],
    }),
 
    updateActivity: builder.mutation<
      void, // backend returns nothing
      { openingProgramUuid: string; activities: ActivityPayload[] } // payload type
    >({
      query: ({ openingProgramUuid, activities }) => ({
        url: `/api/v1/opening-programs/${openingProgramUuid}/activities`,
        method: "PUT",
        body: activities, // send only what backend expects
      }),
      invalidatesTags: [{ type: "Activities", id: "LIST" }],
    }),
  }),
});

export const { useGetAllActivityQuery, useUpdateActivityMutation } = activityApi;
