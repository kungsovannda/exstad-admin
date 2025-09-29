  import { useBaseQuery } from "@/services/use-base-query";
import {  TimelineType } from "@/types/opening-program";
import { createApi } from "@reduxjs/toolkit/query/react";

// Separate type for backend payload

export type TimelinePayload = {
    title:string;
    startDate:string;
    endDate:string;
};

export const TimelineApi = createApi({
  reducerPath: "timelineApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Timelines"],
  endpoints: (builder) => ({
    getAllTimeline: builder.query<TimelineType[], string>({
      query: (openingProgramUuid) => `/opening-programs/${openingProgramUuid}/timelines`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Timelines" as const,
                id: `${uuid}-${index}`, // unique for caching
              })),
              { type: "Timelines", id: "LIST" },
            ]
          : [{ type: "Timelines", id: "LIST" }],
    }),

    updateTimeline: builder.mutation<
      void, // backend returns nothing
      { openingProgramUuid: string; timelines: TimelinePayload[] } // payload type
    >({
      query: ({ openingProgramUuid, timelines }) => ({
        url: `/opening-programs/${openingProgramUuid}/timelines`,
        method: "PUT",
        body: timelines, // send only what backend expects
      }),
      invalidatesTags: [{ type: "Timelines", id: "LIST" }],
    }),
  }),
});

export const { useGetAllTimelineQuery, useUpdateTimelineMutation } = TimelineApi;
