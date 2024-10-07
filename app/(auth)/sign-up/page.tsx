"use client";

import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slash-filled-icon";
import { signUpSchema, SignUpSchema } from "@/lib/schemas/signUpSchema";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@nextui-org/modal";
import PopupModal from "@/components/popup-modal";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = methods;

const onSubmit = async (data: SignUpSchema) => {
  try {
    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        setIsError(true);
        setMessage(result.message || "Validation error occurred.");
        onOpen();
      } else {
        setIsError(true);
        setMessage("An unexpected error occurred.");
        onOpen();
      }
    } else {
      setIsError(false);
      setMessage("Sign up successfully");
      onOpen();
    }
  } catch (error) {
    setIsError(true);
    setMessage("There was an error processing your request.");
    onOpen();
  }
};

  return (
    <div className="flex justify-center h-screen items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center max-w-xl w-full gap-5 mb-20"
      >
        <h2 className="font-bold text-2xl mb-5">Create an account</h2>
        <Input
          type="text"
          label="Name"
          labelPlacement="outside"
          placeholder="name"
          fullWidth
          size="lg"
          {...register("name")}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message as string}
        />
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="example@gmail.com"
          fullWidth
          size="lg"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message as string}
        />
        <Input
          type="text"
          label="Phone"
          labelPlacement="outside"
          placeholder="099999999"
          fullWidth
          size="lg"
          {...register("phoneNumber")}
          isInvalid={!!errors.phoneNumber}
          errorMessage={errors.phoneNumber?.message as string}
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
        <Input
          label="Confirm Password"
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
          {...register("confirmPassword")}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message as string}
        />

        <div className="flex flex-col w-full items-center mt-10 gap-10">
          <Button
            color="primary"
            fullWidth
            size="lg"
            radius="full"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            <p className="text-white font-bold">Create account</p>
          </Button>
          <Link href="/">
            <p className="text-primary">back to home page</p>
          </Link>
        </div>
      </form>

      <PopupModal
        isOpen={isOpen}
        onClose={onOpenChange}
        message={message}
        isError={isError}
        buttonTitle={"Go to log in"}
        buttonFunction={() => router.push("/login")}
      />
    </div>
  );
}
