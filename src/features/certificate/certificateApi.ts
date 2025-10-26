import { baseQuery } from "@/services/base-query";
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
  baseQuery: baseQuery(),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    generateCertificate: builder.mutation<
      CertificateResponse,
      GenerateCertificateRequest & { programSlug: string }
    >({
      query: ({ programSlug, scholarUuid, openingProgramUuid, bgImage }) => ({
        url: `/generate-certificates/${programSlug}`,
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
        url: `/generate-certificates/${programSlug}`,
        method: "POST",
        body: scholarUuids.map((scholarUuid) => ({
          scholarUuid,
          openingProgramUuid,
          bgImage,
        })),
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    getCertificateByScholarAndOpeningProgram: builder.query<
      CertificateResponse[],
      { scholarUuid: string; openingProgramUuid: string }
    >({
      query: ({ scholarUuid, openingProgramUuid }) => ({
        url: `/certificates/${scholarUuid}/opening-program/${openingProgramUuid}`,
        method: "GET",
      }),
    }),

    getCertificateByScholar: builder.query<
      CertificateResponse[],
      { scholarUuid: string }
    >({
      query: ({ scholarUuid }) => ({
        url: `/certificates/scholars/${scholarUuid}`,
        method: "GET",
      }),
    }),

    verifyCertificate: builder.mutation<
      CertificateResponse,
      { file: File; programSlug: string; certificateUuid: string }
    >({
      query: ({ file, programSlug, certificateUuid }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/verify-certificates/${programSlug}/${certificateUuid}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    getCertificateByOpeningProgram: builder.query<
      CertificateResponse[],
      string
    >({
      query: (openingProgramUuid) => ({
        url: `/certificates/${openingProgramUuid}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGenerateCertificateMutation,
  useGenerateMultipleCertificatesMutation,
  useGetCertificateByScholarAndOpeningProgramQuery,
  useGetCertificateByScholarQuery,
  useVerifyCertificateMutation,
  useGetCertificateByOpeningProgramQuery,
} = certificateApi;
