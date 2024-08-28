import ProductCard from "@/components/product-card";
import { NextPage } from "next";

interface Props {}

const productTypes = [
  { image: "/shrine/sarnpraprom.png", label: "ศาลพระพรหม" },
  { image: "/shrine/sarnpraprom.png", label: "ศาลพระภูมิ" },
  { image: "/shrine/sarnpraprom.png", label: "ศาลเจ้าที่" },
  { image: "/shrine/sarnpraprom.png", label: "ศาลตายาย" },
  { image: "/shrine/sarnpraprom.png", label: "โต๊ะหน้าศาล" },
  { image: "/shrine/sarnpraprom.png", label: "อุปกรณ์ประกอบศาล" },
];

const HomePage: NextPage<Props> = () => {
  return (
    <div>
      <div className="flex gap-5 overflow-x-auto p-2">
        {productTypes.map((productType) => (
          <ProductCard
            key={productType.label}
            image={productType.image}
            label={productType.label}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
