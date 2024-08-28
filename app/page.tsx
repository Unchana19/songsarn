import ProductCard from "@/components/product-card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
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
    <main>
      <section className="flex gap-5 overflow-x-auto p-2">
        {productTypes.map((productType) => (
          <ProductCard
            key={productType.label}
            image={productType.image}
            label={productType.label}
          />
        ))}
      </section>
      <section className="flex flex-col md:flex-row mt-10 md:justify-between items-center p-2">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-6xl font-bold leading-relaxed text-center">
            Top 5 Best Sellers
          </p>
          <p className="text-xl py-2">ศาลพระภูมิ 5 อันดับที่ขายดีที่สุด!</p>
          <Button color="primary" className="mt-5 w-1/2" size="lg">
            <p className="text-black text-xl">Shop now</p>
          </Button>
        </div>
        <div>
          <Image src="/shrine/sarnpraprom.png" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
