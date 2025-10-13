import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { InstructorClassCreate, InstructorClassType, InstructorClassUpdate } from "@/types/opening-program";
export const InstructorClassApi = createApi({
  reducerPath: "instructorClassApi",
  baseQuery: baseQuery(),
  tagTypes: ["InstructorClass"],
  endpoints: (builder) => ({
    // GET all instructor classes
    getAllScholarClasses: builder.query<InstructorClassType[], void>({
      query: () => "/instructor-classes",
      transformResponse: (response: { classes?: InstructorClassType[] }) =>
        response.classes ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
              { type: "InstructorClass", id: "LIST" },
            ]
          : [{ type: "InstructorClass", id: "LIST" }],
    }),


    // GET all scholars by class UUID
    getScholarByClassUuid: builder.query<InstructorClassType[], string>({
      query: (classUuid) => `/instructor    -classes/classes/${classUuid}/scholars`,
      transformResponse: (response: InstructorClassType[]) => response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
              { type: "InstructorClass", id: "LIST" },
            ]
          : [{ type: "InstructorClass", id: "LIST" }],
    }),

    // GET all scholar class by class UUID
       getScholarClassesByClassUuid: builder.query<InstructorClassType[], string>({
      query: (classUuid) => `/scholar-classes/classes/${classUuid}/scholar-classes`,
      transformResponse: (response: InstructorClassType[]) => response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
              { type: "InstructorClass", id: "LIST" },
            ]
          : [{ type: "InstructorClass", id: "LIST" }],
    }),
    // CREATE scholar class
    createScholarClass: builder.mutation<InstructorClassType, InstructorClassCreate>({
      query: (body) => ({
        url: "/instructor-classes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "InstructorClass", id: "LIST" }],
    }),

    // UPDATE scholar class
   updateScholarClass: builder.mutation<InstructorClassType, { uuid: string; body: InstructorClassUpdate }>({
  query: ({ uuid, body }) => ({
    url: `/scholar-classes/${uuid}`,
    method: "PUT",
    body,
  }),
  invalidatesTags: (result, error, { uuid }) => [
    { type: "InstructorClass", id: uuid },
    { type: "InstructorClass", id: "LIST" },
  ],
}),

    // DELETE scholar class
    deleteScholarClass: builder.mutation<{ success: boolean; uuid: string }, string>({
      query: (uuid) => ({
        url: `/scholar-classes/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "InstructorClass", id: uuid },
        { type: "InstructorClass", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllScholarClassesQuery,
  useGetScholarByClassUuidQuery,
  useGetScholarClassesByClassUuidQuery,
  useCreateScholarClassMutation,
  useUpdateScholarClassMutation,
  useDeleteScholarClassMutation,

} = InstructorClassApi;
