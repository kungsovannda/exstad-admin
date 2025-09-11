import { createApi } from "@reduxjs/toolkit/query/react";
import { useBaseQuery } from "@/services/use-base-query";
import { programType } from "@/types/program";

export const masterprogramApi = createApi({
    reducerPath: "masterprogramApi",
    baseQuery: useBaseQuery,
    tagTypes: ["MasterProgram"],
    endpoints: (builder) => ({
        getAllMasterPrograms: builder.query<programType[], void>({
            query: () => "/api/v1/programs",
            transformResponse: (response: { programs?: programType[] }) =>
                response.programs ?? [],
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
    }),
});

export const { useGetAllMasterProgramsQuery } = masterprogramApi;
