import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ReactNode } from "react";
interface ModalBoxProps {
  showModal: boolean;
  closeModal: () => void;
  modalHeader?: ReactNode;
  modalBody: ReactNode;
  modalFooter?: ReactNode;
}

export default function ModalBox({
  showModal,
  closeModal,
  modalHeader,
  modalBody,
  modalFooter,
}: ModalBoxProps) {
  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{modalBody}</ModalBody>
        <ModalFooter>{modalFooter}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
