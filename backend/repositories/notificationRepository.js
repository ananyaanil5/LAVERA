const db = require('../config/database');

class NotificationRepository {
    async findByUserId(userId) {
        return await db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }

    async markAsRead(id, userId) {
        return await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    }

    async markAllAsRead(userId) {
        return await db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    }

    async create(notification) {
        return await db.run(
            'INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)',
            [notification.id, notification.user_id, notification.title, notification.message, notification.type, 0]
        );
    }
}

module.exports = new NotificationRepository();
