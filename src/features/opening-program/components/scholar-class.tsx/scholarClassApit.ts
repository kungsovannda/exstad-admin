import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { SCholarClassCreate, ScholarClassType, ScholarClassUpdate } from "@/types/opening-program";

export const ScholarClassApi = createApi({
  reducerPath: "scholarClassApi",
  baseQuery: baseQuery(),
  tagTypes: ["ScholarClass"],
  endpoints: (builder) => ({
    // GET all scholar classes
    getAllScholarClasses: builder.query<ScholarClassType[], void>({
      query: () => "/scholar-classes",
      transformResponse: (response: { classes?: ScholarClassType[] }) =>
        response.classes ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "ScholarClass" as const, id: uuid })),
              { type: "ScholarClass", id: "LIST" },
            ]
          : [{ type: "ScholarClass", id: "LIST" }],
    }),

    // GET all scholars by class UUID
    getScholarClassesByClassUuid: builder.query<ScholarClassType[], string>({
      query: (classUuid) => `/scholar-classes/classes/${classUuid}/scholars`,
      transformResponse: (response: ScholarClassType[]) => response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "ScholarClass" as const, id: uuid })),
              { type: "ScholarClass", id: "LIST" },
            ]
          : [{ type: "ScholarClass", id: "LIST" }],
    }),

    // CREATE scholar class
    createScholarClass: builder.mutation<ScholarClassType, SCholarClassCreate>({
      query: (body) => ({
        url: "/scholar-classes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ScholarClass", id: "LIST" }],
    }),

    // UPDATE scholar class
   updateScholarClass: builder.mutation<ScholarClassType, { uuid: string; body: ScholarClassUpdate }>({
  query: ({ uuid, body }) => ({
    url: `/scholar-classes/${uuid}`,
    method: "PUT",
    body,
  }),
  invalidatesTags: (result, error, { uuid }) => [
    { type: "ScholarClass", id: uuid },
    { type: "ScholarClass", id: "LIST" },
  ],
}),

    // DELETE scholar class
    deleteScholarClass: builder.mutation<{ success: boolean; uuid: string }, string>({
      query: (uuid) => ({
        url: `/scholar-classes/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "ScholarClass", id: uuid },
        { type: "ScholarClass", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllScholarClassesQuery,
  useGetScholarClassesByClassUuidQuery,
  useCreateScholarClassMutation,
  useUpdateScholarClassMutation,
  useDeleteScholarClassMutation,
} = ScholarClassApi;
