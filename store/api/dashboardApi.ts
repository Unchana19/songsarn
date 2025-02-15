import type { TimeFrame } from "@/enums/timeframe.enum";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Dashboard"],
  endpoints(build) {
    return {
      fetchDashboard: build.query({
        providesTags: ["Dashboard"],
        query: ({
          timeframe,
          date,
          accessToken,
        }: {
          timeframe: TimeFrame;
          date: Date;
          accessToken: string;
        }) => {
          return {
            url: `/dashboard?timeframe=${timeframe}&date=${date}`,
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

export const { useFetchDashboardQuery } = dashboardApi;
export { dashboardApi };
