const db = require('../config/database');

class InventoryRepository {
    async findAll() {
        return await db.all('SELECT * FROM inventory ORDER BY current_stock / projected_usage_per_day ASC');
    }

    async findById(id) {
        return await db.get('SELECT * FROM inventory WHERE id = ?', [id]);
    }

    async updateStock(id, newStock) {
        const item = await this.findById(id);
        if (!item) return null;
        const daysRemaining = (newStock / item.projected_usage_per_day).toFixed(1);
        let status = 'IN_STOCK';
        if (daysRemaining <= 4 || newStock <= item.reorder_level) {
            status = 'REORDER_SOON';
        }
        if (daysRemaining <= 1) {
            status = 'CRITICAL';
        }

        await db.run(
            'UPDATE inventory SET current_stock = ?, days_remaining = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newStock, daysRemaining, status, id]
        );
        return await this.findById(id);
    }
}

module.exports = new InventoryRepository();
