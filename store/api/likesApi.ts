import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const likesApi = createApi({
  reducerPath: "likesApi",
  tagTypes: ["Likes"],
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  endpoints(build) {
    return {
      fetchLikes: build.query({
        providesTags: ["Likes"],
        query: ({ userId, accessToken }) => {
          return {
            url: `/likes?userId=${userId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
      createLike: build.mutation({
        invalidatesTags: ["Likes"],
        query: ({ data, accessToken }) => {
          return {
            url: "/likes",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
      deleteLike: build.mutation({
        invalidatesTags: ["Likes"],
        query: ({ id, accessToken }) => {
          return {
            url: `/likes?id=${id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      }),
    };
  },
});

export const {
  useFetchLikesQuery,
  useCreateLikeMutation,
  useDeleteLikeMutation,
} = likesApi;
export { likesApi };
