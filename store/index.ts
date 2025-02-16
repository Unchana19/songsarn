import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { categoriesApi } from "./api/categoriesApi";
import { productsApi } from "./api/productsApi";
import { cartsApi } from "./api/cartsApi";
import { usersApi } from "./api/usersApi";
import { bomCategoriesApi } from "./api/bomCategoriesApi";
import { componentsApi } from "./api/componentsApi";
import { colorsApi } from "./api/colorsApi";
import { cposApi } from "./api/cposApi";
import paymentsApi from "./api/paymentsApi";
import { dashboardApi } from "./api/dashboardApi";

export const store = configureStore({
  reducer: {
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartsApi.reducerPath]: cartsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [bomCategoriesApi.reducerPath]: bomCategoriesApi.reducer,
    [componentsApi.reducerPath]: componentsApi.reducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
    [cposApi.reducerPath]: cposApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      categoriesApi.middleware,
      productsApi.middleware,
      cartsApi.middleware,
      usersApi.middleware,
      bomCategoriesApi.middleware,
      componentsApi.middleware,
      colorsApi.middleware,
      cposApi.middleware,
      paymentsApi.middleware,
      dashboardApi.middleware
    );
  },
});

setupListeners(store.dispatch);

export {
  useFetchProductCategoriesQuery,
  useFetchCategoryQuery,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} from "./api/categoriesApi";
export {
  useFetchProductsQuery,
  useFetchProductsByCategoryQuery,
  useCustomizeProductMutation,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "./api/productsApi";
export {
  useAddToCartMutation,
  useFetchCartsByIdQuery,
  useIncreaseQuantityByIdMutation,
  useDecreaseQuantityByIdMutation,
  useDeleteOrderByIdMutation,
} from "./api/cartsApi";
export {
  useFetchUserQuery,
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useUpdateUserAddressMutation,
} from "./api/usersApi";
export { useFetchBomComponentsCategoriesQuery } from "./api/bomCategoriesApi";
export {
  useFetchComponentsQuery,
  useCreateComponentMutation,
  useEditComponentMutation,
  useDeleteComponentMutation,
} from "./api/componentsApi";
export { useFetchColorsQuery } from "./api/colorsApi";
export {
  useFetchCPOsByUserIdQuery,
  useFetchCPOByIdQuery,
  useAddCPOMutation,
} from "./api/cposApi";
export { useTestPaymentsMutation } from "./api/paymentsApi";
export { useFetchDashboardQuery } from "./api/dashboardApi";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
