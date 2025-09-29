import { baseQuery } from "@/services/base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface DownloadZipRequest {
  filenames: string[];
}


export const documentAccessApi = createApi({
    baseQuery: baseQuery(false),
    tagTypes: ["DocumentAccess"],
    reducerPath: "documentAccessApi",
    endpoints: (builder) => ({
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

    })
})

export const { useDownloadZipMutation } = documentAccessApi;