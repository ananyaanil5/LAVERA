const inventoryRepository = require('../repositories/inventoryRepository');

class InventoryController {
    async getInventory(req, res) {
        try {
            const items = await inventoryRepository.findAll();
            res.json({ inventory: items });
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve inventory items.' });
        }
    }

    async updateStock(req, res) {
        try {
            const { stock } = req.body;
            if (stock === undefined || isNaN(stock)) {
                return res.status(400).json({ error: 'Valid stock number is required.' });
            }
            const updated = await inventoryRepository.updateStock(req.params.id, Number(stock));
            res.json({ message: 'Stock level updated.', item: updated });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update stock.' });
        }
    }
}

module.exports = new InventoryController();
