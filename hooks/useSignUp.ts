import { type SignUpSchema, signUpSchema } from "@/lib/schemas/signUpSchema";
import { useSignUpMutation } from "@/store";
import { useDisclosure } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useSignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [signUp] = useSignUpMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [message, setMessage] = useState("");

  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data: SignUpSchema) => {
    try {
      await signUp(data).unwrap();
    } catch (error) {
      setMessage("There was an error processing your request.");
      onOpen();
    } finally {
      setMessage("Account created successfully.");
      onOpen();
    }
  };

  return {
    isVisible,
    toggleVisibility,
    message,
    setMessage,
    methods,
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    onSubmit,
    isOpen,
    onOpen,
    onOpenChange,
    reset,
  };
}
