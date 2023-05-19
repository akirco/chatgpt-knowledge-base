import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
interface ModalBoxProps {
  showModal: boolean;
  closeModal: () => void;
  modalHeader?: JSX.Element;
  modalBody: React.ReactNode;
  modalFooter?: JSX.Element;
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
