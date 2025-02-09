import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productCategoriesApi } from "./api/productCategoriesApi";
import { productsApi } from "./api/productsApi";
import { cartsApi } from "./api/cartsApi";
import { usersApi } from "./api/usersApi";
import { bomCategoriesApi } from "./api/bomCategoriesApi";
import { componentsApi } from "./api/componentsApi";
import { colorsApi } from "./api/colorsApi";
import { cposApi } from "./api/cposApi";
import paymentsApi from "./api/paymentsApi";

export const store = configureStore({
  reducer: {
    [productCategoriesApi.reducerPath]: productCategoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartsApi.reducerPath]: cartsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [bomCategoriesApi.reducerPath]: bomCategoriesApi.reducer,
    [componentsApi.reducerPath]: componentsApi.reducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
    [cposApi.reducerPath]: cposApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      productCategoriesApi.middleware,
      productsApi.middleware,
      cartsApi.middleware,
      usersApi.middleware,
      bomCategoriesApi.middleware,
      componentsApi.middleware,
      colorsApi.middleware,
      cposApi.middleware,
      paymentsApi.middleware
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
  useCustomizeProductMutation,
  useFetchProductByIdQuery,
} from "./api/productsApi";
export { useAddToCartMutation } from "./api/cartsApi";
export { useFetchUserQuery } from "./api/usersApi";
export { useFetchBomComponentsCategoriesQuery } from "./api/bomCategoriesApi";
export { useFetchComponentsQuery } from "./api/componentsApi";
export { useFetchColorsQuery } from "./api/colorsApi";
export { useFetchCPOsByUserIdQuery, useFetchCPOByIdQuery } from "./api/cposApi";
export { useTestPaymentsMutation } from "./api/paymentsApi";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
