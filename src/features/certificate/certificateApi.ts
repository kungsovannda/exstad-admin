import { useBaseQuery } from "@/services/use-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { CertificateType } from "@/types/certificate";

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    generateCertificates: builder.mutation<
      CertificateType,
      {
        scholarUuids: string[];
        openingProgramUuid: string;
        bgImage?: string;
        offeringType?: string;
      }
    >({
      query: (payload) => {
        const offering = payload.offeringType ?? "default";
        return {
          url: `/generate-certificates/${offering}`,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: CertificateType) => response,
      invalidatesTags: (result) =>
        result
          ? [{ type: "Certificate" as const, id: result.certificateUrl }]
          : [{ type: "Certificate" as const, id: "LIST" }],
    }),
    // Get all certificates (returns an array)
    getAllCertificates: builder.query<CertificateType[], void>({
      query: () => "/certificates",
      transformResponse: (response: unknown) => {
        // handle both array and { certificates: [...] } shapes
        if (Array.isArray(response)) return response as CertificateType[];
        const obj = response as Record<string, unknown> | null;
        if (obj && Array.isArray(obj["certificates"])) {
          return obj["certificates"] as CertificateType[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({
                type: "Certificate" as const,
                id: r.certificateUrl,
              })),
              { type: "Certificate" as const, id: "LIST" },
            ]
          : [{ type: "Certificate" as const, id: "LIST" }],
    }),
  }),
});

export const { useGenerateCertificatesMutation, useGetAllCertificatesQuery } =
  certificateApi;
