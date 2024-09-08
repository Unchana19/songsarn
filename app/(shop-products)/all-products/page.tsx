import ProductSlideComponent from "@/components/products-slide";
import ShopButtonComponent from "@/components/shop-button";
import { productsAll } from "@/data/product-all";
import { productTypes } from "@/data/product-type";
import { ProductType } from "@/types";

export default function AllProductsPage() {
  return (
    <div>
      <h2 className="font-bold text-lg">All products</h2>
      {productTypes.map((productType: ProductType) => {
        const products = productsAll.filter(
          (product) => product.type === productType.key
        );
        return (
          <ProductSlideComponent
            productType={productType}
            products={products}
            cardButton={<ShopButtonComponent size="sm" />}
            isTopSeller
          />
        );
      })}
    </div>
  );
}
