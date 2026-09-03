const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { JWT_SECRET } = require('../middleware/authMiddleware');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
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
            console.error('Login error:', err);
            res.status(500).json({ error: 'Internal server error during authentication.' });
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
