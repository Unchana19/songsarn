import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["ProductCategories", "Categories"],
  endpoints(builder) {
    return {
      fetchProductCategories: builder.query({
        providesTags: ["ProductCategories", "Categories"],
        query: () => {
          return {
            url: "/categories/product-categories",
            method: "GET",
          };
        },
      }),

      fetchCategory: builder.query({
        providesTags: ["Categories"],
        query: (categoryId: string) => {
          return {
            url: `/categories/find-one?id=${categoryId}`,
            method: "GET",
          };
        },
      }),

      fetchCategories: builder.query({
        providesTags: ["Categories"],
        query: (accessToken: string) => {
          return {
            url: "/categories",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      createCategory: builder.mutation({
        invalidatesTags: ["Categories"],
        query: ({ data, accessToken }) => {
          return {
            url: "/categories",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      editCategory: builder.mutation({
        invalidatesTags: ["Categories"],
        query: ({ data, accessToken }) => {
          return {
            url: "/categories",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteCategory: builder.mutation({
        invalidatesTags: ["Categories"],
        query: ({ id, accessToken }) => {
          return {
            url: `/categories?id=${id}`,
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
  useFetchProductCategoriesQuery,
  useFetchCategoryQuery,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
export { categoriesApi };
