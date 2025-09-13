import { useBaseQuery } from "@/services/use-base-query";
import { CurriculumType, HighlightType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

export const curriculumApi = createApi({
  reducerPath: "curriculumApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Curriculums"],
  endpoints: (builder) => ({
    getAllCurriculum: builder.query<CurriculumType[], string>({
      query: (programUuid) => `/api/v1/programs/${programUuid}/curriculums`,
      // no transformResponse needed, backend already returns an array
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Curriculums" as const,
                id: `${uuid}-${index}`, // unique id
              })),
              { type: "Curriculums", id: "LIST" },
            ]
          : [{ type: "Curriculums", id: "LIST" }],
    }),
  }),
});

export const { useGetAllCurriculumQuery } = curriculumApi;
