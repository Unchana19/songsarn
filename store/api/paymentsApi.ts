import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Payments", "CPO"],
  endpoints(build) {
    return {
      testPayments: build.mutation({
        invalidatesTags: (
          result,
          error,
          {
            data,
          }: {
            data: { cpoId: string; amount: number };
            accessToken?: string;
          }
        ) => [{ type: "CPO", id: data.cpoId }],
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
            body: JSON.stringify(data),
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const { useTestPaymentsMutation } = paymentsApi;
export default paymentsApi;
