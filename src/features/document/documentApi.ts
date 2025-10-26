import { baseQuery } from "@/services/base-query";
import { CreateDocument, Document } from "@/types/document";
import { CreateLogo } from "@/types/document/create-document";
import { createApi } from "@reduxjs/toolkit/query/react";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQuery(),
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    // Upload (multipart/form-data)
    createDocument: builder.mutation<Document, CreateDocument>({
      query: (body) => {
        const formData = new FormData();
        formData.append("file", body.file);
        return {
          url: `/documents/${body.programSlug}/${body.gen}/${
            body.documentType
          }${body.filename ? `?filename=${body.filename}` : ""}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),

createLogo: builder.mutation<Document, CreateLogo & { gen?: number }>({
  query: (body) => {
    const formData = new FormData();
    formData.append("file", body.file);
    formData.append("filename", body.filename || "");
    formData.append("documentType", body.documentType);

    const generationSegment = body.gen !== undefined ? body.gen : "general";

    return {
      url: `/documents/${body.programSlug}/${generationSegment}/${body.documentType}`,
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: [{ type: "Document", id: "LIST" }],
}),


    // Get all documents
    getAllDocuments: builder.query<Document[], void>({
      query: () => "/documents",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ name }) => ({
                type: "Document" as const,
                name,
              })),
              { type: "Document", id: "LIST" },
            ]
          : [{ type: "Document", id: "LIST" }],
    }),

    // Get document by filename
    getDocumentByName: builder.query<Document, string>({
      query: (fileName) => `/documents/${fileName}`,
      providesTags: (result, error, fileName) => [
        { type: "Document", id: fileName },
      ],
    }),

    // Update document by filename
    updateDocument: builder.mutation<
      Document,
      { fileName: string; file: File }
    >({
      query: ({ fileName, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/documents/${fileName}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { fileName }) => [
        { type: "Document", id: fileName },
        { type: "Document", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetAllDocumentsQuery,
  useGetDocumentByNameQuery,
  useUpdateDocumentMutation,
  useCreateLogoMutation,
} = documentApi;
