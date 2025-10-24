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
      invalidatesTags: [{ type: "Enrollment", id: "LIST" }],
    }),

    // 📋 GET all enrollments
    getAllEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments",
      transformResponse: (response: { enrollments?: Enrollment[] }) =>
        response.enrollments ?? [],
      providesTags: (result) =>
        result
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    // 🏅 GET all achieved enrollments
    getAllAchievedEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/achieved",
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    // ✅ GET all passed enrollments
    getAllPassedEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/passed",
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    // 🔍 GET enrollment by UUID
    getEnrollmentByUuid: builder.query<Enrollment, string>({
      query: (uuid) => `/enrollments/${uuid}`,
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
      // Invalidate both the specific enrollment and all lists
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Enrollment", id: uuid },
        { type: "Enrollment", id: "LIST" },
      ],
    }),

    // 🎓 MARK enrollment as scholar
    markIsScholar: builder.mutation<Enrollment, string>({
      query: (uuid) => ({
        url: `/enrollments/${uuid}/is-scholar`,
        method: "PUT",
      }),
      // Invalidate the specific enrollment and all lists to refresh data
      invalidatesTags: (result, error, uuid) => [
        { type: "Enrollment", id: uuid },
        { type: "Enrollment", id: "LIST" },
      ],
    }),

    // 📝 SET score exam for scholar
    setScoreExamScholar: builder.mutation<
      Enrollment,
      { uuid: string; body: { score: number } }
    >({
      query: ({ uuid, body }) => ({
        url: `/enrollments/${uuid}/score-exam`,
        method: "PUT",
        body,
      }),
      // Invalidate the specific enrollment and all lists to refresh data
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Enrollment", id: uuid },
        { type: "Enrollment", id: "LIST" },
      ],
    }),

    // 🧭 GET enrollments by opening program
    getAllEnrollmentsByProgram: builder.query<Enrollment[], string>({
      query: (uuid) => `/enrollments/${uuid}/all`,
      transformResponse: (response: { enrollments?: Enrollment[] }) =>
        response.enrollments ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    getAllInterviewedByProgram: builder.query<Enrollment[], string>({
      query: (uuid) => `/enrollments/${uuid}/interviewed`,
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    getAllAchievedByProgram: builder.query<Enrollment[], string>({
      query: (uuid) => `/enrollments/${uuid}/achieved`,
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    getAllPassedByProgram: builder.query<Enrollment[], string>({
      query: (uuid) => `/enrollments/${uuid}/passed`,
      transformResponse: (response: Enrollment[]) => response ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Enrollment" as const,
                id: uuid,
              })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
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
  useMarkIsScholarMutation,
  useSetScoreExamScholarMutation,
  useGetAllEnrollmentsByProgramQuery,
  useGetAllInterviewedByProgramQuery,
  useGetAllAchievedByProgramQuery,
  useGetAllPassedByProgramQuery,
} = enrollmentApi;
