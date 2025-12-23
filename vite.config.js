import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 /api로 시작하는 요청을 보내면 아래 target 주소로 전달합니다.
      '/api': {
        target:
          'https://port-0-chain-server-mjgfqy3sbea3654a.sel3.cloudtype.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 경로 유지
      },
    },
  },
});
