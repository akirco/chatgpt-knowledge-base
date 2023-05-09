import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { transientOptions } from '../utils/index';

type ThemeToggleButtonProps = Omit<IconButtonProps, 'aria-label'>;

const iconSize = 24;

const RoundButton = styled(IconButton, transientOptions)`
  & svg {
    width: ${iconSize}px;
    height: ${iconSize}px;
  }
  & {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
  @media (max-width: 780px) {
    position: absolute;
    top: 50px;
    right: 10%;
  }
  @media (max-width: 320px) {
    display: none;
  }
`;

function ThemeToggleButton(props: ThemeToggleButtonProps): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <RoundButton
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      aria-label={`Activate ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      {...props}
    />
  );
}

export default ThemeToggleButton;
