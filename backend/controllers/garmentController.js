const garmentRepository = require('../repositories/garmentRepository');
const garmentAgingService = require('../services/garmentAgingService');
const garmentAnalysisService = require('../services/garmentAnalysisService');
const garmentMatchingService = require('../services/garmentMatchingService');

class GarmentController {
    async getMyGarments(req, res) {
        try {
            const garments = await garmentRepository.findByUserId(req.user.id);
            res.json({ garments });
        } catch (err) {
            console.error('Failed to get garments:', err);
            res.status(500).json({ error: 'Failed to retrieve wardrobe items.' });
        }
    }

    async getGarmentById(req, res) {
        try {
            const garment = await garmentRepository.findById(req.params.id);
            if (!garment) {
                return res.status(404).json({ error: 'Garment DNA record not found.' });
            }

            const careHistory = await garmentRepository.getCareHistory(garment.id);
            const inspections = await garmentRepository.getInspections(garment.id);
            const longevity = garmentAgingService.calculateLongevity(garment);

            res.json({
                garment,
                careHistory,
                inspections,
                longevity
            });
        } catch (err) {
            console.error('Failed to fetch garment DNA:', err);
            res.status(500).json({ error: 'Failed to fetch garment details.' });
        }
    }

    async calculateAging(req, res) {
        try {
            const garment = await garmentRepository.findById(req.params.id);
            if (!garment) {
                return res.status(404).json({ error: 'Garment not found.' });
            }
            const { waterTemp, cycleType } = req.body;
            const longevity = garmentAgingService.calculateLongevity(garment, { waterTemp, cycleType });
            res.json({ longevity });
        } catch (err) {
            res.status(500).json({ error: 'Aging simulation calculation failed.' });
        }
    }

    async uploadAndInspect(req, res) {
        try {
            const file = req.file;
            const analysis = await garmentAnalysisService.analyzeGarmentImage(file, req.body);

            // If garmentId was passed, attach inspection record to the database
            const garmentId = req.body.garmentId || 'LV-GX-82941';
            const inspectionId = `insp_${Date.now()}`;

            await garmentRepository.addInspection({
                id: inspectionId,
                garment_id: garmentId,
                order_id: req.body.orderId || null,
                detected_condition: analysis.detectedCondition,
                confidence: analysis.confidence,
                snapshot_url: analysis.snapshotUrl,
                stage: 'BEFORE_CARE',
                notes: analysis.recommendedPreTreatment
            });

            res.json({
                message: 'Garment inspection recorded successfully.',
                analysis,
                inspectionId
            });
        } catch (err) {
            console.error('Inspection error:', err);
            res.status(500).json({ error: 'Garment optical inspection failed.' });
        }
    }

    async matchGarment(req, res) {
        try {
            const file = req.file;
            const hint = req.body.hint || '';
            const matchResult = await garmentMatchingService.matchGarment(file, req.user.id, hint);
            res.json(matchResult);
        } catch (err) {
            console.error('Garment matching error:', err);
            res.status(500).json({ error: err.message || 'Garment matching algorithm failed.' });
        }
    }

    async createGarment(req, res) {
        try {
            const { name, brand, fabric, color, size, notes } = req.body;
            if (!name || !fabric) {
                return res.status(400).json({ error: 'Name and fabric are required.' });
            }

            const uniqueNum = Math.floor(10000 + Math.random() * 90000);
            const garmentId = `LV-GX-${uniqueNum}`;
            const file = req.file;
            const imageUrl = file ? `/uploads/${file.filename}` : '/assets/images/white-shirt.jpg';

            const newGarment = {
                id: garmentId,
                user_id: req.user.id,
                name,
                brand: brand || 'Bespoke Private Label',
                fabric,
                color: color || 'Porcelain White',
                size: size || 'M',
                purchase_date: new Date().toISOString().split('T')[0],
                wash_cycles: 0,
                last_washed: 'New',
                condition_score: 100,
                care_recommendation: 'Cold Gentle Wash · Air Dry on Oak Hanger',
                status: 'IN_WARDROBE',
                image_url: imageUrl,
                notes: notes || 'Garment DNA initialized.'
            };

            await garmentRepository.create(newGarment);
            res.status(201).json({
                message: 'Garment DNA successfully registered.',
                garment: newGarment
            });
        } catch (err) {
            console.error('Create garment error:', err);
            res.status(500).json({ error: 'Failed to create garment.' });
        }
    }
}

module.exports = new GarmentController();
