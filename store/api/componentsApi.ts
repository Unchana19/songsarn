import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const componentsApi = createApi({
  reducerPath: "componentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Component"],
  endpoints(builder) {
    return {
      fetchComponents: builder.query({
        providesTags: ["Component"],
        query: (accessToken: string) => {
          return {
            url: "/components",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchComponentsQuery } = componentsApi;
export { componentsApi };
