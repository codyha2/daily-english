import { dataStore } from '../src/services/dataStore.js';

async function run() {
    console.log('Initializing dataStore...');
    try {
        await dataStore.init();
        console.log('DataStore initialized.');
        console.log('Current words count:', dataStore.snapshot.words.length);

        console.log('Attempting to save...');
        await dataStore.save((db) => {
            console.log('Inside mutator');
            // Just touch the data
            if (!db.dailyLessons) {
                console.log('dailyLessons is missing in db!');
                db.dailyLessons = [];
            } else {
                console.log('dailyLessons exists, count:', db.dailyLessons.length);
            }
        });
        console.log('Save completed.');
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
