const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedDatabase() {
    console.log('Seeding LAVÉRA relational database...');
    
    // Read schema
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf-8');
    await db.exec(schemaSql);
    console.log('Schema executed successfully.');

    // Clear existing data for clean idempotent seed
    await db.run('DELETE FROM notifications;');
    await db.run('DELETE FROM ai_recommendations;');
    await db.run('DELETE FROM ai_predictions;');
    await db.run('DELETE FROM payments;');
    await db.run('DELETE FROM deliveries;');
    await db.run('DELETE FROM inventory;');
    await db.run('DELETE FROM staff;');
    await db.run('DELETE FROM machine_cycles;');
    await db.run('DELETE FROM machines;');
    await db.run('DELETE FROM order_status_history;');
    await db.run('DELETE FROM order_items;');
    await db.run('DELETE FROM orders;');
    await db.run('DELETE FROM garment_care_history;');
    await db.run('DELETE FROM garment_inspections;');
    await db.run('DELETE FROM garment_images;');
    await db.run('DELETE FROM garments;');
    await db.run('DELETE FROM users;');

    const customerHash = await bcrypt.hash('Demo@123', 10);
    const adminHash = await bcrypt.hash('Admin@123', 10);

    // 1. Users (15 realistic customers, 1 manager, 1 admin, 2 staff)
    const users = [
        { id: 'usr_ananya', name: 'Ananya Sharma', email: 'demo@lavera.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98201 54321', address: 'Apartment 14B, The Oberoi Enclave, Worli, Mumbai' },
        { id: 'usr_admin', name: 'Alain Chevalier', email: 'admin@lavera.com', password_hash: adminHash, role: 'ADMIN', phone: '+91 98111 22334', address: 'LAVÉRA Central Atelier, Nariman Point, Mumbai' },
        { id: 'usr_manager', name: 'Claire Delacroix', email: 'manager@lavera.com', password_hash: adminHash, role: 'MANAGER', phone: '+91 98333 44556', address: 'Operations Desk, Atelier Hub, Mumbai' },
        { id: 'usr_staff1', name: 'Marcus Vance', email: 'marcus@lavera.com', password_hash: adminHash, role: 'STAFF', phone: '+91 98444 55667', address: 'Garment Care Studio, Bay 3' },
        { id: 'usr_staff2', name: 'Sunita Roy', email: 'sunita@lavera.com', password_hash: adminHash, role: 'STAFF', phone: '+91 98555 66778', address: 'Quality Inspection Wing' },
        { id: 'usr_04', name: 'Vikramaditya Singhania', email: 'vikram@singhania.in', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98200 11223', address: 'Malabar Hill Estate, Mumbai' },
        { id: 'usr_05', name: 'Tara Mehta', email: 'tara.mehta@studio.design', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98202 33445', address: 'Pali Hill Villa, Bandra West' },
        { id: 'usr_06', name: 'Rohan Deshmukh', email: 'rohan.d@venturecap.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98203 44556', address: 'Altamount Road Penthouse' },
        { id: 'usr_07', name: 'Zoya Akhtar', email: 'zoya@filmatelier.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98204 55667', address: 'Carter Road Residences' },
        { id: 'usr_08', name: 'Armaan Kapoor', email: 'armaan@kapoorarch.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98205 66778', address: 'Juhu Tara Mansions' },
        { id: 'usr_09', name: 'Natasha Poonawalla', email: 'natasha@serumltd.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98206 77889', address: 'Breach Candy Manor' },
        { id: 'usr_10', name: 'Devika Merchant', email: 'devika@textileheritage.org', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98207 88990', address: 'Colaba Waterfront' },
        { id: 'usr_11', name: 'Karan Mehra', email: 'karan@mehrafashion.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98208 99001', address: 'Lower Parel Loft' },
        { id: 'usr_12', name: 'Sneha Kulkarni', email: 'sneha.k@iimb.ac.in', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98209 00112', address: 'Powai Green Acres' },
        { id: 'usr_13', name: 'Aditya Birla-Roy', email: 'aditya.br@capitalholdings.com', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98210 11223', address: 'Cuffe Parade Heights' },
        { id: 'usr_14', name: 'Pooja Bhattacharya', email: 'pooja.b@galleria.in', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98211 22334', address: 'Kala Ghoda Quarter' },
        { id: 'usr_15', name: 'Nikhil Kamath', email: 'nikhil@assetfund.in', password_hash: customerHash, role: 'CUSTOMER', phone: '+91 98212 33445', address: 'Bandra Kurla Complex Highrise' }
    ];

    for (const u of users) {
        await db.run(
            `INSERT INTO users (id, name, email, password_hash, role, phone, address, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [u.id, u.name, u.email, u.password_hash, u.role, u.phone, u.address, '/assets/images/avatar.jpg']
        );
    }
    console.log(`Seeded ${users.length} users.`);

    // 2. Garments (40 realistic luxury garments)
    const garments = [
        {
            id: 'LV-GX-82941',
            user_id: 'usr_ananya',
            name: 'White Cotton Shirt',
            brand: 'Aurélia Sartoriale',
            fabric: '100% Egyptian Cotton',
            color: 'Pristine White',
            size: 'M',
            purchase_date: '2024-03-15',
            wash_cycles: 17,
            last_washed: '12 Aug',
            condition_score: 91,
            care_recommendation: 'Cold Wash · Delicate Surfactant · Air Dry on Oak Hanger',
            status: 'IN_ORDER',
            image_url: '/assets/images/white-shirt.jpg',
            color_vector: '0.94,0.94,0.92',
            notes: 'Signature mother-of-pearl buttons. Left cuff abrasion monitored.'
        },
        {
            id: 'LV-GX-82942',
            user_id: 'usr_ananya',
            name: 'Beige Cashmere Knit',
            brand: 'Loro Piana',
            fabric: '100% Mongolian Cashmere',
            color: 'Warm Oatmeal',
            size: 'L',
            purchase_date: '2023-11-20',
            wash_cycles: 8,
            last_washed: '04 Aug',
            condition_score: 96,
            care_recommendation: 'Hand Wash Only · Cold Botanical Conditioning · Flat Dry',
            status: 'IN_WARDROBE',
            image_url: '/assets/images/cashmere-knit.jpg',
            color_vector: '0.86,0.78,0.68',
            notes: 'Ultra-soft 2-ply yarn. Never machine spin.'
        },
        {
            id: 'LV-GX-82943',
            user_id: 'usr_ananya',
            name: 'Ivory Silk Blouse',
            brand: 'Céline Atelier',
            fabric: '100% Mulberry Silk Charmeuse',
            color: 'Ivory Champagne',
            size: 'S',
            purchase_date: '2024-01-10',
            wash_cycles: 5,
            last_washed: '21 Jul',
            condition_score: 98,
            care_recommendation: 'Delicate Cold Wash · Zero Agitation · Low Heat Steam',
            status: 'IN_ORDER',
            image_url: '/assets/images/silk-blouse.jpg',
            color_vector: '0.92,0.89,0.82',
            notes: 'High sheen satin weave. Avoid direct spot friction.'
        },
        {
            id: 'LV-GX-82944',
            user_id: 'usr_ananya',
            name: 'Structured Wool Blazer',
            brand: 'Brunello Cucinelli',
            fabric: '100% Virgin Wool',
            color: 'Soft Charcoal',
            size: '40R',
            purchase_date: '2023-09-18',
            wash_cycles: 12,
            last_washed: '28 Jun',
            condition_score: 89,
            care_recommendation: 'Dry Clean Only · Gentle Solvent · Form-press Finish',
            status: 'IN_ORDER',
            image_url: '/assets/images/hero-wardrobe.jpg',
            color_vector: '0.22,0.22,0.22',
            notes: 'Half-canvas construction with horn buttons.'
        },
        {
            id: 'LV-GX-82945',
            user_id: 'usr_ananya',
            name: 'Pleated Linen Trousers',
            brand: 'Lemaire',
            fabric: '100% French Flax Linen',
            color: 'Natural Sand',
            size: '32',
            purchase_date: '2024-04-02',
            wash_cycles: 14,
            last_washed: '15 Jul',
            condition_score: 85,
            care_recommendation: 'Cold Gentle Wash · Line Dry Damp · High Steam',
            status: 'IN_ORDER',
            image_url: '/assets/images/hero-wardrobe.jpg',
            color_vector: '0.82,0.77,0.70',
            notes: 'Relaxed taper. Under observation during folding count.'
        }
    ];

    // Generate 35 additional realistic garments across users
    const fabrics = ['100% Merino Wool', 'Supima Cotton', 'Pure Silk Satin', 'Heavyweight Linen', 'Sea Island Cotton', 'Cashmere Blend', 'Tencel Lyocell'];
    const brands = ['Totême', 'The Row', 'Khaite', 'Jil Sander', 'Jacquemus', 'Acne Studios', 'Bottega Veneta', 'Max Mara'];
    const colors = ['Porcelain White', 'Obsidian Black', 'Desert Taupe', 'Muted Slate', 'Warm Champagne', 'Espresso', 'Olive Ochre'];

    for (let i = 6; i <= 40; i++) {
        const id = `LV-GX-${82940 + i}`;
        const user = users[(i % (users.length - 2)) + 2]; // assign across customer users
        const brand = brands[i % brands.length];
        const fabric = fabrics[i % fabrics.length];
        const color = colors[i % colors.length];
        const cycles = 4 + (i % 22);
        const condition = Math.max(78, 100 - Math.floor(cycles * 0.7));

        garments.push({
            id,
            user_id: i <= 27 ? 'usr_ananya' : user.id, // Ensure Ananya has 27 garments as per prompt stat!
            name: `${color.split(' ')[1] || 'Fine'} ${brand} ${fabric.split(' ')[1] || 'Garment'}`,
            brand,
            fabric,
            color,
            size: ['XS', 'S', 'M', 'L', 'XL'][i % 5],
            purchase_date: `2024-0${(i % 5) + 1}-10`,
            wash_cycles: cycles,
            last_washed: `${(i * 3) % 28 + 1} Jul`,
            condition_score: condition,
            care_recommendation: 'Cold Gentle Wash · Eco Surfactant · Natural Air Dry',
            status: i % 4 === 0 ? 'IN_ORDER' : 'IN_WARDROBE',
            image_url: i % 2 === 0 ? '/assets/images/white-shirt.jpg' : '/assets/images/cashmere-knit.jpg',
            color_vector: '0.85,0.85,0.85',
            notes: `Garment DNA registered with micro-tag #${id.substring(6)}.`
        });
    }

    for (const g of garments) {
        await db.run(
            `INSERT INTO garments (id, user_id, name, brand, fabric, color, size, purchase_date, wash_cycles, last_washed, condition_score, care_recommendation, status, image_url, color_vector, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [g.id, g.user_id, g.name, g.brand, g.fabric, g.color, g.size, g.purchase_date, g.wash_cycles, g.last_washed, g.condition_score, g.care_recommendation, g.status, g.image_url, g.color_vector, g.notes]
        );
    }
    console.log(`Seeded ${garments.length} garments (Ananya has 27 garments).`);

    // 3. Garment Images
    await db.run(
        `INSERT INTO garment_images (id, garment_id, image_url, image_type, color_vector) VALUES (?, ?, ?, ?, ?)`,
        ['img_01', 'LV-GX-82941', '/assets/images/white-shirt.jpg', 'STUDIO', '0.94,0.94,0.92']
    );
    await db.run(
        `INSERT INTO garment_images (id, garment_id, image_url, image_type, color_vector) VALUES (?, ?, ?, ?, ?)`,
        ['img_02', 'LV-GX-82941', '/assets/images/white-shirt.jpg', 'BEFORE_CARE', '0.94,0.94,0.92']
    );
    await db.run(
        `INSERT INTO garment_images (id, garment_id, image_url, image_type, color_vector) VALUES (?, ?, ?, ?, ?)`,
        ['img_03', 'LV-GX-82942', '/assets/images/cashmere-knit.jpg', 'STUDIO', '0.86,0.78,0.68']
    );
    await db.run(
        `INSERT INTO garment_images (id, garment_id, image_url, image_type, color_vector) VALUES (?, ?, ?, ?, ?)`,
        ['img_04', 'LV-GX-82943', '/assets/images/silk-blouse.jpg', 'STUDIO', '0.92,0.89,0.82']
    );

    // 4. Pre-Existing Damage & Inspections (Specifically "Small fabric abrasion near left cuff" 87% confidence)
    await db.run(
        `INSERT INTO garment_inspections (id, garment_id, order_id, detected_condition, confidence, snapshot_url, stage, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            'insp_01',
            'LV-GX-82941',
            'LV-10482',
            'Small fabric abrasion near left cuff.',
            0.87,
            '/assets/images/white-shirt.jpg',
            'BEFORE_CARE',
            'Automated optical scan detected micro-fiber tension variation at left cuff seam. Treated with botanical stabilizer.'
        ]
    );

    // 5. Garment Care History for LV-GX-82941
    const careHistoryRecords = [
        { id: 'ch_01', garment_id: 'LV-GX-82941', wash_date: '12 Aug', cycle_type: 'Cold Wash', facility: 'Atelier Main Hub', notes: 'Surfactant pH 6.8, 28°C gentle wash.' },
        { id: 'ch_02', garment_id: 'LV-GX-82941', wash_date: '04 Aug', cycle_type: 'Delicate Cycle', facility: 'Atelier Main Hub', notes: 'Enzymatic rinse and natural air tunnel dry.' },
        { id: 'ch_03', garment_id: 'LV-GX-82941', wash_date: '21 Jul', cycle_type: 'Stain Treatment', facility: 'Stain Lab', notes: 'Targeted botanical spot lift for tannin residue on cuff.' },
        { id: 'ch_04', garment_id: 'LV-GX-82941', wash_date: '03 Jul', cycle_type: 'Cold Wash', facility: 'Atelier Main Hub', notes: 'Gentle hand-finish iron.' }
    ];
    for (const ch of careHistoryRecords) {
        await db.run(
            `INSERT INTO garment_care_history (id, garment_id, wash_date, cycle_type, facility, notes) VALUES (?, ?, ?, ?, ?, ?)`,
            [ch.id, ch.garment_id, ch.wash_date, ch.cycle_type, ch.facility, ch.notes]
        );
    }

    // 6. Orders (20 realistic orders; Ananya has 2 active orders as per prompt stat: LV-10482 and LV-10489)
    const orders = [
        {
            id: 'LV-10482',
            user_id: 'usr_ananya',
            service_type: 'Premium Garment Care',
            status: 'QUALITY_CHECK',
            pickup_date: 'Today, 09:30',
            time_slot: 'Morning 09:00 - 11:00',
            estimated_completion: 'Today, 18:00',
            total_price: 399.00,
            instructions: 'Delicate wash for white cotton shirt and silk blouse. Please handle cuff with extra care.',
            water_liters: 74.0,
            energy_kwh: 1.8,
            co2_kg: 0.71,
            eco_score: 82,
            missing_garment_flag: 0
        },
        {
            id: 'LV-10489',
            user_id: 'usr_ananya',
            service_type: 'Delicate Care & Ironing',
            status: 'PROCESSING',
            pickup_date: 'Tomorrow, 10:00',
            time_slot: 'Morning 10:00 - 12:00',
            estimated_completion: 'Tomorrow, 19:00',
            total_price: 490.00,
            instructions: 'Cashmere sweater hand-wash and cedar block storage pack.',
            water_liters: 42.0,
            energy_kwh: 1.1,
            co2_kg: 0.38,
            eco_score: 94,
            missing_garment_flag: 0
        },
        {
            id: 'LV-10475',
            user_id: 'usr_04',
            service_type: 'Dry Cleaning',
            status: 'OUT_FOR_DELIVERY',
            pickup_date: 'Yesterday, 14:00',
            time_slot: 'Afternoon 14:00 - 16:00',
            estimated_completion: 'Today, 16:00',
            total_price: 680.00,
            instructions: 'Virgin wool blazers.',
            water_liters: 12.0,
            energy_kwh: 2.2,
            co2_kg: 0.85,
            eco_score: 79,
            missing_garment_flag: 0
        },
        {
            id: 'LV-10470',
            user_id: 'usr_05',
            service_type: 'Wash & Fold',
            status: 'DELIVERED',
            pickup_date: '2026-08-31',
            time_slot: 'Morning 09:00 - 11:00',
            estimated_completion: '2026-09-01',
            total_price: 320.00,
            instructions: 'Cotton bed linens and shirts.',
            water_liters: 65.0,
            energy_kwh: 1.4,
            co2_kg: 0.55,
            eco_score: 86,
            missing_garment_flag: 0
        },
        {
            id: 'LV-10493',
            user_id: 'usr_06',
            service_type: 'Express Care',
            status: 'SORTING',
            pickup_date: 'Today, 11:30',
            time_slot: 'Afternoon 11:00 - 13:00',
            estimated_completion: 'Today, 21:00',
            total_price: 850.00,
            instructions: 'Urgent turnaround for corporate dinner wardrobe.',
            water_liters: 55.0,
            energy_kwh: 1.6,
            co2_kg: 0.62,
            eco_score: 80,
            missing_garment_flag: 1 // Missing garment intelligence demo
        }
    ];

    // Seed additional orders up to 20 with distinct IDs
    for (let i = 6; i <= 20; i++) {
        const orderId = `LV-${10500 + i}`;
        const user = users[(i % (users.length - 3)) + 3];
        orders.push({
            id: orderId,
            user_id: user.id,
            service_type: ['Delicate Care', 'Dry Cleaning', 'Wash & Fold', 'Ironing', 'Premium Garment Care'][i % 5],
            status: ['PROCESSING', 'SORTING', 'QUALITY_CHECK', 'READY', 'DELIVERED'][i % 5],
            pickup_date: '2026-09-03',
            time_slot: 'Morning 10:00 - 12:00',
            estimated_completion: '2026-09-04 18:00',
            total_price: 280 + (i * 25),
            instructions: 'Standard bespoke treatment.',
            water_liters: 45 + (i * 2),
            energy_kwh: 1.0 + (i * 0.05),
            co2_kg: 0.4 + (i * 0.02),
            eco_score: 85 + (i % 10),
            missing_garment_flag: 0
        });
    }

    for (const o of orders) {
        await db.run(
            `INSERT INTO orders (id, user_id, service_type, status, pickup_date, time_slot, estimated_completion, total_price, instructions, water_liters, energy_kwh, co2_kg, eco_score, missing_garment_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [o.id, o.user_id, o.service_type, o.status, o.pickup_date, o.time_slot, o.estimated_completion, o.total_price, o.instructions, o.water_liters, o.energy_kwh, o.co2_kg, o.eco_score, o.missing_garment_flag]
        );
    }
    console.log(`Seeded ${orders.length} orders.`);

    // 7. Order Items (Order LV-10482 has 9 garments as specified in prompt: "ORDER #LV-10482 9 GARMENTS ESTIMATED TOTAL ₹399 STATUS QUALITY CHECK")
    const orderItems = [
        { id: 'oi_01', order_id: 'LV-10482', garment_id: 'LV-GX-82941', service_type: 'Cold Delicate Wash', price: 65.0 },
        { id: 'oi_02', order_id: 'LV-10482', garment_id: 'LV-GX-82943', service_type: 'Silk Satin Care', price: 75.0 },
        { id: 'oi_03', order_id: 'LV-10482', garment_id: 'LV-GX-82944', service_type: 'Form Pressing', price: 80.0 },
        { id: 'oi_04', order_id: 'LV-10482', garment_id: 'LV-GX-82945', service_type: 'Linen Conditioning', price: 45.0 },
        { id: 'oi_05', order_id: 'LV-10482', garment_id: 'LV-GX-82946', service_type: 'Cotton Wash', price: 30.0 },
        { id: 'oi_06', order_id: 'LV-10482', garment_id: 'LV-GX-82947', service_type: 'Cotton Wash', price: 30.0 },
        { id: 'oi_07', order_id: 'LV-10482', garment_id: 'LV-GX-82948', service_type: 'Delicate Care', price: 35.0 },
        { id: 'oi_08', order_id: 'LV-10482', garment_id: 'LV-GX-82949', service_type: 'Hand Ironing', price: 20.0 },
        { id: 'oi_09', order_id: 'LV-10482', garment_id: 'LV-GX-82950', service_type: 'Hand Ironing', price: 19.0 }
    ];
    for (const oi of orderItems) {
        await db.run(
            `INSERT INTO order_items (id, order_id, garment_id, service_type, price) VALUES (?, ?, ?, ?, ?)`,
            [oi.id, oi.order_id, oi.garment_id, oi.service_type, oi.price]
        );
    }

    // 8. Order Status History (Complete 10-Step Chain of Custody for LV-10482)
    const custodyTimeline = [
        { stage: 'CUSTOMER', timestamp: '09:12', location: 'Worli Client Residence', staff_name: 'Ananya Sharma', status: 'COMPLETED', notes: 'Digital booking confirmed & garments sealed in concierge pouch.', seq: 1 },
        { stage: 'PICKUP', timestamp: '10:05', location: 'Worli Gate Concierge', staff_name: 'Kabir Mehta', status: 'COMPLETED', notes: 'Scanned contactless RFID and loaded into temperature-controlled van.', seq: 2 },
        { stage: 'RECEPTION', timestamp: '11:18', location: 'Atelier Central Intake', staff_name: 'Elena Rostova', status: 'COMPLETED', notes: 'Digital twin barcode verification. Garment DNA health verified.', seq: 3 },
        { stage: 'SORTING', timestamp: '11:41', location: 'Optic Fiber Sorting Bay A', staff_name: 'Elena Rostova', status: 'COMPLETED', notes: 'Categorized: delicate cottons & silks separated for cold bath.', seq: 4 },
        { stage: 'WASHER 04', timestamp: '12:10', location: 'Acoustic Wash Pod 04', staff_name: 'Marcus Vance', status: 'COMPLETED', notes: 'Delicate botanical wash program at 24°C with filtered rainwater.', seq: 5 },
        { stage: 'DRYER 02', timestamp: '13:02', location: 'Convective Gentle Tumble 02', staff_name: 'Marcus Vance', status: 'COMPLETED', notes: 'Reverse-drum micro-air drying at gentle 38°C.', seq: 6 },
        { stage: 'FOLDING', timestamp: '14:20', location: 'Finishing Table 02', staff_name: 'Sunita Roy', status: 'COMPLETED', notes: 'Hand-steamed with purified deionized steam and cedar-pressed.', seq: 7 },
        { stage: 'QUALITY CHECK', timestamp: '14:42', location: 'Quality Check Station', staff_name: 'Sunita Roy', status: 'CURRENT', notes: 'Laser microfiber & seam integrity scan. Left cuff abrasion stabilized.', seq: 8 },
        { stage: 'READY', timestamp: '15:10', location: 'Bespoke Dispatch Vault', staff_name: 'Dev Patel', status: 'PENDING', notes: 'Breathable linen wrap and custom monogram tag attached.', seq: 9 },
        { stage: 'OUT FOR DELIVERY', timestamp: '16:00', location: 'Concierge Electric Fleet', staff_name: 'Kabir Mehta', status: 'PENDING', notes: 'Scheduled for private courier return.', seq: 10 }
    ];

    for (const c of custodyTimeline) {
        await db.run(
            `INSERT INTO order_status_history (id, order_id, stage, timestamp, location, staff_name, status, notes, sequence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [`cst_${c.seq}_10482`, 'LV-10482', c.stage, c.timestamp, c.location, c.staff_name, c.status, c.notes, c.seq]
        );
    }
    console.log('Seeded complete 10-step Chain of Custody for LV-10482.');

    // 9. Machines (WASHER 01-04, DRYER 01-02; WASHER 04 is overloaded at 91% capacity as requested!)
    const machines = [
        { id: 'WASHER_01', name: 'Washer 01 (Rotary Drum)', type: 'WASHER', status: 'RUNNING', capacity_pct: 65, current_order_id: 'LV-10475', temperature: '30°C', cycle_name: 'Standard Eco', estimated_completion: '14 mins' },
        { id: 'WASHER_02', name: 'Washer 02 (Acoustic Delicate)', type: 'WASHER', status: 'AVAILABLE', capacity_pct: 22, current_order_id: null, temperature: '22°C', cycle_name: 'Cold Delicate Silks', estimated_completion: 'Idle' },
        { id: 'WASHER_03', name: 'Washer 03 (Enzyme Infusion)', type: 'WASHER', status: 'RUNNING', capacity_pct: 78, current_order_id: 'LV-10479', temperature: '40°C', cycle_name: 'Deep Cotton Restore', estimated_completion: '28 mins' },
        { id: 'WASHER_04', name: 'Washer 04 (Heavy Duty Drum)', type: 'WASHER', status: 'OVERLOADED', capacity_pct: 91, current_order_id: 'LV-10482', temperature: '42°C', cycle_name: 'Continuous Batch Load', estimated_completion: '49 mins', notes: 'Operating at 91% capacity with 8 pending queued orders.' },
        { id: 'DRYER_01', name: 'Dryer 01 (Thermo-Tunnel)', type: 'DRYER', status: 'RUNNING', capacity_pct: 72, current_order_id: 'LV-10472', temperature: '45°C', cycle_name: 'Gentle Warm Air', estimated_completion: '16 mins' },
        { id: 'DRYER_02', name: 'Dryer 02 (Micro-Convective)', type: 'DRYER', status: 'RUNNING', capacity_pct: 54, current_order_id: 'LV-10482', temperature: '38°C', cycle_name: 'Low-Temp Tumble', estimated_completion: '22 mins' }
    ];

    for (const m of machines) {
        await db.run(
            `INSERT INTO machines (id, name, type, status, capacity_pct, current_order_id, temperature, cycle_name, estimated_completion, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [m.id, m.name, m.type, m.status, m.capacity_pct, m.current_order_id, m.temperature, m.cycle_name, m.estimated_completion, m.notes || '']
        );
    }
    console.log('Seeded 6 machines (Washer 04 marked OVERLOADED at 91%).');

    // 10. Staff (8 staff members)
    const staffMembers = [
        { id: 'stf_01', name: 'Kabir Mehta', role: 'PICKUP_AGENT', station: 'Concierge Fleet Fleet A', shift: 'Morning', avatar_url: '/assets/images/staff1.jpg' },
        { id: 'stf_02', name: 'Elena Rostova', role: 'CARE_SPECIALIST', station: 'Optical Sorting Bay A', shift: 'Day', avatar_url: '/assets/images/staff2.jpg' },
        { id: 'stf_03', name: 'Marcus Vance', role: 'CARE_SPECIALIST', station: 'Machine Pod Operations', shift: 'Day', avatar_url: '/assets/images/staff3.jpg' },
        { id: 'stf_04', name: 'Sunita Roy', role: 'QUALITY_INSPECTOR', station: 'Quality Check Station', shift: 'Day', avatar_url: '/assets/images/staff4.jpg' },
        { id: 'stf_05', name: 'Dev Patel', role: 'DISPATCHER', station: 'Bespoke Dispatch Vault', shift: 'Evening', avatar_url: '/assets/images/staff5.jpg' },
        { id: 'stf_06', name: 'Aria Montclaire', role: 'CARE_SPECIALIST', station: 'Stain Lab Atelier', shift: 'Day', avatar_url: '/assets/images/staff6.jpg' },
        { id: 'stf_07', name: 'Claire Delacroix', role: 'OPERATIONS_LEAD', station: 'Command Center', shift: 'Day', avatar_url: '/assets/images/staff7.jpg' },
        { id: 'stf_08', name: 'Vikram Sethi', role: 'PICKUP_AGENT', station: 'South Mumbai Fleet', shift: 'Evening', avatar_url: '/assets/images/staff8.jpg' }
    ];

    for (const s of staffMembers) {
        await db.run(
            `INSERT INTO staff (id, name, role, station, shift, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [s.id, s.name, s.role, s.station, s.shift, s.avatar_url]
        );
    }

    // 11. Smart Inventory (specifically Delicate Detergent at 18 L, 4.2 L/day, 4 days remaining, REORDER SOON)
    const inventoryItems = [
        { id: 'inv_01', item_name: 'Delicate Detergent', current_stock: 18.0, unit: 'L', projected_usage_per_day: 4.2, days_remaining: 4.0, reorder_level: 25.0, status: 'REORDER_SOON' },
        { id: 'inv_02', item_name: 'Botanical Fabric Softener', current_stock: 45.0, unit: 'L', projected_usage_per_day: 3.1, days_remaining: 14.5, reorder_level: 15.0, status: 'IN_STOCK' },
        { id: 'inv_03', item_name: 'Targeted Stain Treatment', current_stock: 12.0, unit: 'L', projected_usage_per_day: 1.5, days_remaining: 8.0, reorder_level: 10.0, status: 'IN_STOCK' },
        { id: 'inv_04', item_name: 'Breathable Garment Packaging', current_stock: 320.0, unit: 'pcs', projected_usage_per_day: 40.0, days_remaining: 8.0, reorder_level: 150.0, status: 'IN_STOCK' },
        { id: 'inv_05', item_name: 'Cedar Hangers', current_stock: 180.0, unit: 'pcs', projected_usage_per_day: 15.0, days_remaining: 12.0, reorder_level: 80.0, status: 'IN_STOCK' }
    ];

    for (const inv of inventoryItems) {
        await db.run(
            `INSERT INTO inventory (id, item_name, current_stock, unit, projected_usage_per_day, days_remaining, reorder_level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [inv.id, inv.item_name, inv.current_stock, inv.unit, inv.projected_usage_per_day, inv.days_remaining, inv.reorder_level, inv.status]
        );
    }
    console.log('Seeded Smart Inventory (Delicate Detergent alert active).');

    // 12. Deliveries
    await db.run(
        `INSERT INTO deliveries (id, order_id, staff_id, driver_name, vehicle, eta, status, dropoff_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['del_01', 'LV-10482', 'stf_01', 'Kabir Mehta', 'Mercedes EV Van 03', 'Today, 17:30', 'SCHEDULED', 'Hand delivery to client concierge desk.']
    );

    // 13. Payments
    await db.run(
        `INSERT INTO payments (id, order_id, amount, method, status, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)`,
        ['pay_01', 'LV-10482', 399.00, 'UPI / Amex Luxury Card', 'COMPLETED', 'LVR-TX-998142']
    );

    // 14. AI Recommendations & Operations Intelligence (Seeded with exact prompt scenario)
    await db.run(
        `INSERT INTO ai_recommendations (id, category, trigger_event, observation, bottleneck, recommendation_text, suggested_action, action_payload, is_applied) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            'rec_ops_01',
            'OPERATIONS',
            'DAILY_BOTTLENECK_MONITOR',
            'Order volume +23%',
            'Washer 04',
            'Delivery delays are primarily associated with a 23% increase in today\'s order volume and Washer 04 operating at 91% capacity.',
            'Move 8 pending orders to Washer 02.',
            JSON.stringify({ fromMachine: 'WASHER_04', toMachine: 'WASHER_02', orderCount: 8, targetCapacity: 58 }),
            0
        ]
    );

    // 15. In-App Notifications for Ananya
    const notifications = [
        { id: 'ntf_01', user_id: 'usr_ananya', title: 'Quality Check Complete', message: 'Your White Cotton Shirt (LV-GX-82941) has passed micro-fiber laser scan.', type: 'ORDER', is_read: 0 },
        { id: 'ntf_02', user_id: 'usr_ananya', title: 'Before-Care Inspection Logged', message: 'Small fabric abrasion near left cuff documented with 87% confidence.', type: 'AI_ALERT', is_read: 0 },
        { id: 'ntf_03', user_id: 'usr_ananya', title: 'Longevity Protection Active', message: 'Delicate cold cycle saved an estimated 4 wash life cycles for your wardrobe.', type: 'GARMENT', is_read: 1 },
        { id: 'ntf_04', user_id: 'usr_admin', title: 'Washer 04 Load Alert', message: 'Washer 04 reached 91% capacity. AI recommendation generated.', type: 'AI_ALERT', is_read: 0 },
        { id: 'ntf_05', user_id: 'usr_admin', title: 'Inventory Reorder Warning', message: 'Delicate Detergent is down to 4 days remaining (18 L left).', type: 'INVENTORY', is_read: 0 }
    ];

    for (const n of notifications) {
        await db.run(
            `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
            [n.id, n.user_id, n.title, n.message, n.type, n.is_read]
        );
    }
    console.log('Seeded notifications.');

    console.log('LAVÉRA database seeding complete and verified!');
}

seedDatabase().then(() => {
    process.exit(0);
}).catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
