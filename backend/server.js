const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Database initialization
const db = require('./config/database');

// Middleware
const { authenticateToken, requireRole } = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadMiddleware');

// Controllers
const authController = require('./controllers/authController');
const garmentController = require('./controllers/garmentController');
const orderController = require('./controllers/orderController');
const careLabController = require('./controllers/careLabController');
const aiManagerController = require('./controllers/aiManagerController');
const machineController = require('./controllers/machineController');
const inventoryController = require('./controllers/inventoryController');
const analyticsController = require('./controllers/analyticsController');
const notificationController = require('./controllers/notificationController');

const app = express();
const PORT = process.env.PORT || 5000;

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
const uploadsPath = path.resolve(__dirname, '../uploads');
const frontendPath = path.resolve(__dirname, '../frontend');

app.use('/uploads', express.static(uploadsPath));
app.use('/assets', express.static(path.join(frontendPath, 'assets')));
app.use(express.static(frontendPath));

// Health check
app.get('/api/health', async (req, res) => {
    let dbStatus = 'CONNECTED';
    try {
        await db.get('SELECT 1 as test');
    } catch (e) {
        dbStatus = 'ERROR: ' + e.message;
    }
    res.json({
        status: 'UP',
        brand: 'LAVÉRA',
        tagline: 'Care, Curated. Intelligent Garment Care.',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// ================= AUTH ROUTES =================
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.get('/api/auth/me', authenticateToken, (req, res) => authController.me(req, res));
app.get('/api/auth/demo-accounts', (req, res) => authController.getDemoAccounts(req, res));

// ================= GARMENT & DNA ROUTES =================
app.get('/api/garments', authenticateToken, (req, res) => garmentController.getMyGarments(req, res));
app.get('/api/garments/:id', authenticateToken, (req, res) => garmentController.getGarmentById(req, res));
app.post('/api/garments/:id/aging', authenticateToken, (req, res) => garmentController.calculateAging(req, res));
app.post('/api/garments/inspect', authenticateToken, upload.single('image'), (req, res) => garmentController.uploadAndInspect(req, res));
app.post('/api/garments/match', authenticateToken, upload.single('image'), (req, res) => garmentController.matchGarment(req, res));
app.post('/api/garments', authenticateToken, upload.single('image'), (req, res) => garmentController.createGarment(req, res));

// ================= ORDER & CUSTODY ROUTES =================
app.get('/api/orders', authenticateToken, (req, res) => orderController.getMyOrders(req, res));
app.get('/api/orders/all', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'STAFF']), (req, res) => orderController.getAllOrders(req, res));
app.get('/api/orders/missing-audit', authenticateToken, (req, res) => orderController.getMissingGarments(req, res));
app.post('/api/orders/resolve-missing', authenticateToken, (req, res) => orderController.resolveMissingGarment(req, res));
app.get('/api/orders/:id', authenticateToken, (req, res) => orderController.getOrderById(req, res));
app.post('/api/orders', authenticateToken, (req, res) => orderController.createOrder(req, res));
app.patch('/api/orders/:id/status', authenticateToken, (req, res) => orderController.updateStatus(req, res));

// ================= VIRTUAL WASH LAB & STAIN ROUTES =================
app.post('/api/care-lab/simulate', (req, res) => careLabController.simulate(req, res));
app.post('/api/care-lab/compare', (req, res) => careLabController.compare(req, res));
app.post('/api/care-lab/stain', upload.single('image'), (req, res) => careLabController.analyzeStain(req, res));

// ================= AI LAUNDRY MANAGER ROUTES =================
app.post('/api/ai/query', authenticateToken, (req, res) => aiManagerController.queryOperations(req, res));
app.post('/api/ai/apply-action', authenticateToken, (req, res) => aiManagerController.applyAction(req, res));

// ================= MACHINE HUB =================
app.get('/api/machines', (req, res) => machineController.getAllMachines(req, res));
app.patch('/api/machines/:id', authenticateToken, (req, res) => machineController.updateMachine(req, res));

// ================= SMART INVENTORY =================
app.get('/api/inventory', (req, res) => inventoryController.getInventory(req, res));
app.patch('/api/inventory/:id/stock', authenticateToken, (req, res) => inventoryController.updateStock(req, res));

// ================= ANALYTICS & DEMAND =================
app.get('/api/analytics/metrics', (req, res) => analyticsController.getOperationsMetrics(req, res));
app.get('/api/analytics/forecast', (req, res) => analyticsController.getDemandForecast(req, res));
app.get('/api/analytics/sustainability', (req, res) => analyticsController.getSustainabilityPassport(req, res));

// ================= NOTIFICATIONS =================
app.get('/api/notifications', authenticateToken, (req, res) => notificationController.getMyNotifications(req, res));
app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => notificationController.markRead(req, res));
app.post('/api/notifications/read-all', authenticateToken, (req, res) => notificationController.markAllRead(req, res));

// Fallback to index.html for SPA client navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, async () => {
    try {
        if (db && typeof db.ensureInitialized === 'function') {
            await db.ensureInitialized();
        }
        console.log(`LAVÉRA REST API Engine listening on http://localhost:${PORT}`);
    } catch (e) {
        console.error('Database initialization during server boot encountered error:', e);
    }
});
