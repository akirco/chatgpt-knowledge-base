import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: (props: { colorMode: string }) => ({
      'html,body,#root': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        placeItems: 'center',
        width: '100%',
        height: '100%',
        background: props.colorMode === 'dark' ? '#1a1b26' : '#f6f7f9',
      },
    }),
  },
});

export default theme;
