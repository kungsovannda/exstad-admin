import { useBaseQuery } from "@/services/use-base-query";
import { HighlightType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Faq"],
  endpoints: (builder) => ({
    getAllFaq: builder.query<HighlightType[], string>({
      query: (programUuid) => `/api/v1/programs/${programUuid}/faqs`,
      // no transformResponse needed, backend already returns an array
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Faq" as const,
                id: `${uuid}-${index}`, // unique id
              })),
              { type: "Faq", id: "LIST" },
            ]
          : [{ type: "Faq", id: "LIST" }],
    }),
  }),
});

export const { useGetAllFaqQuery } = faqApi;
