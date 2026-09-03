const orderRepository = require('../repositories/orderRepository');
const notificationRepository = require('../repositories/notificationRepository');
const db = require('../config/database');

class OrderController {
    async getMyOrders(req, res) {
        try {
            const orders = await orderRepository.findByUserId(req.user.id);
            res.json({ orders });
        } catch (err) {
            console.error('Failed to get orders:', err);
            res.status(500).json({ error: 'Failed to retrieve orders.' });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderRepository.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found.' });
            }
            res.json({ order });
        } catch (err) {
            console.error('Failed to get order:', err);
            res.status(500).json({ error: 'Failed to retrieve order details.' });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderRepository.findAll();
            res.json({ orders });
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve all orders.' });
        }
    }

    async createOrder(req, res) {
        try {
            const { serviceType, garmentIds, pickupDate, timeSlot, instructions } = req.body;
            if (!serviceType || !garmentIds || garmentIds.length === 0) {
                return res.status(400).json({ error: 'Service type and at least one garment are required.' });
            }

            const uniqueNum = Math.floor(10000 + Math.random() * 90000);
            const orderId = `LV-${uniqueNum}`;

            const basePricePerItem = serviceType.includes('Dry') ? 85 : serviceType.includes('Premium') ? 65 : 45;
            const totalPrice = garmentIds.length * basePricePerItem;

            const newOrder = {
                id: orderId,
                user_id: req.user.id,
                service_type: serviceType,
                status: 'PICKUP',
                pickup_date: pickupDate || 'Today, Evening',
                time_slot: timeSlot || '16:00 - 18:00',
                estimated_completion: 'Tomorrow, 18:00',
                total_price: totalPrice,
                instructions: instructions || 'Handle with gentle bespoke protocol.',
                water_liters: Number((garmentIds.length * 7.5).toFixed(1)),
                energy_kwh: Number((garmentIds.length * 0.18).toFixed(2)),
                co2_kg: Number((garmentIds.length * 0.08).toFixed(2)),
                eco_score: 92
            };

            const items = garmentIds.map((gid, idx) => ({
                id: `oi_${Date.now()}_${idx}`,
                garment_id: gid,
                service_type: serviceType,
                price: basePricePerItem
            }));

            // Generate initial 10-stage Chain of Custody Timeline
            const initialTimeline = [
                { id: `cst_1_${orderId}`, stage: 'CUSTOMER', timestamp: '10:00', location: 'Client Residence', staff_name: req.user.name, status: 'COMPLETED', notes: 'Digital booking confirmed & garments prepared.', sequence: 1 },
                { id: `cst_2_${orderId}`, stage: 'PICKUP', timestamp: '11:15', location: 'Concierge Fleet Van', staff_name: 'Kabir Mehta', status: 'CURRENT', notes: 'Concierge van en route to pickup location.', sequence: 2 },
                { id: `cst_3_${orderId}`, stage: 'RECEPTION', timestamp: '12:30', location: 'Atelier Central Intake', staff_name: 'Elena Rostova', status: 'PENDING', notes: 'Awaiting digital barcode scan.', sequence: 3 },
                { id: `cst_4_${orderId}`, stage: 'SORTING', timestamp: '13:00', location: 'Optic Fiber Sorting Bay A', staff_name: 'Elena Rostova', status: 'PENDING', notes: 'Scheduled for fabric segregation.', sequence: 4 },
                { id: `cst_5_${orderId}`, stage: 'WASHER 02', timestamp: '13:45', location: 'Acoustic Wash Pod 02', staff_name: 'Marcus Vance', status: 'PENDING', notes: 'Delicate botanical wash program.', sequence: 5 },
                { id: `cst_6_${orderId}`, stage: 'DRYER 02', timestamp: '14:40', location: 'Convective Gentle Tumble 02', staff_name: 'Marcus Vance', status: 'PENDING', notes: 'Low-heat micro-air drying.', sequence: 6 },
                { id: `cst_7_${orderId}`, stage: 'FOLDING', timestamp: '15:30', location: 'Finishing Table 02', staff_name: 'Sunita Roy', status: 'PENDING', notes: 'Hand-steamed and cedar-pressed.', sequence: 7 },
                { id: `cst_8_${orderId}`, stage: 'QUALITY CHECK', timestamp: '16:15', location: 'Quality Check Station', staff_name: 'Sunita Roy', status: 'PENDING', notes: 'Laser microfiber & seam scan.', sequence: 8 },
                { id: `cst_9_${orderId}`, stage: 'READY', timestamp: '17:00', location: 'Bespoke Dispatch Vault', staff_name: 'Dev Patel', status: 'PENDING', notes: 'Garments sealed in breathable linen wrap.', sequence: 9 },
                { id: `cst_10_${orderId}`, stage: 'OUT FOR DELIVERY', timestamp: '18:00', location: 'Electric Courier Fleet', staff_name: 'Kabir Mehta', status: 'PENDING', notes: 'Dispatched for evening drop-off.', sequence: 10 }
            ];

            const created = await orderRepository.create(newOrder, items, initialTimeline);

            await notificationRepository.create({
                id: `ntf_ord_${Date.now()}`,
                user_id: req.user.id,
                title: 'Order Received',
                message: `Order #${orderId} with ${garmentIds.length} garment(s) has been accepted for ${serviceType}.`,
                type: 'ORDER'
            });

            res.status(201).json({
                message: 'Order created successfully.',
                order: created
            });
        } catch (err) {
            console.error('Order creation error:', err);
            res.status(500).json({ error: 'Failed to create order.' });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            await orderRepository.updateStatus(req.params.id, status);
            res.json({ message: 'Order status updated successfully.', status });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update order status.' });
        }
    }

    async getMissingGarments(req, res) {
        try {
            // Feature #18: Missing Garment Intelligence
            // Reconciles Expected vs Received vs Processed vs Delivered
            const auditReport = {
                orderId: 'LV-10493',
                client: 'Rohan Deshmukh',
                expectedGarments: 12,
                receivedGarments: 12,
                processedGarments: 11,
                deliveredGarments: 11,
                discrepancyCount: 1,
                systemAlert: '1 garment is currently unaccounted for.',
                unaccountedGarment: {
                    id: 'LV-GX-82945',
                    name: 'Pleated Linen Trousers',
                    brand: 'Lemaire',
                    color: 'Natural Sand',
                    fabric: '100% French Flax Linen'
                },
                lastConfirmedLocation: 'Folding Station 02',
                lastScan: 'Today, 14:37',
                scannerStaff: 'Sunita Roy',
                auditLog: [
                    { time: '11:35', station: 'Central Intake', event: 'Scanned in bundle of 12 items' },
                    { time: '12:15', station: 'Optical Sorting Bay A', event: 'Sorted into Linen/Cotton gentle bin' },
                    { time: '13:50', station: 'Acoustic Wash Pod 04', event: 'Washed and transferred to dry cycle' },
                    { time: '14:37', station: 'Folding Station 02', event: 'Item set aside on steam conditioning rack' }
                ],
                resolutionStatus: 'PENDING_INVESTIGATION'
            };

            res.json(auditReport);
        } catch (err) {
            res.status(500).json({ error: 'Failed to run missing garment audit.' });
        }
    }

    async resolveMissingGarment(req, res) {
        try {
            const { action } = req.body; // 'MARK_FOUND', 'REPORT_LOST', 'INVESTIGATE'
            let responseMessage = 'Investigation ticket opened with Folding Station supervisor.';
            if (action === 'MARK_FOUND') {
                responseMessage = 'Item marked found at Steam Conditioning Rack 02. Restored to Order #LV-10493 batch.';
                await orderRepository.updateMissingFlag('LV-10493', 0);
            } else if (action === 'REPORT_LOST') {
                responseMessage = 'Garment loss insurance claim initiated. Concierge compensation triggered.';
            }

            res.json({ success: true, action, message: responseMessage });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update garment discrepancy.' });
        }
    }
}

module.exports = new OrderController();
