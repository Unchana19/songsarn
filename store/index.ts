import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productCategoriesApi } from "./api/productCategoriesApi";
import { productsApi } from "./api/productsApi";
import { cartsApi } from "./api/cartsApi";

export const store = configureStore({
  reducer: {
    [productCategoriesApi.reducerPath]: productCategoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartsApi.reducerPath]: cartsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      productCategoriesApi.middleware,
      productsApi.middleware,
      cartsApi.middleware
    );
  },
});

setupListeners(store.dispatch);

export {
  useFetchProductCategoriesQuery,
  useFetchProductCategoryQuery,
} from "./api/productCategoriesApi";
export {
  useFetchProductsQuery,
  useFetchProductsByCategoryQuery,
} from "./api/productsApi";
export { useAddToCartMutation } from "./api/cartsApi";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
