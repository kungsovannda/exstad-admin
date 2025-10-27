import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { InstructorClassCreate, InstructorClassType, InstructorClassUpdate, InstructorType } from "@/types/opening-program";
import { User } from "@/types/user";
export const InstructorClassApi = createApi({
  reducerPath: "instructorClassApi",
  baseQuery: baseQuery(),
  tagTypes: ["InstructorClass"],
  endpoints: (builder) => ({
    // GET all instructor classes
 // InstructorClassApi.ts
getAllInstructorClasses: builder.query<InstructorClassType[], void>({
  query: () => "/instructor-classes",
  transformResponse: (response: { "instructors-classes": InstructorClassType[] }) =>
    response["instructors-classes"] ?? [],
  providesTags: (result) =>
    result?.length
      ? [
          ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
          { type: "InstructorClass", id: "LIST" },
        ]
      : [{ type: "InstructorClass", id: "LIST" }],
}),

getAllInstructor: builder.query<User[], void>({
  query: () => "/instructor-classes/instructors",
  transformResponse: (response: { "instructors": User[] }) =>
    response["instructors"] ?? [],
  providesTags: (result) =>
    result?.length
      ? [
          ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
          { type: "InstructorClass", id: "LIST" },
        ]
      : [{ type: "InstructorClass", id: "LIST" }],
}),



    // GET all instructor by class UUID
    getAllInstructorByClassUuid: builder.query<InstructorType[], string>({
      query: (classUuid) => `/instructor-classes/classes/${classUuid}/instructors`,
      transformResponse: (response: InstructorType[]) => response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "InstructorClass" as const, id: uuid })),
              { type: "InstructorClass", id: "LIST" },
            ]
          : [{ type: "InstructorClass", id: "LIST" }],
    }),

  getAllInstructorClassesByClassUuid: builder.query<InstructorClassType[], string>({
    query: (classUuid) => `/instructor-classes/by-class-uuid/${classUuid}`,
    transformResponse: (response: { "instructors-classes": InstructorClassType[] }) =>
      response["instructors-classes"] ?? [],
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
    createInstructorClass: builder.mutation<InstructorClassType, InstructorClassCreate>({
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
    deleteInstructorClass: builder.mutation<{ success: boolean; uuid: string }, string>({
      query: (uuid) => ({
        url: `/instructor-classes/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "InstructorClass", id: uuid },
        { type: "InstructorClass", id: "LIST" },
      ],
    }),

    // DELETE scholar class
    removeInstructorFromClass: builder.mutation<{ success: boolean; uuid: string }, string>({
      query: (uuid) => ({
        url: `/instructor-classes/${uuid}/delete`,
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
  useGetAllInstructorClassesQuery,
  useGetAllInstructorByClassUuidQuery,
  useGetAllInstructorQuery,
  useGetAllInstructorClassesByClassUuidQuery,
  useGetScholarClassesByClassUuidQuery,
  useCreateInstructorClassMutation,
  useUpdateScholarClassMutation,
  useDeleteInstructorClassMutation,
  useRemoveInstructorFromClassMutation,

} = InstructorClassApi;
