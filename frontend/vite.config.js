import { sveltekit } from '@sveltejs/kit/vite'
import { execSync } from 'child_process'
import path from 'path'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), {
    name: 'build-info',
    resolveId(id) {
      if (id === 'virtual:build-info') {
        return 'virtual:build-info'
      }
    },
    load(id) {
      if (id === 'virtual:build-info') {
        return `export const builtAt = ${Date.now()};export const commitId = ${JSON.stringify(execSync('git rev-parse --short HEAD').toString().split('\n')[0])}`
      }
    }
  }],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/graphql': 'http://localhost:4000',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020'
  }
}

export default config
