import { baseQuery } from "@/services/base-query";
import { Badge, CreateBadge, UpdateBadge } from "@/types/badge";
import { createApi } from "@reduxjs/toolkit/query/react";

export const badgeApi = createApi({
  reducerPath: "badgeApi",
  baseQuery: baseQuery(),
  tagTypes: ["Badge"],
  endpoints: (builder) => ({
    // Create Badge
    createBadge: builder.mutation<Badge, CreateBadge>({
      query: (body) => ({
        url: "/badges",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Badge", id: "LIST" }],
    }),

    // Get All Badges
    getAllBadge: builder.query<Badge[], void>({
      query: () => "/badges",
      transformResponse: (response: { badges: Badge[] }) => response.badges,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Badge" as const,
                id: uuid,
              })),
              { type: "Badge", id: "LIST" },
            ]
          : [{ type: "Badge", id: "LIST" }],
    }),

    // Get Badge by UUID
    getBadgeByUuid: builder.query<Badge, string>({
      query: (uuid) => `/badges/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Badge", id: uuid }],
    }),

    // Update Badge
    updateBadge: builder.mutation<Badge, { uuid: string; body: UpdateBadge }>({
      query: ({ uuid, body }) => ({
        url: `/badges/${uuid}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Badge", id: uuid },
        { type: "Badge", id: "LIST" },
      ],
    }),

    // Soft Delete
    deleteBadge: builder.mutation<Badge, string>({
      query: (uuid) => ({
        url: `/badges/delete/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Badge", id: uuid },
        { type: "Badge", id: "LIST" },
      ],
    }),

    // Restore Badge
    restoreBadge: builder.mutation<Badge, string>({
      query: (uuid) => ({
        url: `/badges/restore/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Badge", id: uuid },
        { type: "Badge", id: "LIST" },
      ],
    }),

    // Hard Delete
    hardDeleteBadge: builder.mutation<Badge, string>({
      query: (uuid) => ({
        url: `/badges/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "Badge", id: uuid },
        { type: "Badge", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateBadgeMutation,
  useGetAllBadgeQuery,
  useGetBadgeByUuidQuery,
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
  useRestoreBadgeMutation,
  useHardDeleteBadgeMutation,
} = badgeApi;
