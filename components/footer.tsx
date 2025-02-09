import { Image } from "@heroui/image";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function FooterComponent() {
  return (
    <footer className="flex px-5 pt-10 pb-40 gap-10 w-full justify-center bg-default-50">
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div className="md:flex-row md:gap-16 flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-64">
            <h2 className="text-lg text-primary font-bold">Contact</h2>
            <div className="flex gap-2">
              <FaLocationDot className="text-primary mt-1" size={20} />
              <p className="text-wrap">
                85/3 หมู่ 4 ต.พระงาม อ.พรหมบุรี จ.สิงห์บุรี 16120
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary" size={17} />
              <p className="">0819201570</p>
            </div>
            <div className="flex items-center gap-2">
              <MdEmail className="text-primary" size={20} />
              <p className="">Thanabadee41301@gmail.com</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg text-primary font-bold">Office hours</h2>
            <p className="">Everyday 08:00 - 18:00</p>
          </div>
          <div className="flex flex-col">
            <Image src="/logo/songsarn-logo.png" alt="logo" height={80} />
          </div>
        </div>
      </div>
    </footer>
  );
}
