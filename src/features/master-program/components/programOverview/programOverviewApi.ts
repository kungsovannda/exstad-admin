import { baseQuery } from "@/services/base-query";
import { programOverviewType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

// Separate type for backend payload
export type ProgramOverviewsPayload = {
  title: string;
  description: string;
};

export const programOverviewsApi = createApi({
  reducerPath: "programOverviewApi",
  baseQuery: baseQuery(),
  tagTypes: ["ProgramOverviews"],
  endpoints: (builder) => ({
    getAllProgramOverview: builder.query<programOverviewType[], string>({
      query: (programUuid) => `/programs/${programUuid}/program-overviews`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "ProgramOverviews" as const,
                id: `${uuid}-${index}`, // unique for caching
              })),
              { type: "ProgramOverviews", id: "LIST" },
            ]
          : [{ type: "ProgramOverviews", id: "LIST" }],
    }),

    updateProgramOverview: builder.mutation<
      void, // backend returns nothing
      { programUuid: string; programOverviews: ProgramOverviewsPayload[] } // payload type
    >({
      query: ({ programUuid, programOverviews }) => ({
        url: `/programs/${programUuid}/program-overviews`,
        method: "PUT",
        body: programOverviews, // send only what backend expects
      }),
      invalidatesTags: [{ type: "ProgramOverviews", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllProgramOverviewQuery,
  useUpdateProgramOverviewMutation,
} = programOverviewsApi;
