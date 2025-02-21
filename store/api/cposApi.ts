import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cposApi = createApi({
  reducerPath: "cposApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["UsersCPO", "CPO", "UsersCarts", "Dashboard"],
  endpoints(build) {
    return {
      fetchCPOsByUserId: build.query({
        providesTags: ["UsersCPO"],
        query: ({
          userId,
          accessToken,
        }: {
          userId?: string;
          accessToken?: string;
        }) => {
          return {
            url: "/customer-purchase-orders",
            method: "GET",
            params: { id: userId },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchCPOById: build.query({
        providesTags: (
          _result,
          _error,
          { id }: { id: string; accessToken?: string }
        ) => [{ type: "CPO", id }],
        query: ({ id, accessToken }: { id: string; accessToken?: string }) => {
          return {
            url: `/customer-purchase-orders/detail/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      addCPO: build.mutation({
        invalidatesTags: (
          _results,
          _error,
          {
            data,
          }: {
            data: {
              user_id: string;
              delivery_price: number;
              address: string;
              total_price: number;
              phone_number: string;
              payment_method: string;
              order_lines: {
                id: string;
                product_id: string;
                quantity: number;
              }[];
            };
            accessToken: string;
          }
        ) => [
          "UsersCPO",
          "Dashboard",
          { type: "UsersCarts", id: data.user_id },
        ],
        query: ({
          data,
          accessToken,
        }: {
          data: {
            user_id: string;
            delivery_price: number;
            address: string;
            total_price: number;
            phone_number: string;
            payment_method: string;
            order_lines: {
              id: string;
              product_id: string;
              quantity: number;
            }[];
          };
          accessToken: string;
        }) => {
          return {
            url: "/customer-purchase-orders",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchCPOByManager: build.query({
        providesTags: ["UsersCPO", "CPO"],
        query: (accessToken: string) => {
          return {
            url: "/customer-purchase-orders/manager",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchCPOByIdByManager: build.query({
        providesTags: ["CPO"],
        query: ({ id, accessToken }: { id: string; accessToken: string }) => {
          return {
            url: `/customer-purchase-orders/manager/detail/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      processCPO: build.mutation({
        invalidatesTags: ["CPO"],
        query: ({ id, accessToken }: { id: string; accessToken: string }) => {
          return {
            url: `/customer-purchase-orders/manager/process/${id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      finishedProcessCPO: build.mutation({
        invalidatesTags: ["CPO"],
        query: ({ id, accessToken }: { id: string; accessToken: string }) => {
          return {
            url: `/customer-purchase-orders/manager/finished-process/${id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      deliveryCPO: build.mutation({
        invalidatesTags: ["CPO"],
        query: ({ id, accessToken }: { id: string; accessToken: string }) => {
          return {
            url: `/customer-purchase-orders/manager/delivery/${id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      completedCPO: build.mutation({
        invalidatesTags: ["CPO"],
        query: ({ id, accessToken }: { id: string; accessToken: string }) => {
          return {
            url: `/customer-purchase-orders/manager/delivery-completed/${id}`,
            method: "PATCH",
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
  useFetchCPOsByUserIdQuery,
  useFetchCPOByIdQuery,
  useAddCPOMutation,
  useFetchCPOByManagerQuery,
  useFetchCPOByIdByManagerQuery,
  useProcessCPOMutation,
  useFinishedProcessCPOMutation,
  useDeliveryCPOMutation,
  useCompletedCPOMutation,
} = cposApi;
export { cposApi };
