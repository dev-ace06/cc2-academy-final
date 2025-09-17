// Load environment variables FIRST
require('dotenv').config({ path: './config-with-api-key.env' });

const mongoose = require('mongoose');
const cocApi = require('./services/cocApi');
const Clan = require('./models/Clan');
const Member = require('./models/Member');

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.COC_API_KEY ? 'Yes' : 'No');
console.log('API Key preview:', process.env.COC_API_KEY ? process.env.COC_API_KEY.substring(0, 20) + '...' : 'Not found');
console.log('Clan Tag 1:', process.env.CLAN_TAG_1);
console.log('Clan Tag 2:', process.env.CLAN_TAG_2);
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('CLAN')));

async function syncData() {
  try {
    console.log('🔄 Starting data sync...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cc2-academy-stats', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Hardcode clan tags for now since env loading is not working
    const clanTags = [
      '#PQUCURCQ',
      '#2JJJCCRQR'
    ];

    if (clanTags.length === 0) {
      console.error('❌ No clan tags configured in environment variables');
      return;
    }

    console.log(`📋 Found ${clanTags.length} clan tags to sync`);

    for (const clanTag of clanTags) {
      try {
        console.log(`\n🏰 Syncing clan: ${clanTag}`);
        
        // Fetch clan data from API
        const clanData = await cocApi.getClan(clanTag);
        const formattedClanData = cocApi.formatClanData(clanData);
        
        console.log(`   📊 Clan: ${clanData.name} (Level ${clanData.clanLevel})`);

        // Update or create clan in database
        const clan = await Clan.findOneAndUpdate(
          { tag: clanData.tag },
          formattedClanData,
          { upsert: true, new: true }
        );
        console.log(`   ✅ Clan data synced`);

        // Fetch and update members
        const membersData = await cocApi.getClanMembers(clanTag);
        console.log(`   👥 Found ${membersData.items.length} members`);
        
        const memberUpdates = membersData.items.map(member => 
          cocApi.formatMemberData(member, clanTag)
        );

        // Bulk update members
        let updatedCount = 0;
        for (const memberData of memberUpdates) {
          await Member.findOneAndUpdate(
            { tag: memberData.tag },
            memberData,
            { upsert: true, new: true }
          );
          updatedCount++;
        }
        console.log(`   ✅ ${updatedCount} members synced`);

        // Remove members who are no longer in the clan
        const currentMemberTags = memberUpdates.map(m => m.tag);
        const deleteResult = await Member.deleteMany({
          clanTag: clanTag,
          tag: { $nin: currentMemberTags }
        });
        
        if (deleteResult.deletedCount > 0) {
          console.log(`   🗑️  Removed ${deleteResult.deletedCount} inactive members`);
        }

        console.log(`   ✅ Clan ${clanData.name} sync completed`);

      } catch (error) {
        console.error(`❌ Error syncing clan ${clanTag}:`, error.message);
      }
    }

    console.log('\n🎉 Data sync completed!');
    console.log('\n📊 Summary:');
    
    const totalClans = await Clan.countDocuments();
    const totalMembers = await Member.countDocuments();
    
    console.log(`   🏰 Clans: ${totalClans}`);
    console.log(`   👥 Members: ${totalMembers}`);

  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the sync
syncData();
