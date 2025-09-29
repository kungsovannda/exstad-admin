import { baseQuery } from "@/services/base-query";
import { Scholar } from "@/types/scholar";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface ScholarApiResponse {
  "opening-program-scholars": Scholar[];
}

export const scholarApi = createApi({
  reducerPath: "scholarApi",
  baseQuery: baseQuery(),
  tagTypes: ["Scholar"],
  endpoints: (builder) => ({
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

    getAllScholars: builder.query<Scholar[], void>({
      query: () => "/scholars",
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
