import { ProductCustomize, ProductFinished } from "@/app/favorite/favorite-tab";

export const calTotal = (products: ProductCustomize[] | ProductFinished[]) => {
  return (products as ProductCustomize[]).reduce(
    (total, product) => total + product.price * product.amount,
    0
  );
};
