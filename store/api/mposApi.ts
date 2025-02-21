import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mposApi = createApi({
  reducerPath: "mposApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["MPO", "Requisition"],
  endpoints(build) {
    return {
      fetchMPOs: build.query({
        providesTags: ["MPO"],
        query: (accessToken: string) => {
          return {
            url: "/material-purchase-orders",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchMPOById: build.query({
        providesTags: ["MPO"],
        query: ({ id, accessToken }) => {
          return {
            url: `/material-purchase-orders/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      createMPO: build.mutation({
        invalidatesTags: ["MPO", "Requisition"],
        query: ({ data, accessToken }) => {
          return {
            url: "/material-purchase-orders",
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: data,
          };
        },
      }),

      editMPOOrderLine: build.mutation({
        invalidatesTags: ["MPO"],
        query: ({ data, accessToken }) => {
          return {
            url: "/material-purchase-orders/mpo-order-line",
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: data,
          };
        },
      }),

      receiveMPO: build.mutation({
        invalidatesTags: ["MPO"],
        query: ({ id, accessToken }) => {
          return {
            url: "/material-purchase-orders/receive",
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ id }),
          };
        },
      }),

      cancelMPO: build.mutation({
        invalidatesTags: ["MPO"],
        query: ({ id, accessToken }) => {
          return {
            url: "/material-purchase-orders/cancel",
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ id }),
          };
        },
      }),
    };
  },
});

export const {
  useFetchMPOsQuery,
  useFetchMPOByIdQuery,
  useCreateMPOMutation,
  useEditMPOOrderLineMutation,
  useReceiveMPOMutation,
  useCancelMPOMutation,
} = mposApi;
export { mposApi };
