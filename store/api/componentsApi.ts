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

      createComponent: builder.mutation({
        invalidatesTags: ["Component"],
        query: ({ data, accessToken }) => {
          return {
            url: "/components",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      editComponent: builder.mutation({
        invalidatesTags: ["Component"],
        query: ({ data, accessToken }) => {
          return {
            url: "/components",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteComponent: builder.mutation({
        invalidatesTags: ["Component"],
        query: ({ id, accessToken }) => {
          return {
            url: `/components?id=${id}`,
            method: "DELETE",
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
  useFetchComponentsQuery,
  useCreateComponentMutation,
  useEditComponentMutation,
  useDeleteComponentMutation,
} = componentsApi;
export { componentsApi };
