const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd, cwd) {
  console.log(`\nRunning: ${cmd} in ${cwd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    } else {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    }
  });
}

try {
  console.log('Starting full project build...');

  // 1. Build Admin Panel
  run('npm install', path.join(__dirname, 'admin-panel'));
  run('npm run build', path.join(__dirname, 'admin-panel'));

  // 2. Build Client Web
  run('npm install', path.join(__dirname, 'client-web'));
  run('npm run build', path.join(__dirname, 'client-web'));

  // 3. Prepare public directory
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy client-web build to root of public
  console.log('Copying client-web to /public');
  copyFolderSync(path.join(__dirname, 'client-web', 'dist'), publicDir);

  // Copy admin-panel build to /public/admin
  console.log('Copying admin-panel to /public/admin');
  copyFolderSync(path.join(__dirname, 'admin-panel', 'dist'), path.join(publicDir, 'admin'));

  console.log('\nBuild and merge completed successfully!');
} catch (error) {
  console.error('\nBuild failed:', error);
  process.exit(1);
}
