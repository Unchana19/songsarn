"use client";

import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slash-filled-icon";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";
import PopupModal from "@/components/popup-modal";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/useSignUp";

export default function SignUpPage() {
  const router = useRouter();

  const {
    isVisible,
    toggleVisibility,
    message,
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    onSubmit,
    isOpen,
    onOpenChange,
  } = useSignUp();

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
        buttonTitle={"Go to log in"}
        buttonFunction={() => router.push("/login")}
      />
    </div>
  );
}
