import { useBaseQuery } from "@/services/use-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { openingProgramType } from "@/types/opening-program";

// Define the request type based on your Postman body
export interface SetUpTemplateRequest {
  template: string; // URL of the template
}

// Define the response type - returns a string URL
export type SetUpTemplateResponse = string;

export enum Status {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  ACHIEVED = "ACHIEVED",
  PENDING = "PENDING",
}

export interface OpeningProgramsResponse {
  openingPrograms: openingProgramType[];
}

export const openingProgramApi = createApi({
  reducerPath: "openingProgramApi",
  baseQuery: useBaseQuery,
  tagTypes: ["OpeningProgram", "Template"],
  endpoints: (builder) => ({
    setUpTemplate: builder.mutation<
      SetUpTemplateResponse,
      { uuid: string; template: string }
    >({
      query: ({ uuid, template }) => ({
        url: `/api/v1/opening-programs/${uuid}/template`,
        method: "PUT",
        body: {
          template,
        },
        // Add this to handle plain text response
        responseHandler: async (response: Response): Promise<string> => {
          const text = await response.text();
          console.log("Raw backend response:", text);

          // Validate that it's a URL
          if (text && text.trim().startsWith("http")) {
            return text.trim();
          }

          // If response is not a URL, throw error
          throw new Error(`Invalid URL returned from backend: ${text}`);
        },
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "OpeningProgram", id: uuid },
        { type: "Template", id: "LIST" },
      ],
    }),

    getAllOpeningPrograms: builder.query<openingProgramType[], void>({
      query: () => "/api/v1/opening-programs",
      transformResponse: (response: {
        "opening-programs"?: openingProgramType[];
      }) => response["opening-programs"] ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "OpeningProgram" as const,
                id: uuid,
              })),
              { type: "OpeningProgram", id: "LIST" },
            ]
          : [{ type: "OpeningProgram", id: "LIST" }],
    }),

    getOpeningProgramBySlug: builder.query<openingProgramType, string>({
      query: (slug) => ({
        url: `/api/v1/opening-programs/slug/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: openingProgramType) => {
        return response;
      },
      providesTags: (result, error, slug) => [
        { type: "OpeningProgram", id: slug },
        { type: "OpeningProgram", id: result?.uuid },
      ],
    }),
  }),
});

export const {
  useSetUpTemplateMutation,
  useGetAllOpeningProgramsQuery,
  useGetOpeningProgramBySlugQuery,
} = openingProgramApi;
