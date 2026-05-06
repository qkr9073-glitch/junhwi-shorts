import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-onnx-wasm',
      generateBundle(_, bundle) {
        for (const fileName of Object.keys(bundle)) {
          if (fileName.includes('ort-wasm') && fileName.endsWith('.wasm')) {
            delete bundle[fileName];
          }
        }
      },
    },
  ],
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
})
