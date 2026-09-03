const operationsInsightService = require('../services/operationsInsightService');

class AiManagerController {
    async queryOperations(req, res) {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: 'Query string is required.' });
            }

            const insight = await operationsInsightService.answerQuery(query);
            res.json(insight);
        } catch (err) {
            console.error('AI Operations query error:', err);
            res.status(500).json({ error: 'AI Operations assistant failed to inspect telemetry.' });
        }
    }

    async applyAction(req, res) {
        try {
            const { actionType, actionPayload } = req.body;
            const result = await operationsInsightService.applyRecommendation(actionType, actionPayload);
            res.json(result);
        } catch (err) {
            console.error('AI apply action error:', err);
            res.status(500).json({ error: 'Failed to execute operational action.' });
        }
    }
}

module.exports = new AiManagerController();
