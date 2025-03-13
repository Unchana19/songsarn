import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Payments", "CPO", "UsersCPO"],
  endpoints(build) {
    return {
      testPayments: build.mutation({
        invalidatesTags: (
          _result,
          _error,
          {
            data,
          }: {
            data: { cpoId: string; amount: number };
            accessToken?: string;
          }
        ) => [{ type: "CPO", id: data.cpoId }, "UsersCPO"],
        query: ({
          data,
          accessToken,
        }: {
          data: { cpoId: string; amount: number };
          accessToken?: string;
        }) => {
          return {
            url: "/payments/test-payment",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      fetchQRPayment: build.query({
        providesTags: ["Payments"],
        query: ({ data, accessToken }) => {
          return {
            url: "/payments/generate-qr",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      verifySlip: build.mutation({
        invalidatesTags: ["Payments"],
        query: ({ data, accessToken }) => {
          return {
            url: "/payments/verify-slip",
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
  useTestPaymentsMutation,
  useFetchQRPaymentQuery,
  useVerifySlipMutation,
} = paymentsApi;
export default paymentsApi;
