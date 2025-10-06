import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { ScholarClassType } from "@/types/opening-program";

export const ScholarClassApi = createApi({
  reducerPath: "scholarClassApi",
  baseQuery: baseQuery(),
  tagTypes: ["ScholarClass"],
  endpoints: (builder) => ({
    // ✅ GET all classes
    getAllScholarClasses: builder.query<ScholarClassType[], void>({
      query: () => "/scholar-classes",
      transformResponse: (response: { classes?: ScholarClassType[] }) =>
        response.classes ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "ScholarClass" as const,
                id: uuid,
              })),
              { type: "ScholarClass", id: "LIST" },
            ]
          : [{ type: "ScholarClass", id: "LIST" }],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllScholarClassesQuery,
} = ScholarClassApi;
