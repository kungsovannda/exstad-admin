import { useBaseQuery } from "@/services/use-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { FaqType, FaqDataType } from "@/types/program"; // use your types

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Faq"],
  endpoints: (builder) => ({
    // GET all FAQ topics for a program
    getAllFaq: builder.query<FaqDataType[], string>({
      query: (programUuid) => `/api/v1/programs/${programUuid}/faqs`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((topic) => ({ type: "Faq" as const, id: topic.id })),
              { type: "Faq", id: "LIST" },
            ]
          : [{ type: "Faq", id: "LIST" }],
    }),

    // UPDATE all FAQs for a program
    updateFaqs: builder.mutation<
      void, // backend returns nothing
      { programUuid: string; faq: FaqDataType[] } // backend expects full array
    >({
      query: ({ programUuid, faq }) => ({
        url: `/api/v1/programs/${programUuid}/faqs`,
        method: "PUT",
        body: faq,
      }),
      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),
  }),
});

export const { useGetAllFaqQuery, useUpdateFaqsMutation } = faqApi;
