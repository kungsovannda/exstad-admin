import { useBaseQuery } from "@/services/use-base-query";
import { Audit } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define the request type based on your Postman body
export interface GenerateCertificateRequest {
  scholarUuid: string;
  openingProgramUuid: string;
  bgImage: string;
}

// Updated response type to match your Java record
export interface CertificateResponse {
  uuid: string;
  fileName: string;
  scholarUuid: string;
  openingProgramUuid: string;
  tempCertificateUrl: string;
  certificateUrl: string;
  isVerified: boolean;
  audit: Audit;
}

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: useBaseQuery,
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    generateCertificate: builder.mutation<
      CertificateResponse,
      GenerateCertificateRequest & { programSlug: string }
    >({
      query: ({ programSlug, scholarUuid, openingProgramUuid, bgImage }) => ({
        url: `/api/v1/generate-certificates/${programSlug}`,
        method: "POST",
        body: {
          scholarUuid,
          openingProgramUuid,
          bgImage,
        },
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    // If you need to generate certificates for multiple scholars
    generateMultipleCertificates: builder.mutation<
      CertificateResponse[],
      {
        programSlug: string;
        scholarUuids: string[];
        openingProgramUuid: string;
        bgImage: string;
      }
    >({
      query: ({ programSlug, scholarUuids, openingProgramUuid, bgImage }) => ({
        url: `/api/v1/generate-certificates/${programSlug}`,
        method: "POST",
        body: scholarUuids.map((scholarUuid) => ({
          scholarUuid,
          openingProgramUuid,
          bgImage,
        })),
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    
  }),
});

export const {
  useGenerateCertificateMutation,
  useGenerateMultipleCertificatesMutation,
} = certificateApi;
