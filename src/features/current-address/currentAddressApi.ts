import { useBaseQuery } from "@/services/use-base-query";
import { CreateCurrentAddress, CurrentAddress } from "@/types/current-address";
import { createApi } from "@reduxjs/toolkit/query/react";

export const currentAddressApi = createApi({
  reducerPath: "currentAddressApi",
  baseQuery: useBaseQuery,
  tagTypes: ["CurrentAddress"],
  endpoints: (builder) => ({
    getCurrentAddresses: builder.query<CurrentAddress[], void>({
      query: () => "/current-addresses",
      transformResponse: (response: { currentAddresses: CurrentAddress[] }) => {
        return response.currentAddresses;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({
                type: "CurrentAddress" as const,
                id: uuid,
              })),
              { type: "CurrentAddress", id: "LIST" },
            ]
          : [{ type: "CurrentAddress", id: "LIST" }],
    }),

    createCurrentAddress: builder.mutation<
      CurrentAddress,
      CreateCurrentAddress
    >({
      query: (body) => ({
        url: "/current-addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CurrentAddress", id: "LIST" }],
    }),

    deleteCurrentAddress: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/current-addresses/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "CurrentAddress", id: uuid },
        { type: "CurrentAddress", id: "LIST" },
      ],
    }),
    getCurrentAddress: builder.query<CurrentAddress, string>({
      query: (uuid) => ({
        url: `/current-addresses/${uuid}`,
        method: "GET",
      }),
      providesTags: (result, error, uuid) => [
        { type: "CurrentAddress", id: uuid },
        { type: "CurrentAddress", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCurrentAddressesQuery,
  useGetCurrentAddressQuery,
  useCreateCurrentAddressMutation,
  useDeleteCurrentAddressMutation,
} = currentAddressApi;
