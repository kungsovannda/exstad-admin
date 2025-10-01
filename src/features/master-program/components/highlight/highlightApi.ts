import { baseQuery } from "@/services/base-query";
import { HighlightType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

// Separate type for backend payload
export type HighlightPayload = {
  label: string;
  value: string;
  desc: string;
};

export const highlightsApi = createApi({
  reducerPath: "highlightsApi",
  baseQuery: baseQuery(),
  tagTypes: ["Highlights"],
  endpoints: (builder) => ({
    getAllHighlight: builder.query<HighlightType[], string>({
      query: (programUuid) => `/programs/${programUuid}/highlights`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Highlights" as const,
                id: `${uuid}-${index}`, // unique for caching
              })),
              { type: "Highlights", id: "LIST" },
            ]
          : [{ type: "Highlights", id: "LIST" }],
    }),

    updateHighlights: builder.mutation<
      void, // backend returns nothing
      { programUuid: string; highlights: HighlightPayload[] } // payload type
    >({
      query: ({ programUuid, highlights }) => ({
        url: `/programs/${programUuid}/highlights`,
        method: "PUT",
        body: highlights, // send only what backend expects
      }),
      invalidatesTags: [{ type: "Highlights", id: "LIST" }],
    }),
  }),
});

export const { useGetAllHighlightQuery, useUpdateHighlightsMutation } =
  highlightsApi;
