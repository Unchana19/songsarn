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
  buttonTitle?: string;
  buttonFunction?: any;
}

export default function PopupModal({
  message,
  isOpen,
  onClose,
  buttonTitle,
  buttonFunction,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="flex items-center pb-3">
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className="flex items-center w-full">
              <p className="text-xl font-bold">{message}</p>
            </ModalBody>
            <ModalFooter className="mt-3 flex flex-col w-1/2">
              {buttonTitle && buttonFunction && (
                <Button
                  fullWidth
                  radius="full"
                  color="primary"
                  onPress={buttonFunction}
                >
                  <p className="text-white">{buttonTitle}</p>
                </Button>
              )}
              <Button
                fullWidth
                radius="full"
                variant={(buttonTitle && buttonFunction) ? "light" : "solid"}
                onPress={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
