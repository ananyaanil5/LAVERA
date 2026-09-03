/**
 * Order Management & Complete Chain of Custody Timeline
 */
const OrderManagementView = {
    async render() {
        const orderId = Store.state.selectedOrderId || 'LV-10482';
        let order = null;

        try {
            const data = await API.getOrder(orderId);
            order = data.order;
        } catch (e) {
            console.warn('Fallback loading order:', e);
        }

        if (!order) {
            order = {
                id: 'LV-10482',
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
                items: [
                    { garment_name: 'White Cotton Shirt', garment_brand: 'Aurélia Sartoriale', price: 65 },
                    { garment_name: 'Ivory Silk Blouse', garment_brand: 'Céline Atelier', price: 75 },
                    { garment_name: 'Structured Wool Blazer', garment_brand: 'Brunello Cucinelli', price: 80 },
                    { garment_name: 'Pleated Linen Trousers', garment_brand: 'Lemaire', price: 45 },
                    { garment_name: 'Supima Cotton Poplin', garment_brand: 'The Row', price: 30 },
                    { garment_name: 'Fine Knit Cardigan', garment_brand: 'Totême', price: 30 },
                    { garment_name: 'Silk Crepe Scarf', garment_brand: 'Hermès', price: 35 },
                    { garment_name: 'Poplin Evening Shirt', garment_brand: 'Charvet', price: 20 },
                    { garment_name: 'Tailored Waistcoat', garment_brand: 'Loro Piana', price: 19 }
                ],
                timeline: [
                    { stage: 'CUSTOMER', timestamp: '09:12', location: 'Worli Client Residence', staff_name: 'Ananya Sharma', status: 'COMPLETED', notes: 'Digital booking confirmed & garments sealed in concierge pouch.', sequence: 1 },
                    { stage: 'PICKUP', timestamp: '10:05', location: 'Worli Gate Concierge', staff_name: 'Kabir Mehta', status: 'COMPLETED', notes: 'Scanned contactless RFID and loaded into temperature-controlled van.', sequence: 2 },
                    { stage: 'RECEPTION', timestamp: '11:18', location: 'Atelier Central Intake', staff_name: 'Elena Rostova', status: 'COMPLETED', notes: 'Digital twin barcode verification. Garment DNA health verified.', sequence: 3 },
                    { stage: 'SORTING', timestamp: '11:41', location: 'Optic Fiber Sorting Bay A', staff_name: 'Elena Rostova', status: 'COMPLETED', notes: 'Categorized: delicate cottons & silks separated for cold bath.', sequence: 4 },
                    { stage: 'WASHER 04', timestamp: '12:10', location: 'Acoustic Wash Pod 04', staff_name: 'Marcus Vance', status: 'COMPLETED', notes: 'Delicate botanical wash program at 24°C with filtered rainwater.', sequence: 5 },
                    { stage: 'DRYER 02', timestamp: '13:02', location: 'Convective Gentle Tumble 02', staff_name: 'Marcus Vance', status: 'COMPLETED', notes: 'Reverse-drum micro-air drying at gentle 38°C.', sequence: 6 },
                    { stage: 'FOLDING', timestamp: '14:20', location: 'Finishing Table 02', staff_name: 'Sunita Roy', status: 'COMPLETED', notes: 'Hand-steamed with purified deionized steam and cedar-pressed.', sequence: 7 },
                    { stage: 'QUALITY CHECK', timestamp: '14:42', location: 'Quality Check Station', staff_name: 'Sunita Roy', status: 'CURRENT', notes: 'Laser microfiber & seam integrity scan. Left cuff abrasion stabilized.', sequence: 8 },
                    { stage: 'READY', timestamp: '15:10', location: 'Bespoke Dispatch Vault', staff_name: 'Dev Patel', status: 'PENDING', notes: 'Breathable linen wrap and custom monogram tag attached.', sequence: 9 },
                    { stage: 'OUT FOR DELIVERY', timestamp: '16:00', location: 'Concierge Electric Fleet', staff_name: 'Kabir Mehta', status: 'PENDING', notes: 'Scheduled for private courier return.', sequence: 10 }
                ]
            };
        }

        const items = order.items || [];
        const timeline = order.timeline || [];

        return `
        <div class="order-management-view fade-in">
            <!-- Header -->
            <div class="flex justify-between items-center" style="margin-bottom: 2.5rem;">
                <div>
                    <span class="eyebrow">CHAIN OF CUSTODY</span>
                    <h1>ORDER #${order.id}</h1>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="App.openCreateOrderModal()">
                        + CREATE NEW ORDER
                    </button>
                    <button class="btn btn-outline-champagne btn-sm" onclick="Store.setView('dashboard')">
                        ← BACK TO DASHBOARD
                    </button>
                </div>
            </div>

            <!-- Order Summary Banner -->
            <div class="card card-warm" style="margin-bottom: 2.5rem; border-color: var(--color-champagne);">
                <div class="flex justify-between items-center" style="flex-wrap: wrap; gap: 1.5rem;">
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">SERVICE TYPE</div>
                        <div style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-obsidian);">${order.service_type}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">CURRENT STATUS</div>
                        <span class="badge badge-success" style="font-size: 0.85rem; font-weight: 600; padding: 0.35rem 0.85rem;">
                            ${order.status}
                        </span>
                    </div>
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">GARMENTS IN CARE</div>
                        <div style="font-family: var(--font-serif); font-size: 1.5rem;">${items.length} GARMENTS</div>
                    </div>
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">ESTIMATED TOTAL</div>
                        <div style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-champagne); font-weight: 600;">₹${order.total_price}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">ESTIMATED COMPLETION</div>
                        <div style="font-size: 0.95rem; font-weight: 500;">${order.estimated_completion}</div>
                    </div>
                </div>
            </div>

            <!-- Two Column Layout: Custody Timeline on Left, Sustainability & Items on Right -->
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: start;">
                <!-- Left: Complete 10-Step Chain of Custody Timeline -->
                <div class="card">
                    <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                        <div>
                            <span class="eyebrow" style="margin: 0;">VERIFIED AUDIT LOG</span>
                            <h2 style="font-size: 1.8rem; margin-top: 0.25rem;">Garment Movement Timeline</h2>
                        </div>
                        <span class="badge badge-champagne">10 TOUCHPOINTS</span>
                    </div>

                    <p style="font-size: 0.85rem; color: var(--color-soft-grey); margin-bottom: 2rem;">
                        Every stage is recorded with physical location, processing timestamp, and verified atelier staff signatures.
                    </p>

                    <div class="timeline">
                        ${timeline.map(t => {
                            const isDone = t.status === 'COMPLETED';
                            const isCurrent = t.status === 'CURRENT';
                            return `
                            <div class="timeline-step ${isDone ? 'completed' : isCurrent ? 'current' : ''}">
                                <div class="timeline-node">
                                    ${isDone ? '✓' : isCurrent ? '●' : t.sequence}
                                </div>
                                <div class="timeline-body">
                                    <div class="flex justify-between items-center" style="margin-bottom: 0.25rem;">
                                        <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-obsidian); letter-spacing: 0.05em;">
                                            ${t.stage}
                                        </div>
                                        <div style="font-size: 0.78rem; font-family: monospace; font-weight: 600; color: ${isCurrent ? 'var(--color-obsidian)' : 'var(--color-champagne)'};">
                                            ${t.timestamp}
                                        </div>
                                    </div>
                                    <div style="font-size: 0.78rem; color: var(--color-soft-charcoal); margin-bottom: 0.35rem;">
                                        <strong>Location:</strong> ${t.location} · <strong>Handler:</strong> ${t.staff_name}
                                    </div>
                                    <div style="font-size: 0.78rem; color: var(--color-soft-grey);">
                                        ${t.notes || 'Stage protocol executed.'}
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Right: Garment Items in this order & Carbon Passport -->
                <div>
                    <!-- Sustainability / Carbon Passport (Feature #15) -->
                    <div class="card" style="margin-bottom: 2rem; background: var(--color-warm-ivory);">
                        <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
                            <span class="eyebrow" style="margin: 0;">FEATURE #15</span>
                            <span class="badge badge-success">ECO SCORE: ${order.eco_score} / 100</span>
                        </div>
                        <h3 style="margin-bottom: 0.75rem;">LAVÉRA ECO PROFILE</h3>
                        <p style="font-size: 0.82rem; color: var(--color-soft-grey); margin-bottom: 1.5rem;">
                            Environmental footprint calculated for Order #${order.id}.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 1.25rem;">
                            <div style="background: #fff; padding: 1rem 0.5rem; border: var(--border-light); border-radius: 2px;">
                                <div style="font-size: 0.65rem; color: var(--color-soft-grey); text-transform: uppercase;">WATER</div>
                                <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-obsidian);">${order.water_liters} L</div>
                            </div>
                            <div style="background: #fff; padding: 1rem 0.5rem; border: var(--border-light); border-radius: 2px;">
                                <div style="font-size: 0.65rem; color: var(--color-soft-grey); text-transform: uppercase;">ENERGY</div>
                                <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-obsidian);">${order.energy_kwh} kWh</div>
                            </div>
                            <div style="background: #fff; padding: 1rem 0.5rem; border: var(--border-light); border-radius: 2px;">
                                <div style="font-size: 0.65rem; color: var(--color-soft-grey); text-transform: uppercase;">CO₂ IMPACT</div>
                                <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-obsidian);">${order.co2_kg} kg</div>
                            </div>
                        </div>

                        <div style="font-size: 0.76rem; color: var(--color-success); font-weight: 500;">
                            ✓ 100% cold-filtered rainwater & botanical saponins applied.
                        </div>
                    </div>

                    <!-- Items List -->
                    <div class="card">
                        <h3 style="margin-bottom: 1.25rem;">Garments in Order (${items.length})</h3>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${items.map((it, idx) => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: var(--border-light);">
                                    <div>
                                        <div style="font-size: 0.88rem; font-weight: 600; color: var(--color-obsidian);">${it.garment_name}</div>
                                        <div style="font-size: 0.75rem; color: var(--color-soft-grey);">${it.garment_brand || 'Haute Couture'}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600;">₹${it.price}</div>
                                        <span class="badge badge-champagne" style="font-size: 0.65rem;">SCAN COMPLETE</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
};

window.OrderManagementView = OrderManagementView;
