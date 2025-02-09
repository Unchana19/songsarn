import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const bomCategoriesApi = createApi({
  reducerPath: "bomCategoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["BomComponentsCategories"],
  endpoints(build) {
    return {
      fetchBomComponentsCategories: build.query({
        providesTags: ["BomComponentsCategories"],
        query: ({
          categoryId,
          accessToken,
        }: {
          categoryId: string;
          accessToken: string;
        }) => {
          return {
            url: "/categories/component-categories",
            method: "GET",
            params: {
              categoryId,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchBomComponentsCategoriesQuery } = bomCategoriesApi;
export { bomCategoriesApi };
