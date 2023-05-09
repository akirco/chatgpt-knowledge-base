import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const styles = {
  global: {
    'html,body,#root': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      placeItems: 'center',
      width: '100%',
      height: '100%',
    },
  },
};

const theme = extendTheme({ config }, { styles });

export default theme;
