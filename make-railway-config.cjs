const fs = require('fs');

// Create nixpacks.toml to force npm usage
const nixpacks = `[phases.setup]
nixPkgs = ["nodejs_20", "npm-10_x"]

[phases.install]
cmds = ["npm install --legacy-peer-deps"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
`;

fs.writeFileSync('nixpacks.toml', nixpacks);
console.log('Created nixpacks.toml');

// Update package.json to add start script
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.start = 'react-router-serve ./build/server/index.js';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Added start script to package.json');

// Delete bun.lock so Railway uses npm
if (fs.existsSync('bun.lock')) {
  fs.unlinkSync('bun.lock');
  console.log('Deleted bun.lock');
}
if (fs.existsSync('bun.lockb')) {
  fs.unlinkSync('bun.lockb');
  console.log('Deleted bun.lockb');
}

console.log('\nAll done! Now run:');
console.log('  git add .');
console.log('  git commit -m "Configure Railway to use npm"');
console.log('  git push origin main');
