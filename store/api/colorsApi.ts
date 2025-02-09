import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const colorsApi = createApi({
  reducerPath: "colorsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ["Color"],
  endpoints(builder) {
    return {
      fetchColors: builder.query({
        providesTags: ["Color"],
        query: (accessToken: string) => {
          return {
            url: "/materials/colors",
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

export const { useFetchColorsQuery } = colorsApi;
export { colorsApi };
