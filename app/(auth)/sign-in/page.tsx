import { Button } from "@nextui-org/button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center mt-40">
      <h1 className="text-4xl font-bold">Sign In</h1>
      <Button
        className="mt-20 px-20 py-8"
        color="primary"
        size="lg"
        startContent={<FaGoogle color="black" size={25} />}
      >
        <p className="text-black p-10 font-bold text-lg">Sign in with google</p>
      </Button>
      <Button as={Link} className="mt-5" href="/" variant="light">
        <p className="text-primary font-bold">กลับสู่หน้าแรก</p>
      </Button>
    </div>
  );
}
