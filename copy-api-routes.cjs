const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function transpileFile(srcPath, destPath) {
  try {
    const result = await esbuild.build({
      entryPoints: [srcPath],
      bundle: false,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      loader: { '.js': 'jsx', '.jsx': 'jsx', '.ts': 'tsx', '.tsx': 'tsx' },
      outfile: destPath,
      logLevel: 'silent',
    });
    return true;
  } catch (err) {
    console.error('Failed:', srcPath);
    return false;
  }
}

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
    } else if (item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.ts') || item.endsWith('.tsx')) {
      const outPath = destPath.replace(/\.(jsx|ts|tsx)$/, '.js');
      if (await transpileFile(srcPath, outPath)) count++;
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return count;
}

(async () => {
  // Transpile API routes
  const apiCount = await walkDir('src/app/api', 'build/server/src/app/api');
  console.log('Transpiled', apiCount, 'API files');
  
  // Transpile auth, lib, components, utils, hooks
  for (const folder of ['lib', 'components', 'utils', 'hooks']) {
    const count = await walkDir(`src/${folder}`, `build/server/src/${folder}`);
    console.log('Transpiled', count, folder, 'files');
  }
  
  // Copy auth.js separately
  if (fs.existsSync('src/auth.js')) {
    await transpileFile('src/auth.js', 'build/server/src/auth.js');
    console.log('Transpiled auth.js');
  }
})();