import { baseQuery } from "@/services/base-query";
import { MasterProgramCreate, MasterProgramType } from "@/types/program";
import { createApi } from "@reduxjs/toolkit/query/react";

export const masterprogramApi = createApi({
  reducerPath: "masterprogramApi",
  baseQuery: baseQuery(),
  tagTypes: ["MasterProgram"],
  endpoints: (builder) => ({

    getAllMasterPrograms: builder.query<MasterProgramType[], void>({
      query: () => "/programs",
      transformResponse: (response: { programs?: MasterProgramType[] }) =>
        response["programs"] ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "MasterProgram" as const,
                id: uuid,
              })),
              { type: "MasterProgram", id: "LIST" },
            ]
          : [{ type: "MasterProgram", id: "LIST" }],
    }),

    //
    // Fetch a single program by UUID
    getMasterProgramByUuid: builder.query<MasterProgramType, { uuid: string }>({
      query: ({ uuid }) => `/programs/${uuid}`,
      providesTags: (result) =>
        result ? [{ type: "MasterProgram", id: result.uuid }] : [],
    }),

    // Fetch a single program by slug
    getMasterProgramBySlug: builder.query<MasterProgramType, { slug: string }>({
      query: ({ slug }) => `/programs/slug/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "MasterProgram", id: result.slug }] : [],
    }),

    // CREATE a new master program
    createMasterProgram: builder.mutation<
      MasterProgramType,
      MasterProgramCreate
    >({
      query: (body) => ({
        url: "/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MasterProgram", id: "LIST" }],
    }),

    // Update an existing master program
    updateMasterProgram: builder.mutation<
      MasterProgramType,
      { uuid: string; body: MasterProgramCreate }
    >({
      query: ({ uuid, body }) => ({
        url: `/programs/${uuid}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: "MasterProgram", id: uuid },
      ],
    }),

    // DELETE a master program
    deleteMasterProgram: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/programs/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "MasterProgram", id: uuid },
        { type: "MasterProgram", id: "LIST" },
      ],
    }),
    softDeleteMasterProgram: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/programs/${uuid}/delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, uuid) => [
        { type: "MasterProgram", id: uuid },
        { type: "MasterProgram", id: "LIST" },
      ],
    }),

    getMasterProgramByOpeningProgramUuid: builder.query<
      MasterProgramType,
      { openingProgramUuid: string }
    >({
      query: ({ openingProgramUuid }) =>
        `/programs/opening-program/${openingProgramUuid}`,
      providesTags: (result) =>
        result ? [{ type: "MasterProgram", id: result.uuid }] : [],
    }),
  }),
});

export const {
  useGetAllMasterProgramsQuery,
  useGetMasterProgramByUuidQuery,
  useGetMasterProgramBySlugQuery,
  useCreateMasterProgramMutation,
  useUpdateMasterProgramMutation,
  useDeleteMasterProgramMutation,
  useSoftDeleteMasterProgramMutation,
  useGetMasterProgramByOpeningProgramUuidQuery,
} = masterprogramApi;
