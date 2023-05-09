import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
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
  // const [showExportModal, setShowExportModal] = useState(false);
  // const [exportMessages, setExportMessages] = useState<
  //   Array<{ message: string; role: 'user' | 'assistant'; selected: boolean }>
  // >([]);
  // const handleExportConfirmation = () => {
  //   // 导出选中的消息
  //   const selectedMessages = exportMessages.filter(
  //     (message) => message.selected
  //   );
  //   console.log(selectedMessages);
  //   setShowExportModal(false);
  // };
  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* {exportMessages.map((message, index) => (
            <FormControl key={index} display="flex" alignItems="center">
              <Checkbox
                isChecked={message.selected}
                onChange={(event) => {
                  const updatedMessages = [...exportMessages];
                  updatedMessages[index].selected = event.target.checked;
                  setExportMessages(updatedMessages);
                }}
                mr="2"
              />
              <FormLabel>{message.message}</FormLabel>
            </FormControl>
          ))} */}
          {modalBody}
        </ModalBody>
        <ModalFooter>
          {/* <Button colorScheme="blue" mr={3} onClick={handleExportConfirmation}>
            Export
          </Button>
          <Button onClick={() => setShowExportModal(false)}>Cancel</Button> */}
          {modalFooter}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
