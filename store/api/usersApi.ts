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
    };
  },
});

export const { useFetchUserQuery } = usersApi;
export { usersApi };
