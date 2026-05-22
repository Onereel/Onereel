const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativeToSrc = path.relative(path.dirname(filePath), 'build/server/src').replace(/\\/g, '/');
  let modified = false;
  if (content.includes('@/auth')) {
    content = content.replace(/from\s+['"]@\/auth['"]/g, `from '${relativeToSrc}/auth.js'`);
    content = content.replace(/from\s+['"]@\/auth\//g, `from '${relativeToSrc}/auth/`);
    modified = true;
  }
  if (content.includes('@/app/')) {
    content = content.replace(/from\s+['"]@\/app\//g, `from '${relativeToSrc}/app/`);
    modified = true;
  }
  if (content.includes('@/lib/')) {
    content = content.replace(/from\s+['"]@\/lib\//g, `from '${relativeToSrc}/lib/`);
    modified = true;
  }
  if (content.includes('@/components/')) {
    content = content.replace(/from\s+['"]@\/components\//g, `from '${relativeToSrc}/components/`);
    modified = true;
  }
  if (content.includes('@/utils/')) {
    content = content.replace(/from\s+['"]@\/utils\//g, `from '${relativeToSrc}/utils/`);
    modified = true;
  }
  if (content.includes('@/hooks/')) {
    content = content.replace(/from\s+['"]@\/hooks\//g, `from '${relativeToSrc}/hooks/`);
    modified = true;
  }
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const item of fs.readdirSync(dir)) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      count += walkDir(itemPath);
    } else if (item.endsWith('.js')) {
      if (fixFile(itemPath)) count++;
    }
  }
  return count;
}

const count = walkDir('build/server/src/app/api');
console.log('Fixed ' + count + ' files');