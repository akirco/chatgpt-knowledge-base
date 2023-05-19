import { ArrowForwardIcon } from "@chakra-ui/icons";

import { Button } from "@chakra-ui/react";

interface SendButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function SendButton({ onClick, isLoading }: SendButtonProps) {
  return (
    <Button
      aria-label="send message"
      leftIcon={<ArrowForwardIcon />}
      iconSpacing={"-1"}
      isLoading={isLoading}
      onClick={onClick}
    ></Button>
  );
}
