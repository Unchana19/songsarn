import ProductSlideComponent from "@/components/products-slide";


const productTypes = [
  "ศาลพระหรหม",
  "ศาลพระภูมิ",
  "ศาลพระเจ้าที่",
  "ศาลพระตายาย",
  "โต๊ะหน้าศาล",
  "อุปกรณ์ประกอบศาล",
];

export default function AllProductsPage() {
  return (
    <div>
      <h2 className="font-bold text-lg">All products</h2>
        {productTypes.map((productType) => (
          <ProductSlideComponent productType={productType} />
        ))}
    </div>
  );
}
