import type { OrderLine } from "@/interfaces/order-line.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cartsApi = createApi({
  reducerPath: "cartsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Cart", "UsersCarts"],
  endpoints(builder) {
    return {
      addToCart: builder.mutation({
        invalidatesTags: (
          _result,
          _error,
          {
            userId,
          }: {
            userId: string;
            productId: string;
            accessToken: string;
          }
        ) => {
          return [{ type: "UsersCarts", id: userId }];
        },
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
        providesTags: (result, _error, { userId }) => {
          return result
            ? [
                ...result.map(
                  (orderLine: OrderLine) =>
                    ({ type: "Cart", id: orderLine.id }) as const
                ),
                { type: "UsersCarts", id: userId },
              ]
            : [{ type: "UsersCarts", id: userId }];
        },
        query: ({
          userId,
          accessToken,
        }: {
          userId: string;
          accessToken: string;
        }) => {
          return {
            url: "/carts",
            params: { id: userId },
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      increaseQuantityById: builder.mutation({
        invalidatesTags: (
          _result,
          _error,
          {
            orderId,
          }: {
            orderId: string;
            accessToken?: string;
          }
        ) => {
          return [{ type: "Cart", id: orderId }];
        },
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
        invalidatesTags: (
          _result,
          _error,
          {
            orderId,
          }: {
            orderId: string;
            accessToken?: string;
          }
        ) => {
          return [{ type: "Cart", id: orderId }];
        },
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
        invalidatesTags: (
          _result,
          _error,
          {
            orderId,
          }: {
            orderId: string;
            accessToken?: string;
          }
        ) => {
          return [{ type: "Cart", id: orderId }];
        },
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
  useIncreaseQuantityByIdMutation,
  useDecreaseQuantityByIdMutation,
  useDeleteOrderByIdMutation,
} = cartsApi;
export { cartsApi };
