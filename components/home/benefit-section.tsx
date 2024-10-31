import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { IoSparkles } from "react-icons/io5";
import { FaTruck } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <IoSparkles size={35} />,
      title: "ออกแบบตามหลักฮวงจุ้ย",
      description:
        "ผลิตภัณฑ์ทุกชิ้นได้รับการออกแบบโดยซินแสผู้เชี่ยวชาญ เพื่อเสริมฮวงจุ้ยและความเป็นสิริมงคล",
    },
    {
      icon: <FaTruck size={35} />,
      title: "จัดส่งทั่วประเทศ ติดตั้งฟรี",
      description:
        "บริการจัดส่งด่วนพิเศษทั่วประเทศ พร้อมบริการติดตั้งฟรีโดยทีมช่างมืออาชีพที่ผ่านการอบรม",
    },
    {
      icon: <FaHandshakeSimple size={35} />,
      title: "รับประกันความพึงพอใจ",
      description:
        "มั่นใจในคุณภาพทุกชิ้นงาน รับประกันผลิตภัณฑ์นาน 1 ปีเต็ม พร้อมบริการหลังการขายตลอดอายุการใช้งาน",
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            บริการของเรา
          </h2>
          <p className="text-gray-600 text-xl">
            มั่นใจในคุณภาพและบริการที่เหนือระดับ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card shadow="sm" className="h-full hover:shadow-xl transition-shadow duration-300 shadow-primary">
                <CardBody className="flex flex-col items-center text-center p-6">
                  <div className="mb-6 text-primary">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
