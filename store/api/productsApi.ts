import type { Category } from "@/interfaces/category.interface";
import type { Product } from "@/interfaces/product.interface";
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
        providesTags: (result, error, category: Category) => {
          const tags = result.map((product: Product) => {
            return { type: "Product", id: product.id };
          });
          tags.push({ type: "CategoryProducts", id: category.id });
          return tags;
        },
        query: (category: Category) => {
          return {
            url: "/products/find-by-category",
            params: { categoryId: category.id },
            method: "GET",
          };
        },
      }),

      fetchProductById: builder.query({
        providesTags: (result, error, id: string) => [{ type: "Product", id }],
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
    };
  },
});

export const {
  useFetchProductsQuery,
  useFetchProductsByCategoryQuery,
  useCustomizeProductMutation,
  useFetchProductByIdQuery,
} = productsApi;
export { productsApi };
