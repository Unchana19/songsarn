import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { FaArrowRightLong } from "react-icons/fa6";

const CustomShrineSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="rounded-3xl p-6 sm:p-12 md:p-20">
        <div className="flex flex-col items-center text-center gap-8 sm:gap-16">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Image
                src="/home/custom-section.png"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl relative opacity-5 bg-gradient-to-tl from-primary-50 to-primary-200"
                height={400}
                alt="ศาลพระภูมิ"
              />
            </div>
          </div>
          <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-loose bg-gradient-to-r from-[#D4AF37] to-[#B89B30] bg-clip-text text-transparent px-4 py-2">
              ออกแบบศาลพระภูมิในแบบของคุณ
            </h2>
            <div className="flex justify-center mt-5">
              <Button
                as={Link}
                href="/create-shrine"
                className="bg-gradient-to-r from-[#D4AF37] to-[#B89B30] hover:from-[#B89B30] hover:to-[#D4AF37] text-white font-bold transition-all duration-300 px-6 sm:px-12 py-5 md:py-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl w-full sm:w-auto mx-4"
                size="lg"
              >
                <p>ออกแบบเลย</p>
                <FaArrowRightLong />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomShrineSection;
