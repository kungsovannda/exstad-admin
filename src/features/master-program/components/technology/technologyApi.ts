import { baseQuery } from "@/services/base-query";
import { technologyType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

// Separate type for backend payload
export type TechnologyPayload = {
  image:string;
  title: string;
  description: string;
};

export const technologyApi = createApi({
  reducerPath: "technologyApi",
  baseQuery: baseQuery(),
  tagTypes: ["Technology"],
  endpoints: (builder) => ({
    getAllTechnology: builder.query<technologyType[], string>({
      query: (programUuid) => `/programs/${programUuid}/technologies`,
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Technology" as const,
                id: `${uuid}-${index}`, // unique for caching
              })),
              { type: "Technology", id: "LIST" },
            ]
          : [{ type: "Technology", id: "LIST" }],
    }),

    updateTechnology: builder.mutation<
      void, // backend returns nothing
      { programUuid: string; technology: TechnologyPayload[] } // payload type
    >({
      query: ({ programUuid, technology }) => ({
        url: `/programs/${programUuid}/technologies`,
        method: "PUT",
        body: technology, // send only what backend expects
      }),
      invalidatesTags: [{ type: "Technology", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTechnologyQuery,
  useUpdateTechnologyMutation,
} = technologyApi;
