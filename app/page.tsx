"use client";

import CategoryCard from "@/components/categoy-card";
import type { Category } from "@/interfaces/category.interface";
import { Button } from "@heroui/button";
import Link from "next/link";
import BenefitsSection from "@/components/home/benefit-section";
import CustomShrineSection from "@/components/home/custom-section";
import { FaArrowRightLong } from "react-icons/fa6";
import { useFetchProductCategoriesQuery, useFetchProductsQuery } from "@/store";
import Image from "next/image";
import ImagePlaceholder from "@/components/image-placeholder";
import Loading from "./loading";
import { Product } from "@/interfaces/product.interface";

export default function HomePage() {
  const {
    data: productCategories,
    error,
    isLoading,
  } = useFetchProductCategoriesQuery({});

  const { data: products, isLoading: isLoadingProducts } =
    useFetchProductsQuery({});

  if (isLoading || error || isLoadingProducts) {
    return <Loading />;
  }

  return (
    <div className="bg-white">
      <div className="relative w-full min-h-[80vh] md:min-h-[70vh] lg:min-h-[75vh] flex items-center bg-gradient-to-br from-white via-[#FFF9E6] to-[#FFF5D6] py-8 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-[#B89B30]/10 to-[#EAD98A]/10 animate-gradient-shift bg-[length:200%_200%]"></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#B89B30]/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#EAD98A]/20 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 lg:gap-16 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-8 w-full md:w-1/2 lg:w-5/12">
            <div className="space-y-3 md:space-y-6">
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#B89B30] via-[#D4AF37] to-[#E7D594] bg-clip-text text-transparent">
                    Songsarn
                  </span>
                </h1>
                <div className="hidden md:block absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#B89B30] to-[#D4AF37]"></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-medium">
                สร้างสรรค์ด้วยใจ เพื่อความเป็นสิริมงคล
              </p>
              <p className="text-base md:text-lg text-gray-600">
                เสริมดวง เสริมบารมี นำพาความเจริญรุ่งเรือง
              </p>
            </div>
            <div className="pt-2 md:pt-4">
              <Button
                as={Link}
                href="/all-products"
                className="bg-gradient-to-r from-[#D4AF37] to-[#B89B30] hover:from-[#B89B30] hover:to-[#D4AF37]
                           text-white font-bold transition-all duration-300 px-6 md:px-8 py-2.5 md:py-3 rounded-lg
                           text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2.5
                           border border-[#B89B30]/20 relative overflow-hidden group"
                size="lg"
              >
                <span className="relative z-10">เลือกชมศาลพระภูมิทั้งหมด</span>
                <FaArrowRightLong className="text-base md:text-lg relative z-10" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                ></div>
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center md:justify-end">
            {products && products.length > 0 ? (
              <div className="w-full max-w-4xl lg:max-w-5xl relative h-[400px] md:h-[500px] lg:h-[600px]">
                <div className="relative flex items-center justify-center gap-4">
                  {products
                    .slice(0, 3)
                    .map((product: Product, index: number) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className={`group relative transition-all duration-500 ease-out 
                          ${
                            index === 1
                              ? "w-[280px] md:w-[350px] lg:w-[450px] h-[320px] md:h-[400px] lg:h-[500px] z-30 animate-fade-in"
                              : "w-[220px] md:w-[280px] lg:w-[350px] h-[260px] md:h-[320px] lg:h-[400px] z-10 opacity-90 hover:opacity-100"
                          } rounded-2xl overflow-hidden hover:shadow-lg animate-slide-up`}
                        style={{
                          transform:
                            index === 1
                              ? "translateX(0)"
                              : index === 0
                                ? "translateX(-10%) translateY(5%)"
                                : "translateX(10%) translateY(5%)",
                          animationDelay: `${index * 200}ms`,
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-primary-700/10 via-transparent to-transparent z-10 
                          group-hover:from-black/10 transition-all duration-300"
                        ></div>
                        {product.img ? (
                          <Image
                            src={product.img}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={index === 1}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gray-50">
                            <ImagePlaceholder
                              name={product.name.slice(0, 10)}
                              classNames={"opacity-50"}
                            />
                          </div>
                        )}
                        <div
                          className="absolute bottom-0 left-0 right-0 p-6 text-gray-600 z-20 transform transition-transform duration-300
                          translate-y-2 group-hover:translate-y-0"
                        >
                          <h3
                            className={`${
                              index === 1
                                ? "md:text-xl text-md"
                                : "md:text-lg text-sm"
                            } font-medium tracking-wide drop-shadow-md`}
                          >
                            {product.name}
                          </h3>
                          {index === 1 && (
                            <div className="flex items-center gap-2 text-gray-600/90 text-sm mt-2">
                              <span>ดูรายละเอียด</span>
                              <FaArrowRightLong className="text-sm transition-transform group-hover:translate-x-1" />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-96 lg:h-[500px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                (ไม่มีสินค้าแนะนำ)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white py-16 sm:py-20">
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              หมวดหมู่ศาลพระภูมิ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#B89B30] via-[#D4AF37] to-[#B89B30] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productCategories?.map((category: Category) => (
              <div key={category.id}>
                <Link
                  href={`/all-products?category=${category.id}`}
                  className="block group transition-transform duration-300 hover:-translate-y-1"
                >
                  <CategoryCard category={category} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CustomShrineSection />

      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <BenefitsSection />
        </div>
      </div>
    </div>
  );
}
