import * as esbuild from 'esbuild';
import * as path from 'path';

const rootDir: string = process.cwd();
const scriptsDir: string = path.join(rootDir, 'scripts');

interface Entry {
  in: string;
  out: string;
}

const entries: Entry[] = [
  { in: path.join(scriptsDir, 'client/theme.ts'), out: path.join(rootDir, 'public/web/js/theme') },
  { in: path.join(scriptsDir, 'client/sidebarmenu.ts'), out: path.join(rootDir, 'public/web/dash/js/sidebarmenu') },
  { in: path.join(scriptsDir, 'client/app-style-switcher.ts'), out: path.join(rootDir, 'public/web/dash/js/app-style-switcher') },
  { in: path.join(scriptsDir, 'client/particles.ts'), out: path.join(rootDir, 'public/web/vendors/particle-js/app') },
  { in: path.join(scriptsDir, 'client/winwheel.ts'), out: path.join(rootDir, 'public/web/wheel/Winwheel') },
  { in: path.join(scriptsDir, 'client/superwheel.ts'), out: path.join(rootDir, 'public/web/wheel/superwheel') },
];

async function build(): Promise<void> {
  for (const entry of entries) {
    await esbuild.build({
      entryPoints: [entry.in],
      outfile: entry.out + '.js',
      bundle: true,
      minify: false,
      format: 'iife',
      target: 'es2015',
      external: ['bootstrap', 'jquery', 'popper.js'],
    });
    console.log(`✓ Built ${entry.in} → ${entry.out}.js`);
  }
}

build().catch(() => process.exit(1));

export {};