#!/usr/bin/env node
/**
 * Package build without svelte-package / svelte2tsx.
 * Those tools still break under TypeScript 7 (typescript.sys API changes).
 * We ship source .svelte + .ts and a hand-written index.d.ts.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const name of readdirSync(src)) {
  cpSync(join(src, name), join(dist, name));
}

// Ensure package entry types resolve
const pkgTypes = readFileSync(join(src, 'index.d.ts'), 'utf8');
writeFileSync(join(dist, 'index.d.ts'), pkgTypes);

console.log('wall-svelte: copied src → dist');
