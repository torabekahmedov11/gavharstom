const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, cwd = process.cwd()) {
  console.log(`\nRunning: ${cmd} in ${cwd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else {
      copyFolderSync(fromPath, toPath);
    }
  });
}

try {
  // 1. Install dependencies and Build Admin Panel
  run('npm install', path.join(__dirname, 'admin-panel'));
  run('npm run build', path.join(__dirname, 'admin-panel'));

  // 2. Install dependencies and Build Client Web
  run('npm install', path.join(__dirname, 'client-web'));
  run('npm run build', path.join(__dirname, 'client-web'));

  // 3. API dependencies are handled by root postinstall, so we skip it here.

  // 4. Merge Builds into 'public' folder
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy client-web build to root of public
  console.log('Copying client-web to /public');
  copyFolderSync(path.join(__dirname, 'client-web', 'dist'), publicDir);

  // Copy admin-panel build to public/admin
  console.log('Copying admin-panel to /public/admin');
  const adminDir = path.join(publicDir, 'admin');
  copyFolderSync(path.join(__dirname, 'admin-panel', 'dist'), adminDir);

  console.log('Build and merge completed successfully!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
