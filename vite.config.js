import pkg from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
const { defineConfig } = pkg;
export default defineConfig({
  plugins: [reactRefresh()]
})
