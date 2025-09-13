import { useBaseQuery } from "@/services/use-base-query";
import { RequirementsType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

export const requiementApi = createApi({
  reducerPath: "requiementsApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Requirements"],
  endpoints: (builder) => ({
    getAllRequirements: builder.query<RequirementsType[], string>({
      query: (programUuid) => `/api/v1/programs/${programUuid}/requirements`,
      // no transformResponse needed, backend already returns an array
      providesTags: (result, error, uuid) =>
        result
          ? [
              ...result.map((_, index) => ({
                type: "Requirements" as const,
                id: `${uuid}-${index}`, // unique id
              })),
              { type: "Requirements", id: "LIST" },
            ]
          : [{ type: "Requirements", id: "LIST" }],
    }),
  }),
});

export const { useGetAllRequirementsQuery } = requiementApi;
