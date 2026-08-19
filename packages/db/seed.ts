import { db } from './index.js';
import { safePoints } from './schema.js';

const SEED_SAFEPOINTS = [
  { name: 'Sharma Medical Store', type: 'pharmacy', lat: 28.6129, lng: 77.2295, verified: true },
  { name: 'Connaught Place Police Booth', type: 'guard-booth', lat: 28.6304, lng: 77.2177, verified: true },
  { name: '24/7 Convenience Store', type: 'shop', lat: 28.6272, lng: 77.2155, verified: true },
  { name: 'Apollo Pharmacy', type: 'pharmacy', lat: 28.6143, lng: 77.2023, verified: true },
  { name: 'Metro Security Desk', type: 'guard-booth', lat: 28.6331, lng: 77.2197, verified: true },
  { name: 'Hostel 4 Warden Office', type: 'hostel-warden', lat: 28.5444, lng: 77.1921, verified: true },
  { name: 'Safdarjung Hospital Emergency', type: 'pharmacy', lat: 28.5684, lng: 77.2064, verified: true },
  { name: 'Nehru Place Guard Post', type: 'guard-booth', lat: 28.5495, lng: 77.2524, verified: true },
  { name: 'Reliance Smart Point', type: 'shop', lat: 28.5355, lng: 77.1558, verified: true },
  { name: 'Girls PG Warden (Hauz Khas)', type: 'hostel-warden', lat: 28.5482, lng: 77.2001, verified: true },
  { name: 'South Ex Police Post', type: 'guard-booth', lat: 28.5694, lng: 77.2215, verified: true },
  { name: 'Max Medcentre Pharmacy', type: 'pharmacy', lat: 28.5398, lng: 77.2104, verified: true },
  { name: 'Campus Security Gate 2', type: 'guard-booth', lat: 28.5457, lng: 77.1895, verified: true },
  { name: 'Night Chemist', type: 'pharmacy', lat: 28.5833, lng: 77.2343, verified: true },
  { name: 'Petrol Pump 24hr store', type: 'shop', lat: 28.5284, lng: 77.1472, verified: true },
];

async function seed() {
  console.log('Seeding SafePoints...');
  try {
    await db.insert(safePoints).values(SEED_SAFEPOINTS).onConflictDoNothing();
    console.log('Successfully seeded SafePoints');
  } catch (error) {
    console.error('Error seeding SafePoints:', error);
  } finally {
    process.exit(0);
  }
}

seed();
