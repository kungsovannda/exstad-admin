import { AdmissionEmailRequest, EmailResponse } from "@/types/email";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Email"],
  endpoints: (builder) => ({
    createEmailMessage: builder.mutation<EmailResponse, AdmissionEmailRequest>({
      query: (body) => ({
        url: "/email",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateEmailMessageMutation } = emailApi;
