"use client";

import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slash-filled-icon";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex flex-col items-center max-w-xl w-full gap-10 mb-20">
        <h2 className="font-bold text-2xl mb-5">Log in</h2>
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="example@gmail.com"
          fullWidth
          size="lg"
        />
        <Input
          label="Password"
          placeholder="xxxxxxxxxx"
          labelPlacement="outside"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          size="lg"
        />
        <Button color="primary" fullWidth size="lg" radius="full">
          <p className="text-white font-bold">Log in</p>
        </Button>

        <Divider></Divider>

        <Button
          color="primary"
          variant="bordered"
          fullWidth
          size="lg"
          radius="full"
        >
          <div className="flex items-center gap-5">
            <FaGoogle size={22} />
            <p className="text-black font-bold">Log in with google</p>
          </div>
        </Button>
        <Button
          as={Link}
          href="/sign-up"
          color="primary"
          variant="bordered"
          fullWidth
          size="lg"
          radius="full"
        >
          <p className="text-black font-bold">Create an account</p>
        </Button>
        <Link href="/">
          <p className="text-primary">back to home page</p>
        </Link>
      </div>
    </div>
  );
}
