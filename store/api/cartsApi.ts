import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cartsApi = createApi({
  reducerPath: "cartsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Cart"],
  endpoints(builder) {
    return {
      addToCart: builder.mutation({
        invalidatesTags: ["Cart"],
        query: ({
          userId,
          productId,
          accessToken,
        }: {
          userId: string;
          productId: string;
          accessToken: string;
        }) => {
          return {
            url: "/carts",
            method: "POST",
            body: {
              product_id: productId,
              order_id: userId,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchCartsById: builder.query({
        providesTags: ["Cart"],
        query: ({
          userId,
          accessToken,
        }: {
          userId: string;
          accessToken: string;
        }) => {
          return {
            url: `/carts?id=${userId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchCountCartsById: builder.query({
        providesTags: ["Cart"],
        query: ({
          userId,
          accessToken,
        }: {
          userId: string;
          accessToken: string;
        }) => {
          return {
            url: `/carts/count?id=${userId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      increaseQuantityById: builder.mutation({
        invalidatesTags: ["Cart"],
        query: ({
          orderId,
          accessToken,
        }: {
          orderId: string;
          accessToken?: string;
        }) => {
          return {
            url: `/carts/${orderId}/increase`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      decreaseQuantityById: builder.mutation({
        invalidatesTags: ["Cart"],
        query: ({
          orderId,
          accessToken,
        }: {
          orderId: string;
          accessToken?: string;
        }) => {
          return {
            url: `/carts/${orderId}/decrease`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deleteOrderById: builder.mutation({
        invalidatesTags: ["Cart"],
        query: ({
          orderId,
          accessToken,
        }: {
          orderId: string;
          accessToken?: string;
        }) => {
          return {
            url: `/carts/${orderId}/delete`,
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
  useAddToCartMutation,
  useFetchCartsByIdQuery,
  useFetchCountCartsByIdQuery,
  useIncreaseQuantityByIdMutation,
  useDecreaseQuantityByIdMutation,
  useDeleteOrderByIdMutation,
} = cartsApi;
export { cartsApi };
