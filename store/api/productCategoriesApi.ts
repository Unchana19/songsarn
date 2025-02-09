import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productCategoriesApi = createApi({
  reducerPath: "productCategoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["ProductCategories"],
  endpoints(builder) {
    return {
      fetchProductCategories: builder.query({
        providesTags: ["ProductCategories"],
        query: () => {
          return {
            url: "/categories/product-categories",
            method: "GET",
          };
        },
      }),

      fetchProductCategory: builder.query({
        providesTags: ["ProductCategories"],
        query: (categoryId: string) => {
          return {
            url: `/categories/find-one?id=${categoryId}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useFetchProductCategoriesQuery, useFetchProductCategoryQuery } =
  productCategoriesApi;
export { productCategoriesApi };
