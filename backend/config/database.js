const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

function resolveDatabasePath() {
    if (process.env.DATABASE_PATH) return path.resolve(process.env.DATABASE_PATH);
    if (process.env.DB_PATH) return path.resolve(process.env.DB_PATH);

    // Candidate locations in priority order
    const rootPath = path.resolve(__dirname, '../../lavera.sqlite');
    const backendPath = path.resolve(__dirname, '../lavera.sqlite');
    const cwdPath = path.resolve(process.cwd(), 'lavera.sqlite');

    if (fs.existsSync(rootPath)) return rootPath;
    if (fs.existsSync(backendPath)) return backendPath;
    if (fs.existsSync(cwdPath)) return cwdPath;

    // If none exist, choose the most appropriate writable directory
    const rootDir = path.resolve(__dirname, '../..');
    try {
        fs.accessSync(rootDir, fs.constants.W_OK);
        return rootPath;
    } catch (e) {
        return backendPath;
    }
}

const dbPath = resolveDatabasePath();
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        // Enable WAL mode and foreign keys for high concurrency and relational integrity
        db.run('PRAGMA foreign_keys = ON;');
        db.run('PRAGMA journal_mode = WAL;', (walErr) => {
            if (walErr) {
                console.warn('WAL mode not supported in this environment, using default journal mode.');
            }
        });
    }
});

// Promisified helpers
const query = {
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    },
    exec: (sql) => {
        return new Promise((resolve, reject) => {
            db.exec(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },
    db,
    dbPath
};

// Automatic self-healing database initialization
let initPromise = null;
async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            // Check if users table exists
            const tableCheck = await query.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='users'");
            const seeder = require('../database/seeder');

            if (!tableCheck || tableCheck.count === 0) {
                console.log('[DATABASE] No tables found in database. Initializing schema and seeding dataset...');
                const schemaPath = path.resolve(__dirname, '../database/schema.sql');
                if (fs.existsSync(schemaPath)) {
                    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
                    await query.exec(schemaSql);
                    console.log('[DATABASE] schema.sql executed successfully.');
                }
                if (seeder && typeof seeder.seedDatabase === 'function') {
                    await seeder.seedDatabase();
                    console.log('[DATABASE] Seed database complete.');
                }
            } else {
                // Ensure the required demo accounts exist and have valid credentials
                if (seeder && typeof seeder.ensureDemoAccounts === 'function') {
                    await seeder.ensureDemoAccounts(query);
                }
            }
            return true;
        } catch (err) {
            console.error('[DATABASE INIT ERROR]', err);
            throw err;
        }
    })();
    return initPromise;
}

query.ensureInitialized = ensureInitialized;

module.exports = query;

