const careRecommendationService = require('../services/careRecommendationService');
const stainAnalysisService = require('../services/stainAnalysisService');

class CareLabController {
    simulate(req, res) {
        try {
            const { fabric, treatmentType } = req.body;
            const result = careRecommendationService.simulateTreatment(fabric || '100% Cotton', treatmentType || 'DELICATE');
            res.json(result);
        } catch (err) {
            console.error('Care simulation error:', err);
            res.status(500).json({ error: 'Care simulation calculation failed.' });
        }
    }

    compare(req, res) {
        try {
            const { fabric, treatments } = req.body;
            const result = careRecommendationService.compareTreatments(
                fabric || '100% Cotton',
                treatments || ['NORMAL_WASH', 'DELICATE', 'DRY_CLEAN']
            );
            res.json(result);
        } catch (err) {
            console.error('Care comparison error:', err);
            res.status(500).json({ error: 'Side-by-side comparison failed.' });
        }
    }

    analyzeStain(req, res) {
        try {
            const file = req.file;
            const notes = req.body.notes || '';
            const result = stainAnalysisService.classifyStain(file, notes);
            res.json(result);
        } catch (err) {
            console.error('Stain analysis error:', err);
            res.status(500).json({ error: 'AI stain analysis failed.' });
        }
    }
}

module.exports = new CareLabController();
