const db = require('../config/database');

class MachineRepository {
    async findAll() {
        return await db.all('SELECT * FROM machines ORDER BY type DESC, id ASC');
    }

    async findById(id) {
        return await db.get('SELECT * FROM machines WHERE id = ?', [id]);
    }

    async updateStatus(id, status, capacityPct, currentOrderId, notes) {
        return await db.run(
            `UPDATE machines SET status = ?, capacity_pct = COALESCE(?, capacity_pct), 
             current_order_id = COALESCE(?, current_order_id), notes = COALESCE(?, notes), 
             updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, capacityPct, currentOrderId, notes, id]
        );
    }

    async rebalanceLoad(fromMachineId, toMachineId, fromCapacity, toCapacity, notes) {
        await db.run(
            'UPDATE machines SET capacity_pct = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [fromCapacity, fromCapacity > 85 ? 'OVERLOADED' : 'RUNNING', notes, fromMachineId]
        );
        await db.run(
            'UPDATE machines SET capacity_pct = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [toCapacity, 'RUNNING', 'Rebalanced via AI Operations recommendation.', toMachineId]
        );
    }
}

module.exports = new MachineRepository();
