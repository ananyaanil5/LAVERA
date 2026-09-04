const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const db = require('../config/database');

class AuthController {
    async login(req, res) {
        try {
            // Ensure database schema and demo accounts are ready
            if (db && typeof db.ensureInitialized === 'function') {
                await db.ensureInitialized();
            }

            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const cleanEmail = String(email).trim().toLowerCase();
            const cleanPassword = String(password);

            const user = await userRepository.findByEmail(cleanEmail);
            if (!user) {
                console.warn(`[AUTH] Login attempt failed: No user registered under "${cleanEmail}"`);
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            if (!user.password_hash || typeof user.password_hash !== 'string') {
                console.warn(`[AUTH] Login attempt failed: User "${cleanEmail}" has null/corrupt password hash`);
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            let isMatch = false;
            try {
                if (user.password_hash.startsWith('$2')) {
                    isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
                } else {
                    isMatch = (cleanPassword === user.password_hash);
                }
            } catch (cmpErr) {
                console.error(`[AUTH] Error comparing password for "${cleanEmail}":`, cmpErr.message);
                isMatch = false;
            }

            if (!isMatch) {
                console.warn(`[AUTH] Login attempt failed: Password mismatch for "${cleanEmail}"`);
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const payload = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Authentication successful.',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    avatarUrl: user.avatar_url
                }
            });
        } catch (err) {
            console.error('[AUTH ERROR] Login unexpected failure:', err);
            res.status(500).json({
                error: 'Internal server error during authentication.',
                message: err.message
            });
        }
    }

    async me(req, res) {
        try {
            const user = await userRepository.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User profile not found.' });
            }
            res.json({ user });
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve profile.' });
        }
    }

    getDemoAccounts(req, res) {
        res.json({
            accounts: [
                { role: 'CUSTOMER', email: 'demo@lavera.com', password: 'Demo@123', name: 'Ananya Sharma' },
                { role: 'ADMIN', email: 'admin@lavera.com', password: 'Admin@123', name: 'Alain Chevalier' },
                { role: 'MANAGER', email: 'manager@lavera.com', password: 'Admin@123', name: 'Claire Delacroix' }
            ]
        });
    }
}

module.exports = new AuthController();
