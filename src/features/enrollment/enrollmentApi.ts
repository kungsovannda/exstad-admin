import { baseQuery } from "@/services/base-query";
import {
  Enrollment,
  CreateEnrollment,
  UpdateEnrollment,
} from "@/types/enrollment";
import { createApi } from "@reduxjs/toolkit/query/react";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: baseQuery(),
  tagTypes: ["Enrollment"],
  endpoints: (builder) => ({
    // 🧾 CREATE new enrollment
    createEnrollment: builder.mutation<Enrollment, CreateEnrollment>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      transformResponse: (response: Enrollment) => response,
      invalidatesTags: [{ type: "Enrollment", id: "LIST" }],
    }),

    // 📋 GET all enrollments
    getAllEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments",
      transformResponse: (response: { enrollments?: Enrollment[] }) =>
        response.enrollments ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    // 🎤 GET all interviewed enrollments
    getAllInterviewedEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/interviewed",
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: [{ type: "Enrollment", id: "LIST" }],
    }),

    // 🏅 GET all achieved enrollments
    getAllAchievedEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/achieved",
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: [{ type: "Enrollment", id: "LIST" }],
    }),

    // ✅ GET all passed enrollments
    getAllPassedEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/passed",
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: [{ type: "Enrollment", id: "LIST" }],
    }),

    // 🔍 GET enrollment by UUID
    getEnrollmentByUuid: builder.query<Enrollment, string>({
      query: (uuid) => `/enrollments/${uuid}`,
      transformResponse: (response: Enrollment) => response,
      providesTags: (result, error, uuid) => [{ type: "Enrollment", id: uuid }],
    }),

    // ✏️ UPDATE enrollment by UUID
    updateEnrollment: builder.mutation<
      Enrollment,
      { uuid: string; body: UpdateEnrollment }
    >({
      query: ({ uuid, body }) => ({
        url: `/enrollments/${uuid}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: Enrollment) => response,
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Enrollment", id: uuid },
        { type: "Enrollment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useGetAllEnrollmentsQuery,
  useGetAllInterviewedEnrollmentsQuery,
  useGetAllAchievedEnrollmentsQuery,
  useGetAllPassedEnrollmentsQuery,
  useGetEnrollmentByUuidQuery,
  useUpdateEnrollmentMutation,
} = enrollmentApi;
