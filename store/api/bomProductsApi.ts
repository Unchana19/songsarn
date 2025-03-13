import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const bomProductsApi = createApi({
  reducerPath: "bomProductsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["BOMProduct"],
  endpoints(build) {
    return {
      fetchBOMProduct: build.query({
        providesTags: ["BOMProduct"],
        query: ({
          productId,
          accessToken,
        }: {
          productId: string;
          accessToken: string;
        }) => {
          return {
            url: `/products/${productId}`,
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

export const { useFetchBOMProductQuery } = bomProductsApi;
export { bomProductsApi };
