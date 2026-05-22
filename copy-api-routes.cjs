const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function walkDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const item of fs.readdirSync(srcDir)) {
    if (item === '__create') continue;
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    if (fs.statSync(srcPath).isDirectory()) {
      count += await walkDir(srcPath, destPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      const outPath = destPath.replace(/\.(jsx|ts|tsx)$/, '.js');
      try {
        await esbuild.build({
          entryPoints: [srcPath],
          bundle: true,
          platform: 'node',
          format: 'esm',
          target: 'node20',
          packages: 'external',
          loader: { '.js': 'jsx' },
          outfile: outPath,
          logLevel: 'silent',
        });
        count++;
      } catch (err) {
        console.error('Skip:', srcPath, err.message);
      }
    }
  }
  return count;
}

(async () => {
  const apiCount = await walkDir('src/app/api', 'build/server/src/app/api');
  console.log('Bundled', apiCount, 'API files');
})();