import { baseQuery } from "@/services/base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { FaqItem } from "@/types/program";

// Backend response type
type BackendFaqResponse = {
  faq: {
    title: string;
    faqs: {
      uuid: string;
      question: string;
      answer: string;
    }[];
  }[];
}[];

// export type FaqDataTypePayload = {
//   title: string;
//   faq: FaqItem[];
// }

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: baseQuery(),
  tagTypes: ["Faq"],
  endpoints: (builder) => ({
    // GET all FAQ topics for a program
    getAllFaq: builder.query<FaqItem[], string>({
      query: (programUuid) => `/programs/${programUuid}/faqs`,
      transformResponse: (response: BackendFaqResponse): FaqItem[] => {
        // Transform backend response to frontend format
        if (!response || !Array.isArray(response) || response.length === 0) {
          return [];
        }

        const firstItem = response[0];
        if (!firstItem || !firstItem.faq || !Array.isArray(firstItem.faq)) {
          return [];
        }

        return firstItem.faq.map((item) => ({
          id: crypto.randomUUID(), // Generate ID for topic
          title: item.title,
          faqs: (item.faqs || []).map((faqItem) => ({
            id: faqItem.uuid,
            question: faqItem.question,
            answer: faqItem.answer,
          })),
        }));
      },
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Faq" as const,
                id: `${uuid}-${index}`,
              })),
              { type: "Faq", id: "LIST" },
            ]
          : [{ type: "Faq", id: "LIST" }],
    }),

    // UPDATE all FAQs for a program
    updateFaqs: builder.mutation<void, { programUuid: string; faq: FaqItem[] }>(
      {
        query: ({ programUuid, faq }) => {
          // Transform frontend format back to backend format
          const backendPayload = [
            {
              faq: faq.map((item) => ({
                title: item.title,
                faqs: item.faqs.map((faqItem) => ({
                  question: faqItem.question,
                  answer: faqItem.answer,
                })),
              })),
            },
          ];

          return {
            url: `/programs/${programUuid}/faqs`,
            method: "PUT",
            body: backendPayload,
          };
        },
        invalidatesTags: [{ type: "Faq", id: "LIST" }],
      }
    ),
  }),
});

export const { useGetAllFaqQuery, useUpdateFaqsMutation } = faqApi;

