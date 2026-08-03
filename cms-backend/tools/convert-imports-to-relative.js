const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist') continue;
      walk(full);
    } else if (ent.isFile() && full.endsWith('.ts')) {
      processFile(full);
    }
  }
}

function resolveTarget(spec) {
  // spec starts with modules/ or shared/ or src/
  const parts = spec.split('/');
  const target = path.join(srcRoot, ...parts);
  const candidates = [target + '.ts', path.join(target, 'index.ts'), target];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // try without src prefix if already included
  if (spec.startsWith('src/')) {
    const alt = path.join(projectRoot, spec.replace(/^src\//, ''));
    if (fs.existsSync(alt + '.ts')) return alt + '.ts';
  }
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const regex = /from\s+['"](modules|shared|src)\/([^'";]+)['"]/g;
  let changed = false;
  content = content.replace(regex, (m, p1, rest) => {
    const spec = `${p1}/${rest}`;
    const target = resolveTarget(spec);
    if (!target) return m; // leave as-is if not resolvable
    let rel = path.relative(dir, target);
    rel = rel.replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    rel = rel.replace(/\.ts$/, '');
    changed = true;
    return `from '${rel}'`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', path.relative(projectRoot, filePath));
  }
}

walk(srcRoot);
console.log('Done');
