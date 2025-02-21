import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["History"],
  endpoints(build) {
    return {
      fetchHistories: build.query({
        providesTags: ["History"],
        query: (accessToken: string) => {
          return {
            url: "/history",
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

export const { useFetchHistoriesQuery } = historyApi;
export { historyApi };
