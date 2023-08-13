/* eslint-disable no-undef */
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import dts from 'rollup-plugin-dts';
// import fs from 'fs';
// import path from 'path';
// const packagesDir = path.resolve(__dirname, 'packages');
// const packageFiles = fs.readdirSync(packagesDir);
// const outDir = `packages/${path}/`
// const outDir = `packages/${path}/`
// function output(path) {
//   return [
//     {
//       input: [`./src/index.ts`],
//       output: [
//         {
//           file: `./dist/index.cjs.js`,
//           format: 'cjs',
//           sourcemap: true,
//         },
//         {
//           file: `./dist/index.esm.js`,
//           format: 'esm',
//           sourcemap: true,
//         },
//         {
//           file: `./dist/index.js`,
//           format: 'umd',
//           name: 'digger-track',
//           sourcemap: true,
//         },
//         {
//           file: `./dist/index.min.js`,
//           format: 'umd',
//           name: 'digger-track',
//           sourcemap: true,
//           plugins: [uglify()],
//         },
//       ],
//       plugins: [
//         typescript({
//           tsconfigOverride: {
//             compilerOptions: {
//               module: 'ESNext',
//             },
//           },
//           useTsconfigDeclarationDir: true,
//         }),
//         resolve(),
//         commonjs(),
//         json(),
//       ],
//     },
//     {
//       input: `./src/index.ts`,
//       output: [
//         { file: `./dist/index.cjs.d.ts`, format: 'cjs' },
//         { file: `./dist/index.esm.d.ts`, format: 'esm' },
//         { file: `./dist/index.d.ts`, format: 'umd' },
//         { file: `./dist/index.min.d.ts`, format: 'umd' },
//       ],
//       plugins: [dts()],
//     },
//   ];
// }
const config = defineConfig([
  {
    input: [`./src/core/index.ts`],
    output: [
      {
        file: `./dist/index.cjs.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./dist/index.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: `./dist/index.js`,
        format: 'umd',
        name: 'digger-track',
        sourcemap: true,
      },
      {
        file: `./dist/index.min.js`,
        format: 'umd',
        name: 'digger-track',
        sourcemap: true,
        plugins: [uglify()],
      },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext',
          },
        },
        useTsconfigDeclarationDir: true,
      }),
      resolve(),
      commonjs(),
      json(),
    ],
  },
  {
    input: `./src/core/index.ts`,
    output: [
      { file: `./dist/index.cjs.d.ts`, format: 'cjs' },
      { file: `./dist/index.esm.d.ts`, format: 'esm' },
      { file: `./dist/index.d.ts`, format: 'umd' },
      { file: `./dist/index.min.d.ts`, format: 'umd' },
    ],
    plugins: [dts()],
  },
])
// export default defineConfig(['core'].map(path => output(path)).flat());
export default config;
