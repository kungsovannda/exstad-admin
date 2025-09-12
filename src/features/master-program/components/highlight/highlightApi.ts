import { useBaseQuery } from "@/services/use-base-query";
import { HighlightType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

export const highlightsApi = createApi({
  reducerPath: "highlightsApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Highlights"],
  endpoints: (builder) => ({
    getAllHighlight: builder.query<HighlightType[], string>({
      query: (programUuid) => `/api/v1/programs/${programUuid}/highlights`,
      // no transformResponse needed, backend already returns an array
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Highlights" as const,
                id: `${uuid}-${index}`, // unique id
              })),
              { type: "Highlights", id: "LIST" },
            ]
          : [{ type: "Highlights", id: "LIST" }],
    }),
  }),
});

export const { useGetAllHighlightQuery } = highlightsApi;
