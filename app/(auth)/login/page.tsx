"use client";

import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slash-filled-icon";
import PopupModal from "@/components/popup-modal";
import { LoginSchema, loginSchema } from "@/lib/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      setIsError(true);
      setMessage(result.error);
      onOpen();
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center max-w-xl w-full gap-10 mb-20"
      >
        <h2 className="font-bold text-2xl mb-5">Log in</h2>
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="example@gmail.com"
          fullWidth
          size="lg"
          isClearable
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message as string}
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
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message as string}
        />
        <Button
          type="submit"
          color="primary"
          fullWidth
          size="lg"
          radius="full"
          isLoading={isSubmitting}
          isDisabled={!isValid}
        >
          <p className="text-white font-bold">Log in</p>
        </Button>

        <Divider></Divider>

        <Button
          color="primary"
          variant="bordered"
          fullWidth
          size="lg"
          radius="full"
          onClick={handleGoogleLogin}
        >
          <div className="flex items-center gap-5">
            <FaGoogle size={22} />
            <p className="text-black font-bold">Log in with Google</p>
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
          <p className="text-primary">Back to home page</p>
        </Link>
      </form>
      <PopupModal
        isOpen={isOpen}
        onClose={onOpenChange}
        message={message}
        buttonTitle={"Go to log in"}
        buttonFunction={() => {}}
      />
    </div>
  );
}
