import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["User"],
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
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useUpdateUserAddressMutation,
} = usersApi;
export { usersApi };
