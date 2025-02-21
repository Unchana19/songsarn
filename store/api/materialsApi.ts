import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const materialsApi = createApi({
  reducerPath: "materialsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Materials"],
  endpoints(build) {
    return {
      fetchMaterials: build.query({
        providesTags: ["Materials"],
        query: (accessToken: string) => {
          return {
            url: "/materials",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      createMaterials: build.mutation({
        invalidatesTags: ["Materials"],
        query: ({ data, accessToken }) => {
          return {
            url: "/materials",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      updateMaterials: build.mutation({
        invalidatesTags: ["Materials"],
        query: ({ data, accessToken }) => {
          return {
            url: "/materials",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteMaterials: build.mutation({
        invalidatesTags: ["Materials"],
        query: ({ id, accessToken }) => {
          return {
            url: `/materials?id=${id}`,
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
  useFetchMaterialsQuery,
  useCreateMaterialsMutation,
  useUpdateMaterialsMutation,
  useDeleteMaterialsMutation,
} = materialsApi;
export { materialsApi };
