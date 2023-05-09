import { Text, Flex } from '@chakra-ui/react';

export default function IconText({
  children,
  text,
  onClick,
  onDoubleClick,
}: {
  children: JSX.Element;
  text: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}) {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={'space-between'}
      w="72px"
      marginRight={'15px'}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
      <Text cursor="pointer">{text}</Text>
    </Flex>
  );
}
