const fs = require('fs');
const path = require('path');

console.log('🚗 UberClone Setup Verification\n');

const checks = [
  {
    name: 'Backend package.json',
    path: './backend/package.json',
    check: () => fs.existsSync('./backend/package.json')
  },
  {
    name: 'Frontend package.json',
    path: './frontend/package.json',
    check: () => fs.existsSync('./frontend/package.json')
  },
  {
    name: 'Backend server.js',
    path: './backend/server.js',
    check: () => fs.existsSync('./backend/server.js')
  },
  {
    name: 'Frontend App.js',
    path: './frontend/src/App.js',
    check: () => fs.existsSync('./frontend/src/App.js')
  },
  {
    name: 'Backend routes',
    path: './backend/routes',
    check: () => fs.existsSync('./backend/routes') && fs.readdirSync('./backend/routes').length > 0
  },
  {
    name: 'Backend models',
    path: './backend/models',
    check: () => fs.existsSync('./backend/models') && fs.readdirSync('./backend/models').length > 0
  },
  {
    name: 'Frontend pages',
    path: './frontend/src/pages',
    check: () => fs.existsSync('./frontend/src/pages') && fs.readdirSync('./frontend/src/pages').length > 0
  },
  {
    name: 'Backend .env file',
    path: './backend/.env',
    check: () => fs.existsSync('./backend/.env')
  },
  {
    name: 'Tailwind config',
    path: './frontend/tailwind.config.js',
    check: () => fs.existsSync('./frontend/tailwind.config.js')
  },
  {
    name: 'Seed script',
    path: './backend/scripts/seedData.js',
    check: () => fs.existsSync('./backend/scripts/seedData.js')
  },
  {
    name: 'Python FastAPI alternative',
    path: './backend-python/main.py',
    check: () => fs.existsSync('./backend-python/main.py')
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    if (check.check()) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name} - Missing: ${check.path}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your UberClone app is ready to run.');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Run: npm run setup (to install deps and seed data)');
  console.log('3. Run: npm run dev (to start the application)');
  console.log('4. Visit: http://localhost:3000');
  console.log('\n🔑 Demo accounts:');
  console.log('   User: user@demo.com / password');
  console.log('   Driver: driver@demo.com / password');
  console.log('   Admin: admin@demo.com / password');
} else {
  console.log('⚠️  Some components are missing. Please check the failed items above.');
}

// Check for common issues
console.log('\n🔍 Additional checks:');

// Check Node.js version
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
  if (parseInt(nodeVersion.slice(1)) < 16) {
    console.log('⚠️  Warning: Node.js 16+ is recommended');
  }
} catch (error) {
  console.log('❌ Could not check Node.js version');
}

// Check if npm is available
try {
  const { execSync } = require('child_process');
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.log('❌ npm is not available');
}

console.log('\n🚀 Ready to launch your UberClone!');