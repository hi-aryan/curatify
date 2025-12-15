import 'dotenv/config';
import { db } from '../src/db/index.js';
import { users } from '../src/db/schema.js';

async function main() {
    try {
        console.log('⏳ Connecting to database...');
        // Simple query to verify connection
        const result = await db.select().from(users).limit(1);
        console.log('✅ Connection successful!');
        console.log('Users found:', result);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err);
        console.error('Make sure DATABASE_URL is set in .env');
        process.exit(1);
    }
}

main();
