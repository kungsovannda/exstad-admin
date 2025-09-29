// src/features/university/universityApi.ts
import { baseQuery } from "@/services/base-query";
import {
  University,
  UniversityCreate,
  UniversityUpdate,
} from "@/types/university";
import { createApi } from "@reduxjs/toolkit/query/react";

export const universityApi = createApi({
  reducerPath: "universityApi",
  baseQuery: baseQuery(),
  tagTypes: ["University"],
  endpoints: (builder) => ({
    // GET all universities
    getAllUniversities: builder.query<University[], void>({
      query: () => "/api/v1/universities",
      transformResponse: (response: { universities?: University[] }) =>
        response.universities ?? [], // always return an array
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({ type: "University" as const, id: uuid })),
              { type: "University", id: "LIST" },
            ]
          : [{ type: "University", id: "LIST" }],
    }),

    // GET a single university by UUID
    getUniversityByUuid: builder.query<University, string>({
      query: (uuid) => `/api/v1/universities/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "University", id: uuid }],
    }),

    // CREATE a new university
    createUniversity: builder.mutation<University, UniversityCreate>({
      query: (body) => ({
        url: "/api/v1/universities",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "University", id: "LIST" }],
    }),

    // UPDATE an existing university
    updateUniversity: builder.mutation<
      University,
      { uuid: string; body: UniversityUpdate }
    >({
      query: ({ uuid, body }) => ({
        url: `/api/v1/universities/${uuid}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: "University", id: uuid }],
    }),

    // DELETE a university
    deleteUniversity: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/api/v1/universities/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "University", id: uuid },
        { type: "University", id: "LIST" },
      ],
    }),
  }),
});
export const {
  useGetAllUniversitiesQuery,
  useGetUniversityByUuidQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useDeleteUniversityMutation,
} = universityApi;
