const mongoose = require('mongoose');
const Clan = require('./models/Clan');
const Member = require('./models/Member');
require('dotenv').config({ path: './config-with-api-key.env' });

async function createDemoData() {
  try {
    console.log('🔄 Creating demo data...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cc2-academy-stats', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Clan.deleteMany({});
    await Member.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo clan data
    const demoClans = [
      {
        tag: '#PQUCURCQ',
        name: 'CC2 Academy',
        level: 15,
        points: 45000,
        builderBasePoints: 12000,
        members: 45,
        description: 'Welcome to CC2 Academy! We are a competitive clan focused on growth and teamwork.',
        location: 'International',
        type: 'inviteOnly',
        warFrequency: 'always',
        clanWarTrophies: 1200,
        clanCapital: {
          capitalHallLevel: 8,
          districts: 6
        },
        badgeUrls: {
          small: 'https://api-assets.clashofclans.com/badges/70/example1.png',
          large: 'https://api-assets.clashofclans.com/badges/512/example1.png',
          medium: 'https://api-assets.clashofclans.com/badges/200/example1.png'
        },
        lastUpdated: new Date()
      },
      {
        tag: '#2JJJCCRQR',
        name: 'CC2 Academy 2',
        level: 12,
        points: 38000,
        builderBasePoints: 9500,
        members: 38,
        description: 'CC2 Academy\'s second clan for developing players.',
        location: 'International',
        type: 'inviteOnly',
        warFrequency: 'always',
        clanWarTrophies: 850,
        clanCapital: {
          capitalHallLevel: 6,
          districts: 4
        },
        badgeUrls: {
          small: 'https://api-assets.clashofclans.com/badges/70/example2.png',
          large: 'https://api-assets.clashofclans.com/badges/512/example2.png',
          medium: 'https://api-assets.clashofclans.com/badges/200/example2.png'
        },
        lastUpdated: new Date()
      }
    ];

    // Insert clans
    const createdClans = await Clan.insertMany(demoClans);
    console.log(`✅ Created ${createdClans.length} clans`);

    // Create demo member data
    const demoMembers = [
      // CC2 Academy members
      { tag: '#ABC123', name: 'Achilles', role: 'leader', clanTag: '#PQUCURCQ', townHallLevel: 15, trophies: 5200, warStars: 450, donations: 1200, donationsReceived: 800, lastSeen: new Date(), league: { name: 'Titan League I' } },
      { tag: '#DEF456', name: 'Zeus', role: 'coLeader', clanTag: '#PQUCURCQ', townHallLevel: 14, trophies: 4800, warStars: 380, donations: 1100, donationsReceived: 700, lastSeen: new Date(), league: { name: 'Titan League II' } },
      { tag: '#GHI789', name: 'Athena', role: 'elder', clanTag: '#PQUCURCQ', townHallLevel: 14, trophies: 4600, warStars: 350, donations: 1000, donationsReceived: 650, lastSeen: new Date(), league: { name: 'Titan League III' } },
      { tag: '#JKL012', name: 'Hercules', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 13, trophies: 4200, warStars: 320, donations: 950, donationsReceived: 600, lastSeen: new Date(), league: { name: 'Champion League I' } },
      { tag: '#MNO345', name: 'Apollo', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 13, trophies: 4100, warStars: 300, donations: 900, donationsReceived: 580, lastSeen: new Date(), league: { name: 'Champion League II' } },
      { tag: '#PQR678', name: 'Artemis', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 12, trophies: 3800, warStars: 280, donations: 850, donationsReceived: 550, lastSeen: new Date(), league: { name: 'Champion League III' } },
      { tag: '#STU901', name: 'Poseidon', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 12, trophies: 3700, warStars: 260, donations: 800, donationsReceived: 520, lastSeen: new Date(), league: { name: 'Master League I' } },
      { tag: '#VWX234', name: 'Hades', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 11, trophies: 3400, warStars: 240, donations: 750, donationsReceived: 490, lastSeen: new Date(), league: { name: 'Master League II' } },
      { tag: '#YZA567', name: 'Demeter', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 11, trophies: 3300, warStars: 220, donations: 700, donationsReceived: 460, lastSeen: new Date(), league: { name: 'Master League III' } },
      { tag: '#BCD890', name: 'Hestia', role: 'member', clanTag: '#PQUCURCQ', townHallLevel: 10, trophies: 3000, warStars: 200, donations: 650, donationsReceived: 430, lastSeen: new Date(), league: { name: 'Crystal League I' } },

      // CC2 Academy 2 members
      { tag: '#EFG123', name: 'Spartan', role: 'leader', clanTag: '#2JJJCCRQR', townHallLevel: 12, trophies: 4000, warStars: 300, donations: 1000, donationsReceived: 600, lastSeen: new Date(), league: { name: 'Champion League I' } },
      { tag: '#HIJ456', name: 'Warrior', role: 'coLeader', clanTag: '#2JJJCCRQR', townHallLevel: 11, trophies: 3600, warStars: 280, donations: 950, donationsReceived: 550, lastSeen: new Date(), league: { name: 'Master League I' } },
      { tag: '#KLM789', name: 'Guardian', role: 'elder', clanTag: '#2JJJCCRQR', townHallLevel: 11, trophies: 3500, warStars: 260, donations: 900, donationsReceived: 520, lastSeen: new Date(), league: { name: 'Master League II' } },
      { tag: '#NOP012', name: 'Defender', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 10, trophies: 3200, warStars: 240, donations: 850, donationsReceived: 490, lastSeen: new Date(), league: { name: 'Master League III' } },
      { tag: '#QRS345', name: 'Fighter', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 10, trophies: 3100, warStars: 220, donations: 800, donationsReceived: 460, lastSeen: new Date(), league: { name: 'Crystal League I' } },
      { tag: '#TUV678', name: 'Soldier', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 9, trophies: 2800, warStars: 200, donations: 750, donationsReceived: 430, lastSeen: new Date(), league: { name: 'Crystal League II' } },
      { tag: '#WXY901', name: 'Knight', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 9, trophies: 2700, warStars: 180, donations: 700, donationsReceived: 400, lastSeen: new Date(), league: { name: 'Crystal League III' } },
      { tag: '#ZAB234', name: 'Archer', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 8, trophies: 2400, warStars: 160, donations: 650, donationsReceived: 370, lastSeen: new Date(), league: { name: 'Gold League I' } },
      { tag: '#CDE567', name: 'Wizard', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 8, trophies: 2300, warStars: 140, donations: 600, donationsReceived: 340, lastSeen: new Date(), league: { name: 'Gold League II' } },
      { tag: '#FGH890', name: 'Barbarian', role: 'member', clanTag: '#2JJJCCRQR', townHallLevel: 7, trophies: 2000, warStars: 120, donations: 550, donationsReceived: 310, lastSeen: new Date(), league: { name: 'Gold League III' } }
    ];

    // Insert members
    const createdMembers = await Member.insertMany(demoMembers);
    console.log(`✅ Created ${createdMembers.length} members`);

    console.log('\n🎉 Demo data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   🏰 Clans: ${createdClans.length}`);
    console.log(`   👥 Members: ${createdMembers.length}`);
    console.log('\n🌐 Your website should now display data!');

  } catch (error) {
    console.error('❌ Demo data creation failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the demo data creation
createDemoData();
