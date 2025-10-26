import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/base-query";
import {
  openingProgramCreate,
  openingProgramType,
} from "@/types/opening-program";

export interface SetUpTemplateRequest {
  template: string;
}
export type SetUpTemplateResponse = string;

export interface SetUpTemplateRequest {
  template: string; // URL of the template
}

export const openingProgramApi = createApi({
  reducerPath: "openingProgramApi",
  baseQuery: baseQuery(),
  tagTypes: ["OpeningProgram"],
  endpoints: (builder) => ({
    // GET all opening programs
    getAllOpeningPrograms: builder.query<openingProgramType[], void>({
      query: () => "/opening-programs",
      transformResponse: (response: {
        "opening-programs"?: openingProgramType[];
      }) => response["opening-programs"] ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ programUuid }) => ({
                type: "OpeningProgram" as const,
                id: programUuid,
              })),
              { type: "OpeningProgram", id: "LIST" },
            ]
          : [{ type: "OpeningProgram", id: "LIST" }],
    }),
    getAllOpeningProgramsByProgramSlug: builder.query<
      openingProgramType[],
      { slug: string }
    >({
      query: ({ slug }) => `/opening-programs/program/${slug}`,
      transformResponse: (response: {
        "opening-programs"?: openingProgramType[];
      }) => response["opening-programs"] ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ programUuid }) => ({
                type: "OpeningProgram" as const,
                id: programUuid,
              })),
              { type: "OpeningProgram", id: "LIST" },
            ]
          : [{ type: "OpeningProgram", id: "LIST" }],
    }),

    // GET single opening program by UUID
    getOpeningProgramByUuid: builder.query<
      openingProgramType,
      { uuid: string }
    >({
      query: ({ uuid }) => `/opening-programs/${uuid}`,
      providesTags: (result) =>
        result ? [{ type: "OpeningProgram", id: result.programUuid }] : [],
    }),

    // Get single opening program by slug
    getOpeningProgramBySlug: builder.query<
      openingProgramType,
      { slug: string }
    >({
      query: ({ slug }) => `/opening-programs/slug/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "OpeningProgram", id: result.slug }] : [],
    }),

    // CREATE opening program
    createOpeningProgram: builder.mutation<
      openingProgramType,
      openingProgramCreate
    >({
      query: (body) => ({
        url: "/opening-programs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "OpeningProgram", id: "LIST" }],
    }),

    // UPDATE opening program
    updateOpeningProgram: builder.mutation<
      openingProgramType,
      { uuid: string; body: openingProgramCreate }
    >({
      query: ({ uuid, body }) => ({
        url: `/opening-programs/${uuid}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "OpeningProgram", id: uuid },
      ],
    }),

    // DELETE opening program
    deleteOpeningProgram: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/opening-programs/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "OpeningProgram", id: uuid },
        { type: "OpeningProgram", id: "LIST" },
      ],
    }),
    softdeleteOpeningProgram: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/opening-programs/${uuid}/soft-delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "OpeningProgram", id: uuid },
        { type: "OpeningProgram", id: "LIST" },
      ],
    }),

    setUpTemplate: builder.mutation<
      SetUpTemplateResponse,
      { uuid: string; template: string }
    >({
      query: ({ uuid, template }) => ({
        url: `/opening-programs/${uuid}/template`,
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
        { type: "OpeningProgram", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllOpeningProgramsQuery,
  useGetAllOpeningProgramsByProgramSlugQuery,
  useGetOpeningProgramByUuidQuery,
  useGetOpeningProgramBySlugQuery,
  useCreateOpeningProgramMutation,
  useUpdateOpeningProgramMutation,
  useDeleteOpeningProgramMutation,
  useSoftdeleteOpeningProgramMutation,
  useSetUpTemplateMutation,
} = openingProgramApi;
