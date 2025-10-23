import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { ScholarClassCreate, ScholarClassType, ScholarClassUpdate } from "@/types/opening-program";

export const ScholarClassApi = createApi({
  reducerPath: "scholarClassApi",
  baseQuery: baseQuery(),
  tagTypes: ["ScholarClass"],
  endpoints: (builder) => ({
    // GET all scholar classes
   getAllScholarClasses: builder.query<ScholarClassType[], void>({
  query: () => "/scholar-classes",
  transformResponse: (response: { "scholar-classes"?: ScholarClassType[] }) =>
    response["scholar-classes"] ?? [],
  providesTags: (result) =>
    result?.length
      ? [
          ...result.map(({ uuid }) => ({ type: "ScholarClass" as const, id: uuid })),
          { type: "ScholarClass", id: "LIST" },
        ]
      : [{ type: "ScholarClass", id: "LIST" }],
}),


    // GET all scholars by class UUID
    getScholarByClassUuid: builder.query<ScholarClassType[], string>({
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

    // GET all scholar class by class UUID
       getScholarClassesByClassUuid: builder.query<ScholarClassType[], string>({
      query: (classUuid) => `/scholar-classes/classes/${classUuid}/scholar-classes`,
      transformResponse: (response: ScholarClassType[]) => response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "ScholarClass" as const, id: uuid })),
              { type: "ScholarClass", id: "LIST" },
            ]
          : [{ type: "ScholarClass", id: "LIST" }],
    }),

  getScholarClassesByClassCode: builder.query<ScholarClassType[], string>({
  query: (classCode) => `/scholar-classes/by-class-code/${classCode}`,
  transformResponse: (response: { "scholar-classes": ScholarClassType[] }) =>
    response["scholar-classes"] || [],
  providesTags: (result) =>
    result?.length
      ? [
          ...result.map(({ uuid }) => ({ type: "ScholarClass" as const, id: uuid })),
          { type: "ScholarClass", id: "LIST" },
        ]
      : [{ type: "ScholarClass", id: "LIST" }],
}),

    // CREATE scholar class
    createScholarClass: builder.mutation<ScholarClassType, ScholarClassCreate>({
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
  useGetScholarByClassUuidQuery,
  useGetScholarClassesByClassUuidQuery,
  useGetScholarClassesByClassCodeQuery,
  useCreateScholarClassMutation,
  useUpdateScholarClassMutation,
  useDeleteScholarClassMutation,

} = ScholarClassApi;
