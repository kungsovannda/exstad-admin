import { baseQuery } from "@/services/base-query";
import { Audit } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface UploadCertificateRequest {
  file: File;
  programSlug: string;
  gen: number;
  documentType: string;
  filename?: string;
}

export interface UploadCertificateResponse {
  name: string;
  mimeType: string;
  programSlug: string;
  gen: number;
  documentType: string;
  fileSize: number;
  uri: string;
  audit: Audit;
}

export interface DownloadZipRequest {
  filenames: string[];
}

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQuery(false),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    uploadCertificate: builder.mutation<
      UploadCertificateResponse,
      UploadCertificateRequest
    >({
      query: ({ file, programSlug, gen, documentType, filename }) => {
        const formData = new FormData();
        formData.append("file", file);

        // Add these additional fields that the backend expects
        if (filename) {
          formData.append("filename", filename);
        }

        const url = `/api/v1/documents/${programSlug}/${gen}/${documentType}`;

        return {
          url,
          method: "POST",
          body: formData,
          // Make sure no Content-Type header is set - let browser handle it
        };
      },
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    downloadZip: builder.mutation<Blob, DownloadZipRequest>({
      query: ({ filenames }) => {
        // Convert filenames array to URL parameters for GET request
        const params = new URLSearchParams();
        filenames.forEach((filename) => {
          params.append("filenames", filename);
        });

        return {
          url: `/documents/download-zip?${params.toString()}`,
          method: "GET",
          responseHandler: async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Download error response:", errorText);
              throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
              );
            }
            return await response.blob();
          },
          headers: {
            Accept: "application/zip, application/octet-stream",
          },
        };
      },
    }),
  }),
});

export const { useUploadCertificateMutation, useDownloadZipMutation } =
  documentApi;
