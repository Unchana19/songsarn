import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Products", "Product", "CategoryProducts", "Cart"],
  endpoints(builder) {
    return {
      fetchProducts: builder.query({
        providesTags: ["Products"],
        query: () => {
          return {
            url: "/products",
            method: "GET",
          };
        },
      }),

      fetchProductsByCategory: builder.query({
        providesTags: ["Products", "CategoryProducts"],
        query: (categoryId: string) => {
          return {
            url: `/products/find-by-category?categoryId=${categoryId}`,
            method: "GET",
          };
        },
      }),

      fetchProductById: builder.query({
        providesTags: (_result, _error, id: string) => [
          { type: "Product", id },
        ],
        query: (id: string) => {
          return {
            url: "/products/find-by-id",
            params: { id },
            method: "GET",
          };
        },
      }),

      customizeProduct: builder.mutation({
        invalidatesTags: ["Products", "Cart"],
        query: ({
          data,
          accessToken,
        }: {
          data: {
            user_id?: string;
            category_id: string;
            price: number;
            quantity: number;
            components: {
              id?: string;
              primary_color?: string;
              pattern_color?: string;
            }[];
          };
          accessToken: string;
        }) => {
          return {
            url: "/products/customize",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      createProduct: builder.mutation({
        invalidatesTags: ["Product"],
        query: ({ data, accessToken }) => {
          return {
            url: "/products",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      editProduct: builder.mutation({
        invalidatesTags: ["Product"],
        query: ({ data, accessToken }) => {
          return {
            url: "/products",
            method: "PATCH",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteProduct: builder.mutation({
        invalidatesTags: ["Product"],
        query: ({ id, accessToken }) => {
          return {
            url: `/products?id=${id}`,
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
  useFetchProductsQuery,
  useFetchProductsByCategoryQuery,
  useCustomizeProductMutation,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} = productsApi;
export { productsApi };
