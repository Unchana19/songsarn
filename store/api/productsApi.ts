import type { Category } from "@/interfaces/category.interface";
import type { Product } from "@/interfaces/product.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Products", "Product", "CategoryProducts"],
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
    };
  },
});

export const { useFetchProductsQuery, useFetchProductsByCategoryQuery } =
  productsApi;
export { productsApi };
