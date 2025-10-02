import { baseQuery } from "@/services/base-query";
import { LearningOutcomeType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

// --- Payload type for backend ---
export type LearningOutcomesPayload = {
  title: string;
  subtitle?: string;
  description: string[]; // sections
};

export const learningOutcomesApi = createApi({
  reducerPath: "learningOutcomesApi",
  baseQuery: baseQuery(),
  tagTypes: ["LearningOutcomes"],
  endpoints: (builder) => ({
    // --- GET all learning outcomes ---
    getAllLearningOutcomes: builder.query<LearningOutcomeType[], string>({
      query: (programUuid) => `/programs/${programUuid}/learning-outcomes`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "LearningOutcomes" as const,
                id: `${uuid}-${index}`,
              })),
              { type: "LearningOutcomes", id: "LIST" },
            ]
          : [{ type: "LearningOutcomes", id: "LIST" }],
    }),

    // --- UPDATE learning outcomes (replace full array) ---
    updateLearningOutcomes: builder.mutation<
      void,
      { programUuid: string; learningOutcomes: LearningOutcomesPayload[] }
    >({
      query: ({ programUuid, learningOutcomes }) => ({
        url: `/programs/${programUuid}/learning-outcomes`,
        method: "PUT",
        body: learningOutcomes, // ✅ send actual payload
      }),
      invalidatesTags: [{ type: "LearningOutcomes", id: "LIST" }],
    }),

    // --- UPDATE single learning outcome sections ---
    // updateLearningOutcomeSections: builder.mutation<
    //   void,
    //   {
    //     programUuid: string;
    //     reqIndex: number; // index of learning outcome in array
    //     sectionData: { title: string };
    //     isEdit?: boolean;
    //     sectionIndex?: number; // for editing existing section
    //   }
    // >({
    //   query: ({ programUuid, reqIndex, sectionData, isEdit, sectionIndex }) => ({
    //     url: `/programs/${programUuid}/learning-outcomes/sections`,
    //     method: "PUT",
    //     body: { reqIndex, sectionData, isEdit, sectionIndex },
    //   }),
    //   invalidatesTags: [{ type: "LearningOutcomes", id: "LIST" }],
    // }),
  }),
});

export const {
  useGetAllLearningOutcomesQuery,
  useUpdateLearningOutcomesMutation,
  // useUpdateLearningOutcomeSectionsMutation,
} = learningOutcomesApi;
