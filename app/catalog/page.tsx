import ProductSlideComponent from "@/components/products-slide";
import ShopButtonComponent from "@/components/shop-button";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Image } from "@nextui-org/image";

export default function CatalogPage() {
  return (
    <div className="">
      <h3 className="font-bold text-lg mb-5">Catalog</h3>
      <div className="flex flex-row">
        <div className="w-1/2 flex items-center justify-center">
          <Image src="/shrine/sarnpraprom.png" />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <h2 className="font-bold text-3xl">ชุดศาลพระภูมิ</h2>
          <p>ประกอบด้วย...</p>
          <h3 className="text-lg font-bold mt-2">
            {formatNumberWithComma(85000)}
          </h3>
          <ShopButtonComponent size="md" />
        </div>
      </div>
      <div>
        <ProductSlideComponent />
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">ชุดศาลพระเจ้าที่</h2>
            <p>ประกอบด้วย...</p>
            <h3 className="text-lg font-bold mt-2">
              {formatNumberWithComma(85000)}
            </h3>
            <ShopButtonComponent size="md" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Image src="/shrine/sarnpraprom.png" />
        </div>
      </div>
    </div>
  );
}
