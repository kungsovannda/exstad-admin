import { baseQuery } from "@/services/base-query";
import { User, CreateUser } from "@/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // 📋 GET all users
    getAllUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: { users?: User[] }) => response.users ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "User" as const,
                id: uuid,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 🚫 GET not-scholar users
    getNotScholarUsers: builder.query<User[], void>({
      query: () => "/users/not-scholar",
      transformResponse: (response: { users?: User[] }) => response.users ?? [],
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    // GET all Instructor 
    getAllInstructors: builder.query<User[], void>({
      query: () => "/instructor-classes/instructors",
      transformResponse: (response: { users?: User[] }) => response.users ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ uuid }) => ({
                type: "User" as const,
                id: uuid,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 🔍 GET user by UUID
    getUserByUuid: builder.query<User, string>({
      query: (uuid) => `/users/${uuid}`,
      transformResponse: (response: User) => response,
      providesTags: (result, error, uuid) => [{ type: "User", id: uuid }],
    }),

    // 🔍 GET user by email
    getUserByEmail: builder.query<User, string>({
      query: (email) => `/users/email/${email}`,
      transformResponse: (response: User) => response,
      providesTags: (result, error, email) => [{ type: "User", id: email }],
    }),

    // 🙋‍♂️ GET current user (me)
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      transformResponse: (response: User) => response,
      providesTags: [{ type: "User", id: "ME" }],
    }),

    // 🧾 CREATE (register) user
    createUser: builder.mutation<User, CreateUser>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: User) => response,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetNotScholarUsersQuery,
  useGetAllInstructorsQuery,
  useGetUserByUuidQuery,
  useGetUserByEmailQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
} = userApi;
