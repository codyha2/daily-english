import { dataStore } from '../src/services/dataStore.js';
import { AuthService } from '../src/services/auth.js';

/**
 * Update existing users with hashed passwords
 * This script adds default passwords to demo users created before auth was implemented
 */
async function updateExistingUsers() {
    console.log('🔐 Updating existing users with hashed passwords...\n');

    await dataStore.init();

    const defaultPassword = 'password123'; // Default password for demo users
    const hashedPassword = await AuthService.hashPassword(defaultPassword);

    await dataStore.save(async (store) => {
        for (const user of store.users) {
            // Check if user doesn't have a password yet
            if (!(user as any).password) {
                console.log(`Updating user: ${user.name} (${user.email})`);
                (user as any).password = hashedPassword;
                (user as any).emailVerified = true; // Mark demo users as verified
                (user as any).createdAt = new Date().toISOString();
                (user as any).updatedAt = new Date().toISOString();
            }
        }
    });

    console.log('\n✅ All existing users updated!');
    console.log(`📝 Default password for demo users: "${defaultPassword}"`);
    console.log('\n📌 Demo user credentials:');

    const users = dataStore.snapshot.users;
    users.forEach(user => {
        console.log(`  - Email: ${user.email}, Password: ${defaultPassword}`);
    });
}

updateExistingUsers().catch(console.error);
