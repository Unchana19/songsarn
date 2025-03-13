"use client";

import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slash-filled-icon";
import { useSignUp } from "@/hooks/useSignUp";
import {
  useAddStaffMutation,
  useDeleteStaffMutation,
  useFetchStaffQuery,
} from "@/store";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { User } from "@heroui/user";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useSession } from "next-auth/react";
import type { Staff } from "@/interfaces/staff.interface";
import { useState, type Key } from "react";
import type { SignUpSchema } from "@/lib/schemas/signUpSchema";
import PopupModal from "@/components/popup-modal";

export default function ManageStaffPage() {
  const session = useSession();
  const {
    currentData: staff,
    isLoading,
    isSuccess,
  } = useFetchStaffQuery(session.data?.accessToken || "");

  const [addStaff, resulsAddStaff] = useAddStaffMutation();
  const [deleteStaff, resultsDeleteStaff] = useDeleteStaffMutation();

  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const addStaffFormModal = useDisclosure();
  const confirmDeleteStaffModal = useDisclosure();

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "PHONE NUMBER", uid: "phone-number" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (staff: Staff, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            name={staff.name}
            description={staff.email}
            avatarProps={{
              src: staff.img || "/default-profile/default-profile.jpg",
              radius: "full",
              size: "sm",
            }}
          />
        );
      case "phone-number":
        return (
          <div className="flex flex-col">
            <p className="text-sm">{staff.phone_number}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex">
            <Button
              onPress={() => handleConfirmDeleteStaff(staff.id)}
              size="sm"
              color="danger"
              variant="flat"
            >
              Delete
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: SignUpSchema) => {
    await addStaff({ data, accessToken: session.data?.accessToken }).unwrap();

    reset();
    addStaffFormModal.onOpenChange();
  };

  const handleConfirmDeleteStaff = (staffId: string) => {
    setStaffToDelete(staffId);
    confirmDeleteStaffModal.onOpen();
  };

  const handleDeleteStaff = async () => {
    try {
      if (!staffToDelete) {
        confirmDeleteStaffModal.onOpenChange();
        return;
      }

      await deleteStaff({
        staffId: staffToDelete,
        accessToken: session.data?.accessToken,
      })
        .unwrap()
        .then(() => {
          confirmDeleteStaffModal.onOpenChange();
        });
    } catch (error) {
      confirmDeleteStaffModal.onOpenChange();
    }
  };

  const { isVisible, toggleVisibility, register, handleSubmit, errors, reset } =
    useSignUp();

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-bold text-xl">Manage Staff</h1>
        <Button
          onPress={addStaffFormModal.onOpen}
          color="primary"
          size="lg"
          className="px-20"
        >
          Add Staff
        </Button>
      </div>

      <div>
        <Table
          aria-label="Staff management table"
          className="mt-4"
          shadow="sm"
          selectionMode="single"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="bg-default-100 text-sm uppercase"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={staff || []}
            emptyContent={
              isLoading || !isSuccess ? "Loading..." : "No staff members found"
            }
            isLoading={isLoading || !isSuccess}
          >
            {(item: Staff) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={addStaffFormModal.isOpen}
        onOpenChange={addStaffFormModal.onOpenChange}
        size="4xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-2xl">Add staff</p>
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col items-center w-full gap-5 "
                >
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
                  <Button
                    color="primary"
                    size="lg"
                    type="submit"
                    className="w-full"
                    isLoading={resulsAddStaff.isLoading}
                  >
                    Add staff
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter className="flex flex-col justify-center">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <PopupModal
        message={"Are you sure to delete this staff?"}
        isOpen={confirmDeleteStaffModal.isOpen}
        onClose={confirmDeleteStaffModal.onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={handleDeleteStaff}
      />
    </div>
  );
}
