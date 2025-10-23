import { baseQuery } from "@/services/base-query";
import { CreateCurrentAddress, CurrentAddress } from "@/types/current-address";
import { createApi } from "@reduxjs/toolkit/query/react";

export const currentAddressApi = createApi({
  reducerPath: "currentAddressApi",
  baseQuery: baseQuery(),
  tagTypes: ["CurrentAddress"],
  endpoints: (builder) => ({
    // GET all current addresses
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

    // GET current address by uuid
    getCurrentAddress: builder.query<CurrentAddress, string>({
      query: (uuid) => `/current-addresses/${uuid}`,
      providesTags: (result, error, uuid) => [
        { type: "CurrentAddress", id: uuid },
      ],
    }),

    // POST create current address
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

    // PUT soft delete current address
    softDeleteCurrentAddress: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/current-addresses/${uuid}/soft-delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "CurrentAddress", id: uuid },
        { type: "CurrentAddress", id: "LIST" },
      ],
    }),

    // DELETE hard delete current address
    hardDeleteCurrentAddress: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/current-addresses/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
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
  useSoftDeleteCurrentAddressMutation,
  useHardDeleteCurrentAddressMutation,
} = currentAddressApi;
