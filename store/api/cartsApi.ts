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
    };
  },
});

export const { useAddToCartMutation } = cartsApi;
export { cartsApi };
