const db = require('../config/database');

class GarmentRepository {
    async findById(id) {
        return await db.get('SELECT * FROM garments WHERE id = ?', [id]);
    }

    async findByUserId(userId) {
        return await db.all('SELECT * FROM garments WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }

    async findAll() {
        return await db.all(`
            SELECT g.*, u.name as owner_name, u.email as owner_email 
            FROM garments g 
            JOIN users u ON g.user_id = u.id 
            ORDER BY g.created_at DESC
        `);
    }

    async getCareHistory(garmentId) {
        return await db.all(
            'SELECT * FROM garment_care_history WHERE garment_id = ? ORDER BY created_at DESC',
            [garmentId]
        );
    }

    async addCareHistory(record) {
        return await db.run(
            'INSERT INTO garment_care_history (id, garment_id, wash_date, cycle_type, facility, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [record.id, record.garment_id, record.wash_date, record.cycle_type, record.facility, record.notes]
        );
    }

    async getInspections(garmentId) {
        return await db.all(
            'SELECT * FROM garment_inspections WHERE garment_id = ? ORDER BY created_at DESC',
            [garmentId]
        );
    }

    async addInspection(inspection) {
        return await db.run(
            'INSERT INTO garment_inspections (id, garment_id, order_id, detected_condition, confidence, snapshot_url, stage, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [inspection.id, inspection.garment_id, inspection.order_id, inspection.detected_condition, inspection.confidence, inspection.snapshot_url, inspection.stage, inspection.notes]
        );
    }

    async create(garment) {
        return await db.run(
            `INSERT INTO garments (id, user_id, name, brand, fabric, color, size, purchase_date, wash_cycles, last_washed, condition_score, care_recommendation, status, image_url, color_vector, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                garment.id, garment.user_id, garment.name, garment.brand, garment.fabric, garment.color,
                garment.size, garment.purchase_date, garment.wash_cycles || 0, garment.last_washed || 'Never',
                garment.condition_score || 100, garment.care_recommendation, garment.status || 'IN_WARDROBE',
                garment.image_url, garment.color_vector || '0.9,0.9,0.9', garment.notes || ''
            ]
        );
    }

    async updateCondition(id, conditionScore, cycles) {
        return await db.run(
            'UPDATE garments SET condition_score = ?, wash_cycles = ?, last_washed = ? WHERE id = ?',
            [conditionScore, cycles, 'Just now', id]
        );
    }
}

module.exports = new GarmentRepository();
