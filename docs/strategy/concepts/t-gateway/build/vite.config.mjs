import { defineConfig } from 'vite';
const NM = '/home/user/tpi-website-ai-poc/node_modules';
const GSAP = '/tmp/t-gateway/x-gsap/package';
export default defineConfig({
  root: '/tmp/t-gateway/build',
  logLevel: 'warn',
  resolve: {
    alias: [
      { find: /^three$/, replacement: `${NM}/three/build/three.module.js` },
      { find: /^three\/examples\/jsm\/(.*)$/, replacement: `${NM}/three/examples/jsm/$1` },
      { find: /^gsap$/, replacement: `${GSAP}/index.js` },
      { find: /^gsap\/ScrollTrigger$/, replacement: `${GSAP}/ScrollTrigger.js` },
    ],
  },
  build: {
    outDir: process.env.OUT,
    emptyOutDir: false,
    target: 'es2020', minify: true,
    lib: { entry: '/tmp/t-gateway/build/main.js', name: 'TGateway', formats: ['iife'], fileName: () => 'scene.js' },
  },
});
