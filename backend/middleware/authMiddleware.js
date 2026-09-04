const jwt = require('jsonwebtoken');

const JWT_SECRET = (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0)
    ? process.env.JWT_SECRET.trim()
    : 'lavera_haute_couture_secret_key_2026';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Session expired or invalid token.' });
        }
        req.user = user;
        next();
    });
}

function requireRole(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Access forbidden for role: ${req.user.role}. Required: ${roles.join(', ')}` });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    requireRole,
    JWT_SECRET
};
