import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const requisitionsApi = createApi({
  reducerPath: "requisitionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Requisition"],
  endpoints(build) {
    return {
      fetchRequisitions: build.query({
        providesTags: ["Requisition"],
        query: (accessToken: string) => {
          return {
            url: "/requisitions",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),

      createRequisition: build.mutation({
        invalidatesTags: ["Requisition"],
        query: ({ data, accessToken }) => {
          return {
            url: "/requisitions",
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

export const { useFetchRequisitionsQuery, useCreateRequisitionMutation } =
  requisitionsApi;
export { requisitionsApi };
