import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/dynamic-form': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'storybook-static/**'],
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}', 'src/index.ts', 'src/app/**'],
    },
  },
});
