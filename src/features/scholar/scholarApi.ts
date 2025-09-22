import { useBaseQuery } from "@/services/use-base-query";
import { Scholar } from "@/types/scholar";
import { createApi } from "@reduxjs/toolkit/query/react";

export const scholarApi = createApi({
  reducerPath: "scholarApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Scholar"],
  endpoints: (builder) => ({
    // Get scholars by opening program UUID
    getAllScholarsByOpeningProgramUuid: builder.query<Scholar[], string>({
      query: (uuid) => `/api/v1/scholars/${uuid}/opening-program`,
      transformResponse: (
        response: Scholar[] | { data: Scholar[] } | { scholars: Scholar[] }
      ) => {
        // If response is already an array
        if (Array.isArray(response)) {
          return response;
        }

        // If response is wrapped in 'data' property
        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          return response.data;
        }

        // If response is wrapped in 'scholars' property
        if (
          response &&
          typeof response === "object" &&
          "scholars" in response &&
          Array.isArray(response.scholars)
        ) {
          return response.scholars;
        }

        console.log("Unexpected response format, returning empty array");
        return [];
      },
      providesTags: (result) => {
        return result && Array.isArray(result)
          ? [
              ...result.map(({ uuid }) => ({
                type: "Scholar" as const,
                id: uuid,
              })),
              { type: "Scholar", id: "OPENING_PROGRAM_LIST" },
            ]
          : [{ type: "Scholar", id: "OPENING_PROGRAM_LIST" }];
      },
    }),

    getAllScholars: builder.query<Scholar[], void>({
      query: () => "/api/v1/scholars",
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
  }),
});

export const {
  useGetAllScholarsByOpeningProgramUuidQuery,
  useGetAllScholarsQuery,
} = scholarApi;
