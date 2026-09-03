const db = require('../config/database');

class OrderRepository {
    async findById(id) {
        const order = await db.get(`
            SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.address as customer_address
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [id]);
        
        if (!order) return null;

        // Fetch items
        order.items = await db.all(`
            SELECT oi.*, g.name as garment_name, g.brand as garment_brand, g.fabric as garment_fabric, g.image_url as garment_image
            FROM order_items oi
            JOIN garments g ON oi.garment_id = g.id
            WHERE oi.order_id = ?
        `, [id]);

        // Fetch Chain of Custody Timeline
        order.timeline = await db.all(`
            SELECT * FROM order_status_history
            WHERE order_id = ?
            ORDER BY sequence ASC
        `, [id]);

        return order;
    }

    async findByUserId(userId) {
        const orders = await db.all(`
            SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
        `, [userId]);

        for (const o of orders) {
            o.items = await db.all(`
                SELECT oi.*, g.name as garment_name, g.image_url as garment_image
                FROM order_items oi
                JOIN garments g ON oi.garment_id = g.id
                WHERE oi.order_id = ?
            `, [o.id]);

            o.timeline = await db.all(`
                SELECT * FROM order_status_history
                WHERE order_id = ?
                ORDER BY sequence ASC
            `, [o.id]);
        }

        return orders;
    }

    async findAll() {
        const orders = await db.all(`
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        for (const o of orders) {
            o.item_count = (await db.get('SELECT COUNT(*) as count FROM order_items WHERE order_id = ?', [o.id])).count;
        }

        return orders;
    }

    async create(order, items, initialTimeline) {
        await db.run(
            `INSERT INTO orders (id, user_id, service_type, status, pickup_date, time_slot, estimated_completion, total_price, instructions, water_liters, energy_kwh, co2_kg, eco_score)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                order.id, order.user_id, order.service_type, order.status, order.pickup_date, order.time_slot,
                order.estimated_completion, order.total_price, order.instructions, order.water_liters,
                order.energy_kwh, order.co2_kg, order.eco_score
            ]
        );

        for (const item of items) {
            await db.run(
                'INSERT INTO order_items (id, order_id, garment_id, service_type, price) VALUES (?, ?, ?, ?, ?)',
                [item.id, order.id, item.garment_id, item.service_type, item.price]
            );
            // update garment status
            await db.run("UPDATE garments SET status = 'IN_ORDER' WHERE id = ?", [item.garment_id]);
        }

        for (const stage of initialTimeline) {
            await db.run(
                `INSERT INTO order_status_history (id, order_id, stage, timestamp, location, staff_name, status, notes, sequence)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [stage.id, order.id, stage.stage, stage.timestamp, stage.location, stage.staff_name, stage.status, stage.notes, stage.sequence]
            );
        }

        return await this.findById(order.id);
    }

    async updateStatus(orderId, status) {
        return await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    }

    async updateMissingFlag(orderId, flag) {
        return await db.run('UPDATE orders SET missing_garment_flag = ? WHERE id = ?', [flag, orderId]);
    }
}

module.exports = new OrderRepository();
