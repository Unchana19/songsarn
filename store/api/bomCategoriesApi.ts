import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const bomCategoriesApi = createApi({
  reducerPath: "bomCategoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["BomCategories"],
  endpoints(build) {
    return {
      fetchBomComponentsCategories: build.query({
        providesTags: ["BomCategories"],
        query: (accessToken: string) => {
          return {
            url: "/categories/component-categories",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchBomCategories: build.query({
        providesTags: ["BomCategories"],
        query: ({
          categoryId,
          accessToken,
        }: {
          categoryId: string;
          accessToken: string;
        }) => {
          return {
            url: `/categories/${categoryId}`,
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

export const {
  useFetchBomComponentsCategoriesQuery,
  useFetchBomCategoriesQuery,
} = bomCategoriesApi;
export { bomCategoriesApi };
