import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Transactions"],
  endpoints(build) {
    return {
      fetchTransactions: build.query({
        providesTags: ["Transactions"],
        query: (accessToken: string) => {
          return {
            url: "/transactions",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchTransactionsQuery } = transactionsApi;
export { transactionsApi };
