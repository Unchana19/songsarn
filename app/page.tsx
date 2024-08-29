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
    <div>
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
          <h1 className="text-6xl font-bold leading-relaxed text-center">
            Top 5 Best Sellers
          </h1>
          <p className="text-xl py-2">ศาลพระภูมิ 5 อันดับที่ขายดีที่สุด!</p>
          <Button color="primary" className="mt-10 w-1/2" size="lg">
            <p className="text-black text-xl font-bold">Shop now</p>
          </Button>
        </div>
        <div>
          <Image src="/shrine/sarnpraprom.png" />
        </div>
      </section>

      <section className="flex flex-col md:flex-row mt-8 md:justify-between items-center p-2">
        <div>
          <Image src="/shrine/sarnpraprom.png" />
        </div>
        <div className="flex flex-col items-center md:items-end max-w-1/2">
          <h2 className="text-5xl font-bold leading-relaxed md:text-end text-center">
            Discover And
          </h2>
          <h2 className="text-5xl font-bold leading-relaxed md:text-end text-center">
            Choose A Good Shrine
          </h2>
          <h2 className="text-5xl font-bold leading-relaxed md:text-end text-center">
            For Your Guardian Spirit
          </h2>
          <div className="flex gap-8 w-full mt-10">
            <Button color="primary" className="w-full" size="lg">
              <p className="text-black text-xl font-bold">Catalog</p>
            </Button>
            <Button color="primary" className="w-full" size="lg">
              <p className="text-black text-xl font-bold">Customize</p>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row mt-20 mb-40 justify-center items-center gap-32">
        <div className="max-w-md">
          <h2 className="text-5xl font-bold leading-relaxed md:text-start text-center">
            Delivery And
          </h2>
          <h2 className="text-5xl font-bold leading-relaxed md:text-start text-center">
            Installation Service
          </h2>
          <p className="text-xl py-2 text-center mt-5 md:mt-0 md:text-start">
            บริการจัดส่งทั่วประเทศ ขนส่งสินค้าทุกชิ้นอย่างระมัดระวัง
            รับประกันความปลอดภัยของสินค้า บริการติดตั้งฟรี โดยทีมช่างมืออาชีพ
          </p>
        </div>
        <div className="max-w-xl">
          <Image src="/home/truck.png" width={250} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
