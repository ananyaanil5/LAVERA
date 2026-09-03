const notificationRepository = require('../repositories/notificationRepository');

class NotificationController {
    async getMyNotifications(req, res) {
        try {
            const notifications = await notificationRepository.findByUserId(req.user.id);
            res.json({ notifications });
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve notifications.' });
        }
    }

    async markRead(req, res) {
        try {
            await notificationRepository.markAsRead(req.params.id, req.user.id);
            res.json({ success: true, message: 'Notification marked read.' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update notification.' });
        }
    }

    async markAllRead(req, res) {
        try {
            await notificationRepository.markAllAsRead(req.user.id);
            res.json({ success: true, message: 'All notifications marked read.' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update notifications.' });
        }
    }
}

module.exports = new NotificationController();
