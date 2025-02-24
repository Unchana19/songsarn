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
import { materialsApi } from "./api/materialsApi";
import { bomComponentsApi } from "./api/bomComponentsApi";
import { bomProductsApi } from "./api/bomProductsApi";
import { mposApi } from "./api/mposApi";
import { requisitionsApi } from "./api/requisitionsApi";
import { historyApi } from "./api/historyApi";
import { transactionsApi } from "./api/transactionsApi";
import { deliveryApi } from "./api/deliveryApi";

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
    [materialsApi.reducerPath]: materialsApi.reducer,
    [bomComponentsApi.reducerPath]: bomComponentsApi.reducer,
    [bomProductsApi.reducerPath]: bomProductsApi.reducer,
    [mposApi.reducerPath]: mposApi.reducer,
    [requisitionsApi.reducerPath]: requisitionsApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
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
      dashboardApi.middleware,
      materialsApi.middleware,
      bomComponentsApi.middleware,
      bomProductsApi.middleware,
      mposApi.middleware,
      requisitionsApi.middleware,
      historyApi.middleware,
      transactionsApi.middleware,
      deliveryApi.middleware
    );
  },
});

setupListeners(store.dispatch);

export {
  useFetchProductCategoriesQuery,
  useFetchComponentCategoriesQuery,
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
  useFetchStaffQuery,
  useAddStaffMutation,
  useDeleteStaffMutation,
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useUpdateUserAddressMutation,
} from "./api/usersApi";
export {
  useFetchBomComponentsCategoriesQuery,
  useFetchBomCategoriesQuery,
} from "./api/bomCategoriesApi";
export {
  useFetchComponentsQuery,
  useFetchComponentsByCategoryIdQuery,
  useCreateComponentMutation,
  useEditComponentMutation,
  useDeleteComponentMutation,
} from "./api/componentsApi";
export { useFetchColorsQuery } from "./api/colorsApi";
export {
  useFetchCPOsByUserIdQuery,
  useFetchCPOByIdQuery,
  useAddCPOMutation,
  useFetchCPOByManagerQuery,
  useFetchCPOByIdByManagerQuery,
  useProcessCPOMutation,
  useFinishedProcessCPOMutation,
  useDeliveryCPOMutation,
  useCompletedCPOMutation,
} from "./api/cposApi";
export { useTestPaymentsMutation } from "./api/paymentsApi";
export { useFetchDashboardQuery } from "./api/dashboardApi";
export {
  useFetchMaterialsQuery,
  useCreateMaterialsMutation,
  useUpdateMaterialsMutation,
  useDeleteMaterialsMutation,
} from "./api/materialsApi";
export { useFetchBOMComponentQuery } from "./api/bomComponentsApi";
export { useFetchBOMProductQuery } from "./api/bomProductsApi";
export {
  useFetchMPOsQuery,
  useFetchMPOByIdQuery,
  useCreateMPOMutation,
  useEditMPOOrderLineMutation,
  useReceiveMPOMutation,
  useCancelMPOMutation,
} from "./api/mposApi";
export {
  useFetchRequisitionsQuery,
  useCreateRequisitionMutation,
} from "./api/requisitionsApi";
export { useFetchHistoriesQuery } from "./api/historyApi";
export { useFetchTransactionsQuery } from "./api/transactionsApi";
export { useCalculateDeliveryPriceMutation } from "./api/deliveryApi";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
