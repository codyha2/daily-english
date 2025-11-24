import express from 'express';
import { addBasicWords } from '../services/seeding/addBasicWords';
import { generateCurriculum } from '../services/seeding/generateCurriculum';

const router = express.Router();

router.post('/seed', async (req, res) => {
    const secret = req.query.secret;
    // Simple secret check for now
    if (secret !== 'admin-secret-123') {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    try {
        console.log('🌱 Starting seeding process...');
        await addBasicWords();
        await generateCurriculum();
        console.log('✅ Seeding completed successfully');
        res.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        res.status(500).json({ success: false, error: 'Seeding failed', details: error });
    }
});

export default router;
