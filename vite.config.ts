import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login/oauth/access_token': {
        target: 'https://github.com/',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
        },
        rewrite: (path) => path.replace(/^\/github/, ''),
      },
    },
  },
});
