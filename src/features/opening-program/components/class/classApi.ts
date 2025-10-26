import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import { ClassCreate, ClassType } from "@/types/opening-program";

export const classApi = createApi({
  reducerPath: "classApi",
  baseQuery: baseQuery(),
  tagTypes: ["Class"],
  endpoints: (builder) => ({
    // ✅ GET all classes
    getAllClasses: builder.query<ClassType[], void>({
      query: () => "/classes",
      transformResponse: (response: { classes?: ClassType[] }) =>
        response.classes ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "Class" as const,
                id: uuid,
              })),
              { type: "Class", id: "LIST" },
            ]
          : [{ type: "Class", id: "LIST" }],
    }),

    // ✅ GET classes by Opening Program Title
    getClassesByOpeningProgram: builder.query<ClassType[], string>({
      query: (openingProgramTitle) =>
        `/classes/opening-program/${encodeURIComponent(openingProgramTitle)}`,
      transformResponse: (response: { classes?: ClassType[] }) =>
        response.classes ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "Class" as const, id: uuid })),
              { type: "Class", id: "LIST" },
            ]
          : [{ type: "Class", id: "LIST" }],
    }),

    // ✅ GET single class by UUID
    getClassByUuid: builder.query<ClassType, { uuid: string }>({
      query: ({ uuid }) => `/classes/${uuid}`,
      providesTags: (result) =>
        result ? [{ type: "Class", id: result.uuid }] : [],
    }),

    // ✅ CREATE class
    createClass: builder.mutation<ClassType, ClassCreate>({
      query: (body) => ({
        url: "/classes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),

    // ✅ UPDATE class
    updateClass: builder.mutation<
      ClassType,
      { uuid: string; body: ClassCreate }
    >({
      query: ({ uuid, body }) => ({
        url: `/classes/${uuid}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Class", id: uuid },
        { type: "Class", id: "LIST" },
      ],
    }),

    // ✅ DELETE class
    deleteClass: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/classes/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Class", id: uuid },
        { type: "Class", id: "LIST" },
      ],
    }),

    softDeleteClass: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/classes/${uuid}/delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Class", id: uuid },
        { type: "Class", id: "LIST" },
      ],
    }),

    getClassByCode: builder.query<ClassType, string>({
  query: (classCode) => `/classes/code/${classCode}`,
  transformResponse: (response: ClassType) => response,
  providesTags: (result) =>
    result ? [{ type: "Class", id: result.uuid }] : [{ type: "Class", id: "LIST" }],
}),

  }),
});

// ✅ Export hooks
export const {
  useGetAllClassesQuery,
  useGetClassesByOpeningProgramQuery,
  useGetClassByUuidQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useSoftDeleteClassMutation,
  useDeleteClassMutation,
  useGetClassByCodeQuery,
} = classApi;
