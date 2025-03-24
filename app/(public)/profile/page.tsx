"use client";
import PopupModal from "@/components/popup-modal";
import { updateProfileSchema } from "@/lib/schemas/updateProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiImageAddFill, RiPhoneLine, RiUserLine } from "react-icons/ri";
import { isDirty } from "zod";
import { useFetchUserQuery, useUpdateUserProfileMutation } from "@/store";

export default function ProfilePage() {
  const { data: session } = useSession();

  const {
    currentData: user,
    isLoading,
    isSuccess,
  } = useFetchUserQuery(session?.userId || "");

  const [updateUserProfile, results] = useUpdateUserProfileMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<updateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isSuccess) {
      setValue("name", user.name, { shouldDirty: false });
      setValue("phone_number", user.phone_number, {
        shouldDirty: false,
      });

      if (user.img) {
        setPreviewUrl(user.img);
      }
    }
  }, [user, isSuccess, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: updateProfileSchema) => {
    try {
      const formData = new FormData();
      if (user) {
        formData.append("id", user.id);
        formData.append("name", data.name);
        formData.append("phone_number", data.phone_number);
      }

      if (selectedFile) formData.append("file", selectedFile);

      await updateUserProfile({
        data: formData,
        accessToken: session?.accessToken,
      }).then(() => {
        setMessage("Profile updated successfully");
        onOpen();
      });
    } catch (error) {
      setMessage("Profile updated failed");
      onOpen();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <Card shadow="sm" className="">
          <CardHeader className="flex flex-col gap-2 px-8 pt-8">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-default-500">Manage your account information</p>
          </CardHeader>

          <CardBody className="px-8 py-6">
            <div className="flex flex-col items-center space-y-8">
              {/* Avatar Section */}
              <label htmlFor="avatar-upload">
                <div className="relative group cursor-pointer">
                  <Avatar
                    isBordered
                    color="primary"
                    className="w-32 h-32 text-large"
                    src={previewUrl || "/default-profile/default-profile.jpg"}
                    showFallback
                    classNames={{
                      base: "transition-transform group-hover:scale-105",
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 p-2.5 bg-background border-2 border-primary rounded-full cursor-pointer">
                    <RiImageAddFill className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </label>

              {/* User Email Display */}
              <Chip
                variant="flat"
                classNames={{
                  base: "bg-primary-100/50",
                  content: "text-primary font-medium",
                }}
              >
                {user?.email}
              </Chip>

              {/* Form Section */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="space-y-8">
                  <Input
                    {...register("name")}
                    size="lg"
                    labelPlacement="outside"
                    label="Full Name"
                    placeholder="Enter your full name"
                    variant="bordered"
                    startContent={
                      <RiUserLine className="text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message as string}
                    classNames={{
                      label: "text-sm font-medium text-default-700",
                      input: "text-medium",
                    }}
                  />

                  <Input
                    {...register("phone_number")}
                    size="lg"
                    labelPlacement="outside"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    variant="bordered"
                    startContent={
                      <RiPhoneLine className="text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    isInvalid={!!errors.phone_number}
                    errorMessage={errors.phone_number?.message as string}
                    classNames={{
                      label: "text-sm font-medium text-default-700",
                      input: "text-medium",
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    color="primary"
                    className="flex-1 font-medium text-white"
                    size="lg"
                    isLoading={isSubmitting}
                    isDisabled={!isDirty || !isValid}
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>

      <PopupModal
        message={message}
        isOpen={isOpen}
        onClose={() => {
          onOpenChange();
          if (message.includes("success")) {
            // Additional success actions if needed
          }
        }}
      />
    </div>
  );
}
