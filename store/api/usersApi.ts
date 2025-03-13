import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["User", "Staff"],
  endpoints(builder) {
    return {
      fetchUser: builder.query({
        providesTags: ["User"],
        query: (userId: string) => {
          return {
            url: `/users/${userId}`,
            method: "GET",
          };
        },
      }),

      fetchStaff: builder.query({
        providesTags: ["Staff"],
        query: (accessToken: string) => {
          return {
            url: "/users/staff",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      addStaff: builder.mutation({
        invalidatesTags: ["Staff"],
        query: ({ data, accessToken }) => {
          return {
            url: "/users/staff",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteStaff: builder.mutation({
        invalidatesTags: ["Staff"],
        query: ({ staffId, accessToken }) => {
          return {
            url: `/users/staff/${staffId}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      signUp: builder.mutation({
        invalidatesTags: ["User"],
        query: (data) => {
          return {
            url: "/users",
            method: "POST",
            body: data,
          };
        },
      }),

      updateUserProfile: builder.mutation({
        invalidatesTags: ["User"],
        query: ({ data, accessToken }) => {
          return {
            url: "/users",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      updateUserAddress: builder.mutation({
        invalidatesTags: ["User"],
        query: ({ data, accessToken }) => {
          return {
            url: "/users/address",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const {
  useFetchUserQuery,
  useFetchStaffQuery,
  useAddStaffMutation,
  useDeleteStaffMutation,
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useUpdateUserAddressMutation,
} = usersApi;
export { usersApi };
