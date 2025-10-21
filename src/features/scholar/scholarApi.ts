import { baseQuery } from "@/services/base-query";
import {
  Scholar,
  CreateScholar,
  UpdateScholar,
  CreateScholarSocialLink,
  ScholarSocialLink,
} from "@/types/scholar";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface ScholarApiResponse {
  "opening-program-scholars": Scholar[];
}

export const scholarApi = createApi({
  reducerPath: "scholarApi",
  baseQuery: baseQuery(),
  tagTypes: ["Scholar", "ScholarSocialLink"],
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
      providesTags: (result, error, username) => [
        { type: "Scholar", id: `username-${username}` },
      ],
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
      transformResponse: (
        response: ScholarApiResponse | Scholar[] | unknown
      ): Scholar[] => {
        if (
          response &&
          typeof response === "object" &&
          !Array.isArray(response)
        ) {
          const apiResponse = response as ScholarApiResponse;
          if (
            apiResponse["opening-program-scholars"] &&
            Array.isArray(apiResponse["opening-program-scholars"])
          ) {
            return apiResponse["opening-program-scholars"];
          }
        }
        if (Array.isArray(response)) {
          return response as Scholar[];
        }

        // Always return an array
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


  }),
});

export const {
  useGetAllScholarsQuery,
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
} = scholarApi;
