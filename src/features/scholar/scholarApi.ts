import { baseQuery } from "@/services/base-query";
import {
  Scholar,
  CreateScholar,
  UpdateScholar,
  CreateScholarSocialLink,
  ScholarSocialLink,
  ScholarCareerSetUp,
  ScholarSpecialistSetUp,
} from "@/types/scholar";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface ScholarApiResponse {
  "opening-program-scholars": Scholar[];
}

export const scholarApi = createApi({
  reducerPath: "scholarApi",
  baseQuery: baseQuery(),
  tagTypes: [
    "Scholar",
    "ScholarSocialLink",
    "ScholarCareer",
    "ScholarSpecialist",
  ],
  endpoints: (builder) => ({
    // GET all scholars
    getAllScholars: builder.query<Scholar[], void>({
      query: () => "/scholars",
      transformResponse: (response: { scholars: Scholar[] }) =>
        response.scholars,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Scholar" as const,
                id: uuid,
              })),
              { type: "Scholar", id: "LIST" },
            ]
          : [{ type: "Scholar", id: "LIST" }],
    }),

    // GET scholars by status
    getScholarsByStatus: builder.query<Scholar[], string>({
      query: (status) => `/scholars/status/${status}`,
      transformResponse: (response: { scholars: Scholar[] }) =>
        response.scholars,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // GET scholar by uuid
    getScholarByUuid: builder.query<Scholar, string>({
      query: (uuid) => `/scholars/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Scholar", id: uuid }],
    }),

    // GET scholar by username
    getScholarByUsername: builder.query<Scholar, string>({
      query: (username) => `/scholars/username/${username}`,
      providesTags: (result, error, username) =>
        result
          ? [
              { type: "Scholar", id: result.uuid }, // Use the actual UUID from result
              { type: "Scholar", id: "LIST" },
            ]
          : [{ type: "Scholar", id: "LIST" }],
    }),

    // Search scholars
    searchScholars: builder.query<
      Scholar[],
      { username?: string; name?: string }
    >({
      query: ({ username = "", name = "" }) =>
        `/scholars/search?username=${username}&name=${name}`,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // Count scholars
    countScholars: builder.query<number, void>({
      query: () => "/scholars/count",
      transformResponse: (response: { scholars: number }) => response.scholars,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // Create single scholar
    createScholar: builder.mutation<Scholar, CreateScholar>({
      query: (body) => ({
        url: "/scholars",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // Create multiple scholars
    createMultipleScholars: builder.mutation<Scholar[], CreateScholar[]>({
      query: (body) => ({
        url: "/scholars/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // Update scholar
    updateScholar: builder.mutation<
      Scholar,
      { uuid: string; body: UpdateScholar }
    >({
      query: ({ uuid, body }) => ({
        url: `/scholars/${uuid}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Scholar", id: uuid },
      ],
    }),

    // Get "me"
    getMe: builder.query<Scholar, void>({
      query: () => "/scholars/me",
      providesTags: [{ type: "Scholar", id: "me" }],
    }),

    // Update "me"
    updateMe: builder.mutation<Scholar, UpdateScholar>({
      query: (body) => ({
        url: "/scholars/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Scholar", id: "me" }],
    }),

    // Scholar social links
    getScholarSocialLinks: builder.query<ScholarSocialLink[], string>({
      query: (uuid) => `/scholars/${uuid}/social-links`,
      providesTags: (result, error, uuid) => [
        { type: "ScholarSocialLink", id: `scholar-${uuid}` },
      ],
    }),

    addScholarSocialLink: builder.mutation<
      ScholarSocialLink,
      { uuid: string; body: CreateScholarSocialLink }
    >({
      query: ({ uuid, body }) => ({
        url: `/scholars/${uuid}/social-links`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "ScholarSocialLink", id: `scholar-${uuid}` },
      ],
    }),

    updateSocialLinkStatus: builder.mutation<
      ScholarSocialLink,
      { scholarUuid: string; socialLinkUuid: string; status: boolean }
    >({
      query: ({ scholarUuid, socialLinkUuid, status }) => ({
        url: `/scholars/${scholarUuid}/social-link/${socialLinkUuid}`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "ScholarSocialLink", id: `scholar-${scholarUuid}` },
      ],
    }),

    deleteSocialLink: builder.mutation<
      void,
      { scholarUuid: string; socialLinkUuid: string }
    >({
      query: ({ scholarUuid, socialLinkUuid }) => ({
        url: `/scholars/${scholarUuid}/social-link/${socialLinkUuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "ScholarSocialLink", id: `scholar-${scholarUuid}` },
      ],
    }),

    // Soft delete
    softDeleteScholar: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/soft-delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Restore
    restoreScholar: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/restore`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Hard delete
    hardDeleteScholar: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Scholars by opening program
    getAllScholarsByOpeningProgramUuid: builder.query<Scholar[], string>({
      query: (openingProgramUuid) => {
        return `/scholars/${openingProgramUuid}/opening-program`;
      },
      transformResponse: (response: unknown): Scholar[] => {
        // 1) If API returns { "opening-program-scholars": [...] }
        if (
          response &&
          typeof response === "object" &&
          !Array.isArray(response) &&
          (response as Record<string, unknown>)["opening-program-scholars"]
        ) {
          const arr = (response as Record<string, unknown>)[
            "opening-program-scholars"
          ];
          if (Array.isArray(arr)) return arr as Scholar[];
        }

        // 2) If API returns an array
        if (Array.isArray(response)) {
          return response as Scholar[];
        }

        // 3) If API returns a single scholar object
        if (response && typeof response === "object") {
          const obj = response as Partial<Scholar>;
          if (typeof obj.uuid === "string") {
            return [obj as Scholar];
          }
        }

        // 4) Fallback
        return [];
      },
      providesTags: ["Scholar"],
    }),

    // Mark a course as completed for a scholar
    markCompletedCourse: builder.mutation<
      Scholar,
      { scholarUuid: string; openingProgramUuid: string }
    >({
      query: ({ scholarUuid, openingProgramUuid }) => ({
        url: `/scholars/${scholarUuid}/completed-course/${openingProgramUuid}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "Scholar", id: scholarUuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),
    // Mark a course as completed for a scholar
    removeCompletedCourse: builder.mutation<
      Scholar,
      { scholarUuid: string; openingProgramUuid: string }
    >({
      query: ({ scholarUuid, openingProgramUuid }) => ({
        url: `/scholars/${scholarUuid}/remove-completed-course/${openingProgramUuid}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "Scholar", id: scholarUuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Assign careers to scholar
    assignCareers: builder.mutation<
      Scholar,
      { scholarUuid: string; careerSetups: ScholarCareerSetUp[] }
    >({
      query: ({ scholarUuid, careerSetups }) => ({
        url: `/scholars/assign-careers/${scholarUuid}`,
        method: "PUT",
        body: careerSetups,
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "Scholar", id: scholarUuid },
        { type: "ScholarCareer", id: `scholar-${scholarUuid}` },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Get careers by scholar uuid
    getCareersByScholarUuid: builder.query<ScholarCareerSetUp[], string>({
      query: (scholarUuid) => `/scholars/careers/${scholarUuid}`,
      providesTags: (result, error, scholarUuid) => [
        { type: "ScholarCareer", id: `scholar-${scholarUuid}` },
      ],
    }),

    // Assign specialists to scholar
    assignSpecialists: builder.mutation<
      Scholar,
      { scholarUuid: string; specialistSetups: ScholarSpecialistSetUp[] }
    >({
      query: ({ scholarUuid, specialistSetups }) => ({
        url: `/scholars/assign-specialists/${scholarUuid}`,
        method: "PUT",
        body: specialistSetups,
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "Scholar", id: scholarUuid },
        { type: "ScholarSpecialist", id: `scholar-${scholarUuid}` },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // Get specialists by scholar uuid
    getSpecialistsByScholarUuid: builder.query<
      ScholarSpecialistSetUp[],
      string
    >({
      query: (scholarUuid) => `/scholars/specialists/${scholarUuid}`,
      providesTags: (result, error, scholarUuid) => [
        { type: "ScholarSpecialist", id: `scholar-${scholarUuid}` },
      ],
    }),
    // GET all abroad scholars
    getAllAbroadScholars: builder.query<Scholar[], void>({
      query: () => "/scholars/abroad",
      transformResponse: (response: { scholars: Scholar[] }) =>
        response.scholars,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // Mark scholar as employed
    markIsEmployed: builder.mutation<Scholar, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/is-employed`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    unMarkIsEmployed: builder.mutation<Scholar, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/is-unemployed`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),
    markIsAbroad: builder.mutation<Scholar, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/is-abroad`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    unMarkIsAbroad: builder.mutation<Scholar, string>({
      query: (uuid) => ({
        url: `/scholars/${uuid}/is-not-abroad`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Scholar", id: uuid },
        { type: "Scholar", id: "LIST" },
      ],
    }),

    // GET scholars by classroom name
    getAllScholarsByClassRoomName: builder.query<Scholar[], string>({
      query: (classRoomName) => `/scholars/class-room/${classRoomName}`,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // GET scholars by program uuid
    getAllScholarsByProgramUuid: builder.query<Scholar[], string>({
      query: (programUuid) => `/scholars/program/${programUuid}`,
      providesTags: [{ type: "Scholar", id: "LIST" }],
    }),

    // GET all completed courses by scholar uuid
    getAllCompletedCoursesByScholarUuid: builder.query<unknown[], string>({
      query: (scholarUuid) => `/scholars/${scholarUuid}/completed-courses`,
      transformResponse: (response: { "completed-courses": unknown[] }) =>
        response["completed-courses"],
      providesTags: (result, error, scholarUuid) => [
        { type: "Scholar", id: scholarUuid },
      ],
    }),
  }),
});

export const {
  useGetAllScholarsQuery,
  useGetAllAbroadScholarsQuery, // NEW
  useGetScholarsByStatusQuery,
  useGetScholarByUuidQuery,
  useGetScholarByUsernameQuery,
  useSearchScholarsQuery,
  useCountScholarsQuery,
  useCreateScholarMutation,
  useCreateMultipleScholarsMutation,
  useUpdateScholarMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetScholarSocialLinksQuery,
  useAddScholarSocialLinkMutation,
  useUpdateSocialLinkStatusMutation,
  useDeleteSocialLinkMutation,
  useSoftDeleteScholarMutation,
  useRestoreScholarMutation,
  useHardDeleteScholarMutation,
  useGetAllScholarsByOpeningProgramUuidQuery,
  useMarkCompletedCourseMutation,
  useRemoveCompletedCourseMutation,
  useMarkIsEmployedMutation, // NEW
  useUnMarkIsAbroadMutation,
  useMarkIsAbroadMutation,
  useUnMarkIsEmployedMutation,
  useGetAllScholarsByClassRoomNameQuery, // NEW
  useGetAllScholarsByProgramUuidQuery, // NEW
  useGetAllCompletedCoursesByScholarUuidQuery, // NEW
  useAssignCareersMutation,
  useGetCareersByScholarUuidQuery,
  useAssignSpecialistsMutation,
  useGetSpecialistsByScholarUuidQuery,
} = scholarApi;
