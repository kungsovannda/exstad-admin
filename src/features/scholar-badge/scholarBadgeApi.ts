import { useBaseQuery } from "@/services/use-base-query";
import { CreateScholarBadge, ScholarBadge } from "@/types/scholar-badge";
import { createApi } from "@reduxjs/toolkit/query/react";

export const scholarBadgeApi = createApi({
  baseQuery: useBaseQuery,
  tagTypes: ["ScholarBadge"],
  reducerPath: "scholarBadgeApi",
  endpoints: (builder) => ({
    createScholarBadge: builder.mutation<CreateScholarBadge, ScholarBadge>({
      query: (body) => ({
        url: "/scholar-badges",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ScholarBadge", id: "LIST" }],
    }),
  }),
});

export const { useCreateScholarBadgeMutation } = scholarBadgeApi;
