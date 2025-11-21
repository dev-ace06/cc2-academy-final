#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏰 CC2 Family Stats - API Configuration');
console.log('==========================================\n');

// Your API key
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjJmYWUzY2MxLTNlZTMtNGZhNi05MTA5LTRlMDIwMjY4Mjc3MCIsImlhdCI6MTc1Nzg2ODIwNSwic3ViIjoiZGV2ZWxvcGVyLzhlZGRkMmIxLWY4YmEtYTllOS0zNTE3LTk1NGRiNDU5MGE3ZiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQyLjEwNi4xMy4xMjEiXSwidHlwZSI6ImNsaWVudCJ9XX0.J1oCteQz7G9rtoCaM47B-hAfO8zQK37F2bA-AFHa2dL1Z1SYOKnqoXWop0hvPCVPYyibNzeyiqtfN8Prp7_PQA';

// Environment content with your API key
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cc2-academy-stats

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=cc2-academy-super-secret-jwt-key-2023-change-in-production

# Clash of Clans API - YOUR API KEY IS CONFIGURED ✅
COC_API_KEY=${apiKey}
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
  console.log('✅ Successfully created server/.env with your API key!');
  console.log('✅ Your Clash of Clans API key is now configured');
} catch (error) {
  console.log('❌ Could not create .env file:', error.message);
  console.log('\n📋 Manual Setup Required:');
  console.log('1. Create a file named ".env" in the "server" folder');
  console.log('2. Copy the following content into it:');
  console.log('\n' + envContent);
}

console.log('\n🎯 Next Steps:');
console.log('1. Replace CLAN_TAG_1 and CLAN_TAG_2 with your actual clan tags');
console.log('2. Make sure MongoDB is running');
console.log('3. Install dependencies: npm run install-all');
console.log('4. Start the application: npm run dev');
console.log('\n🎮 Your API key is ready! Happy clashing!');









