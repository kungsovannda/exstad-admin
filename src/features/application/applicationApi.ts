import { baseQuery } from "@/services/base-query";
import { ApplicantLetterRequest } from "@/types/application";
import { createApi } from "@reduxjs/toolkit/query/react";

export const applicantLetterApi = createApi({
  reducerPath: "applicantLetterApi",
  baseQuery: baseQuery(),
  tagTypes: ["ApplicantLetter"],
  endpoints: (builder) => ({
    downloadApplicantLettersZip: builder.mutation<
      Blob,
      ApplicantLetterRequest[]
    >({
      query: (requests) => ({
        url: `/letters/download-zip`,
        method: "POST",
        body: requests,
        responseHandler: async (response) => {
          return await response.blob();
        },
        cache: "no-cache",
      }),
      transformResponse: (response: Blob) => {
        return response;
      },
    }),
  }),
});

export const { useDownloadApplicantLettersZipMutation } = applicantLetterApi;
