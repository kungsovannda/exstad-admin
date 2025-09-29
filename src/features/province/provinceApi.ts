import { baseQuery } from "@/services/base-query";
import { Province } from "@/types/province";
import { createApi } from "@reduxjs/toolkit/query/react";

export const provinceApi = createApi({
  reducerPath: "provinceApi",
  baseQuery: baseQuery(),
  tagTypes: ["Province"],
  endpoints: (builder) => ({
    getAllProvinces: builder.query<Province[], void>({
      query: () => "/provinces",
      transformResponse: (response: { provinces: Province[] }) =>
        response.provinces,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "Province" as const,
                uuid,
              })),
              { type: "Province", id: "LIST" },
            ]
          : [{ type: "Province", id: "LIST" }],
    }),
  }),
});

export const { useGetAllProvincesQuery } = provinceApi;
