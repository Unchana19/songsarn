import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const bomComponentsApi = createApi({
  reducerPath: "bomComponentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["BOMComponent"],
  endpoints(build) {
    return {
      fetchBOMComponent: build.query({
        providesTags: ["BOMComponent"],
        query: ({
          componentId,
          accessToken,
        }: {
          componentId: string;
          accessToken: string;
        }) => {
          return {
            url: `/components/${componentId}`,
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

export const { useFetchBOMComponentQuery } = bomComponentsApi;
export { bomComponentsApi };
