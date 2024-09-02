import ProductSlideComponent from "@/components/products-slide";
import ShopButtonComponent from "@/components/shop-button";
import { Product } from "@/types";

const productTypes = [
  "ศาลพระหรหม",
  "ศาลพระภูมิ",
  "ศาลพระเจ้าที่",
  "ศาลพระตายาย",
  "โต๊ะหน้าศาล",
  "อุปกรณ์ประกอบศาล",
];

const products = [
  { name: "ศาลพระพรหมทรงไทย", price: 45000, image: "/shrine/sarnpraprom.png" },
  { name: "ศาลพระพรหมทรงไทย", price: 45000, image: "/shrine/sarnpraprom.png" },
  { name: "ศาลพระพรหมทรงไทย", price: 45000, image: "/shrine/sarnpraprom.png" },
  { name: "ศาลพระพรหมทรงไทย", price: 45000, image: "/shrine/sarnpraprom.png" },
] as Product[];

export default function AllProductsPage() {
  return (
    <div>
      <h2 className="font-bold text-lg">All products</h2>
      {productTypes.map((productType) => (
        <ProductSlideComponent
          productType={productType}
          products={products}
          cardButton={<ShopButtonComponent size="sm" />}
          isTopSeller
        />
      ))}
    </div>
  );
}
