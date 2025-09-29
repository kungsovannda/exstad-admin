import { createApi } from "@reduxjs/toolkit/query/react";
import { useBaseQuery } from "@/services/use-base-query";
import { Province } from "@/types/province";

export const provinceApi = createApi({
  reducerPath: "provinceApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Province"],
  endpoints: (builder) => ({
    getAllProvinces: builder.query<Province[], void>({
      query: () => "/api/v1/provinces",
      transformResponse: (response: { provinces: Province[] }) =>
        response.provinces,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({ type: "Province" as const, id: uuid })),
              { type: "Province", id: "LIST" },
            ]
          : [{ type: "Province", id: "LIST" }],
    }),
  }),
});

export const { useGetAllProvincesQuery } = provinceApi;
