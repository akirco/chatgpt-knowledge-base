import { ArrowForwardIcon } from '@chakra-ui/icons';

import { IconButton } from '@chakra-ui/react';

interface SendButtonProps {
  onClick: () => void;
}

export default function SendButton({ onClick }: SendButtonProps) {
  return (
    <IconButton
      aria-label="send message"
      icon={<ArrowForwardIcon />}
      onClick={onClick}
    />
  );
}
