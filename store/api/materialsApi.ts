import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const materialsApi = createApi({
  reducerPath: "materialsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Materials"],
  endpoints(build) {
    return {
      fetchMaterials: build.query({
        providesTags: ["Materials"],
        query: (accessToken: string) => {
          return {
            url: "/materials",
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

export const { useFetchMaterialsQuery } = materialsApi;
export { materialsApi };
