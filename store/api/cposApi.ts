import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cposApi = createApi({
  reducerPath: "cposApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["CPOs", "CPO"],
  endpoints(build) {
    return {
      fetchCPOsByUserId: build.query({
        providesTags: ["CPOs"],
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
    };
  },
});

export const { useFetchCPOsByUserIdQuery, useFetchCPOByIdQuery } = cposApi;
export { cposApi };
