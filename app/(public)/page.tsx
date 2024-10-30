"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/components/categoy-card";
import { Category } from "@/interfaces/category.interface";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BenefitsSection from "@/components/benefit-section";

export default function HomePage() {
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
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl my-4 sm:my-8 p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <motion.div
            className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left"
            {...fadeInUp}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Top 5 Best Sellers
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              ศาลพระภูมิยอดนิยม 5 อันดับแรก
            </p>
            <p className="text-lg sm:text-xl text-gray-600">
              เสริมดวง หน้าที่การงานและสุขภาพ
            </p>
            <Button
              as={Link}
              href="/all-products"
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full"
              size="lg"
            >
              Shop now
            </Button>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 mt-6 md:mt-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/home/top.png"
              className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              height={400}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Scroll */}
      <motion.div
        className="my-8 sm:my-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-2">
          Browse Categories
        </h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2">
          {categories.map((category: Category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/all-products/${category.id}`}
                className="min-w-36 sm:min-w-48 cursor-pointer"
              >
                <CategoryCard category={category} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Customization Section */}
      <motion.div
        className="my-12 sm:my-24 bg-gray-50 rounded-3xl p-6 sm:p-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="/home/protect.png"
              className="w-full h-auto object-cover rounded-2xl"
              height={400}
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Discover And Choose A Good Shrine For Your Guardian Spirit
            </h2>
            <Button
              as={Link}
              href="/create-shrine"
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full"
              size="lg"
            >
              Customize Now
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Delivery Section */}
      <BenefitsSection />

      {/* Sticky Contact Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            as={Link}
            href="/contact"
            className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
