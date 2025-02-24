import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const deliveryApi = createApi({
  reducerPath: "deliveryApi",
  tagTypes: ["Delivery"],
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  endpoints(build) {
    return {
      calculateDeliveryPrice: build.mutation({
        invalidatesTags: ["Delivery"],
        query: (data) => {
          return {
            url: "/delivery/calculate-fee",
            method: "POST",
            body: data,
          };
        },
      }),
    };
  },
});

export const { useCalculateDeliveryPriceMutation } = deliveryApi;
export { deliveryApi };
