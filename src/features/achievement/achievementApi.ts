// src/features/achievement/achievementApi.ts
import { baseQuery } from "@/services/base-query";
import {
  Achievement,
  CreateAchievement,
  UpdateAchievement,
} from "@/types/achievement";
import { createApi } from "@reduxjs/toolkit/query/react";

export const achievementApi = createApi({
  reducerPath: "achievementApi",
  baseQuery: baseQuery(),
  tagTypes: ["Achievement"],
  endpoints: (builder) => ({
    // GET all achievements
    getAllAchievements: builder.query<Achievement[], void>({
      query: () => "/achievements",
      transformResponse: (response: { achievements?: Achievement[] }) =>
        response.achievements ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "Achievement" as const,
                id: uuid,
              })),
              { type: "Achievement", id: "LIST" },
            ]
          : [{ type: "Achievement", id: "LIST" }],
    }),

    // GET a single achievement by UUID
    getAchievementByUuid: builder.query<Achievement, string>({
      query: (uuid) => `/achievements/${uuid}`,
      providesTags: (result, error, uuid) => [
        { type: "Achievement", id: uuid },
      ],
    }),

    // CREATE a new achievement
    createAchievement: builder.mutation<Achievement, CreateAchievement>({
      query: (body) => ({
        url: "/achievements",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Achievement", id: "LIST" }],
    }),

    // UPDATE an existing achievement
    updateAchievement: builder.mutation<
      Achievement,
      { uuid: string; body: UpdateAchievement }
    >({
      query: ({ uuid, body }) => ({
        url: `/achievements/${uuid}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Achievement", id: uuid },
      ],
    }),

    // DELETE an achievement
    deleteAchievement: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/achievements/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Achievement", id: uuid },
        { type: "Achievement", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllAchievementsQuery,
  useGetAchievementByUuidQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
} = achievementApi;
