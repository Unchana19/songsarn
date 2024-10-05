import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface Props {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  isError: boolean;
  buttonTitle: string;
  buttonFunction: any;
}

export default function PopupModal({
  message,
  isOpen,
  onClose,
  isError,
  buttonTitle,
  buttonFunction,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isError ? "Error" : "Success"}
            </ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              {isError && (
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              )}
              {!isError && (
                <Button color="primary" onPress={buttonFunction}>
                  {buttonTitle}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
