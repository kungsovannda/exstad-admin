import { baseQuery } from "@/services/base-query";
import {
  ScholarAchievementForScholar,
  CreateScholarAchievement,
  ScholarAchievementForAchievement,
} from "@/types/achievement";
import { createApi } from "@reduxjs/toolkit/query/react";

export const scholarAchievementApi = createApi({
  reducerPath: "scholarAchievementApi",
  baseQuery: baseQuery(),
  tagTypes: ["ScholarAchievement"],
  endpoints: (builder) => ({
    // GET all achievements for a scholar
    getAllScholarAchievements: builder.query<
      ScholarAchievementForScholar[],
      { scholarUuid: string }
    >({
      query: ({ scholarUuid }) => `/scholars/${scholarUuid}/achievements`,
      providesTags: (result, error, scholarUuid) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "ScholarAchievement" as const,
                id: uuid,
              })),
              { type: "ScholarAchievement", id: `Scholar-${scholarUuid}` },
            ]
          : [{ type: "ScholarAchievement", id: `Scholar-${scholarUuid}` }],
    }),

    // GET all scholars for an achievement
    getAllScholarsByAchievement: builder.query<
      ScholarAchievementForAchievement[],
      string
    >({
      query: (achievementUuid) => `/achievements/${achievementUuid}/scholars`,
      providesTags: (result, error, achievementUuid) => [
        { type: "ScholarAchievement", id: `Achievement-${achievementUuid}` },
      ],
    }),

    // CREATE a new scholar-achievement
    createScholarAchievement: builder.mutation<
      ScholarAchievementForScholar,
      { scholarUuid: string; body: CreateScholarAchievement }
    >({
      query: ({ scholarUuid, body }) => ({
        url: `/scholars/${scholarUuid}/achievements`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { scholarUuid }) => [
        { type: "ScholarAchievement", id: `Scholar-${scholarUuid}` },
      ],
    }),

    // DELETE scholar-achievement
    deleteScholarAchievement: builder.mutation<
      void,
      { scholarUuid: string; achievementUuid: string }
    >({
      query: ({ scholarUuid, achievementUuid }) => ({
        url: `/scholars/${scholarUuid}/achievements/${achievementUuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { scholarUuid, achievementUuid }) => [
        { type: "ScholarAchievement", id: `Scholar-${scholarUuid}` },
        { type: "ScholarAchievement", id: `Achievement-${achievementUuid}` },
      ],
    }),
  }),
});

export const {
  useGetAllScholarAchievementsQuery,
  useGetAllScholarsByAchievementQuery,
  useCreateScholarAchievementMutation,
  useDeleteScholarAchievementMutation,
} = scholarAchievementApi;
