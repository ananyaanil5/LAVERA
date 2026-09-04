const db = require('../config/database');

class UserRepository {
    async findByEmail(email) {
        if (!email) return null;
        const normalized = String(email).toLowerCase().trim();
        return await db.get('SELECT * FROM users WHERE LOWER(TRIM(email)) = ?', [normalized]);
    }

    async findById(id) {
        return await db.get('SELECT id, name, email, role, phone, address, avatar_url, created_at FROM users WHERE id = ?', [id]);
    }

    async findAllCustomers() {
        return await db.all("SELECT id, name, email, role, phone, address, created_at FROM users WHERE role = 'CUSTOMER' ORDER BY name ASC");
    }

    async create(user) {
        return await db.run(
            'INSERT INTO users (id, name, email, password_hash, role, phone, address, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user.id, user.name, user.email.toLowerCase().trim(), user.password_hash, user.role, user.phone, user.address, user.avatar_url || '']
        );
    }
}

module.exports = new UserRepository();
