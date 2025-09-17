#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏰 CC2 Academy Stats Setup Script');
console.log('=====================================\n');

// Create .env file for server
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cc2-academy-stats

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=cc2-academy-super-secret-jwt-key-2023-change-in-production

# Clash of Clans API
COC_API_KEY=your-clash-of-clans-api-key-here
COC_API_BASE_URL=https://api.clashofclans.com/v1

# Clan Tags (replace with your actual clan tags)
CLAN_TAG_1=%23YOUR_CLAN_TAG_1
CLAN_TAG_2=%23YOUR_CLAN_TAG_2

# Inspector Login Credentials
INSPECTOR_USERNAME=inspector
INSPECTOR_PASSWORD=inspector911
`;

const envPath = path.join(__dirname, 'server', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created server/.env file');
} catch (error) {
  console.log('❌ Could not create .env file:', error.message);
  console.log('Please create server/.env manually with the following content:');
  console.log(envContent);
}

console.log('\n📋 Setup Instructions:');
console.log('1. Get your Clash of Clans API key from: https://developer.clashofclans.com');
console.log('2. Replace "your-clash-of-clans-api-key-here" in server/.env with your actual API key');
console.log('3. Replace clan tags with your actual clan tags (include # symbol)');
console.log('4. Install dependencies: npm run install-all');
console.log('5. Start the application: npm run dev');
console.log('\n🎮 Happy Clashing!');









