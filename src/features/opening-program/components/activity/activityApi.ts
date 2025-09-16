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
      query: (programUuid) => `/api/v1/programs/${programUuid}/activities`,
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
      { programUuid: string; activties: ActivityPayload[] } // payload type
    >({
      query: ({ programUuid, activties }) => ({
        url: `/api/v1/programs/${programUuid}/activities`,
        method: "PUT",
        body: activties, // send only what backend expects
      }),
      invalidatesTags: [{ type: "Activities", id: "LIST" }],
    }),
  }),
});

export const { useGetAllActivityQuery, useUpdateActivityMutation } = activityApi;
