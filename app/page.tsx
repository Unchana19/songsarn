"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/components/categoy-card";
import { Category } from "@/interfaces/category.interface";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { motion } from "framer-motion";
import BenefitsSection from "@/components/home/benefit-section";
import CustomShrineSection from "@/components/home/custom-section";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const session = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories/product-categories");
      const result = await response.json();
      if (response.ok) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [session]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  if (isLoading) {
    return <div className="w-full h-screen bg-white" />;
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-[100vh] md:h-screen flex items-center justify-center px-4 py-12 md:py-0">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('/home/hero-section.png')] 
      bg-no-repeat bg-center bg-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/5 via-primary-50/80 to-primary-800/30" />
        </div>

        <motion.div
          className="relative w-full mx-auto rounded-3xl p-4 sm:p-8 md:p-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center justify-center text-center gap-8 md:gap-16">
            <motion.div
              className="w-full max-w-3xl space-y-6 md:space-y-8"
              {...fadeInUp}
            >
              <div className="space-y-4 md:space-y-6">
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span className="bg-gradient-to-tl from-primary-300 via-primary-600  to-primary-400 bg-clip-text text-transparent">
                    Songsarn
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl sm:text-3xl md:text-4xl text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  สร้างสรรค์ด้วยใจ เพื่อความเป็นสิริมงคล
                </motion.p>
                <motion.p
                  className="text-lg sm:text-xl md:text-2xl text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  เสริมดวง เสริมบารมี นำพาความเจริญรุ่งเรือง
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex justify-center pt-4"
              >
                <Button
                  as={Link}
                  href="/all-products"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B89B30] hover:from-[#B89B30] hover:to-[#D4AF37] 
              text-white font-bold transition-all duration-300 px-6 sm:px-12 py-5 md:py-8 rounded-full 
              text-base sm:text-lg shadow-lg hover:shadow-xl w-full sm:w-auto
              hover:scale-105 transform"
                  size="lg"
                >
                  <p>เลือกชมศาลพระภูมิ</p>
                  <FaArrowRightLong />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Categories Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16 sm:py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-[#D4AF37] to-[#B89B30] bg-clip-text text-transparent py-2">
          หมวดหมู่ศาลพระภูมิ
        </h2>
        <div className="flex justify-start md:justify-center gap-4 sm:gap-8 overflow-x-auto pb-8 scrollbar-hide px-2 snap-x snap-mandatory">
          {categories.map((category: Category) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 snap-center"
            >
              <Link
                href={`/all-products/${category.id}`}
                className="min-w-48 sm:min-w-56 md:min-w-64 cursor-pointer"
              >
                <CategoryCard category={category} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Customization Section */}
      <CustomShrineSection />

      {/* Benefits Section */}
      <div className="mx-auto px-4 py-16 sm:py-24">
        <BenefitsSection />
      </div>
    </div>
  );
}
