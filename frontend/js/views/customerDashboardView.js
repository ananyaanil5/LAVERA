/**
 * Customer Dashboard View - Personalized Wardrobe Hub
 */
const CustomerDashboardView = {
    async render() {
        // Load garments and orders
        let garments = [];
        let orders = [];
        try {
            const gData = await API.getGarments();
            garments = gData.garments || [];
            Store.state.garments = garments;

            const oData = await API.getOrders();
            orders = oData.orders || [];
            Store.state.orders = orders;
        } catch (e) {
            console.warn('Dashboard data fetch fallback:', e);
        }

        const activeOrders = orders.filter(o => o.status !== 'DELIVERED');
        const activeOrderCount = activeOrders.length || 2;
        const totalGarments = garments.length || 27;

        return `
        <div class="customer-dashboard fade-in">
            <!-- Greeting & Subhead -->
            <div class="greeting-header">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="greeting-title">Good morning, Ananya.</h1>
                        <p class="greeting-sub">Your wardrobe, intelligently cared for.</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-secondary" onclick="Store.setView('find-garment')">
                            🔍 FIND MY GARMENT
                        </button>
                        <button class="btn btn-primary" onclick="App.openCreateOrderModal()">
                            + BOOK A SERVICE
                        </button>
                    </div>
                </div>
            </div>

            <!-- Elegant Statistics Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">ACTIVE ORDERS</div>
                    <div class="stat-value">${activeOrderCount}</div>
                    <div class="stat-footnote">Order #LV-10482 at Quality Check</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">GARMENTS</div>
                    <div class="stat-value">${totalGarments}</div>
                    <div class="stat-footnote">100% digital twins registered</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">CARE SCORE</div>
                    <div class="stat-value">94</div>
                    <div class="stat-footnote">Top 4% optimal fabric health</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">ESTIMATED SAVINGS</div>
                    <div class="stat-value">₹1,240</div>
                    <div class="stat-footnote">Longevity extension benefit</div>
                </div>
            </div>

            <!-- Active Order Spotlight (Order #LV-10482) -->
            <div class="card" style="margin-bottom: 3rem; background-color: var(--color-warm-ivory); border-color: var(--color-champagne);">
                <div class="flex justify-between items-center" style="margin-bottom: 1.25rem;">
                    <div>
                        <span class="badge badge-champagne" style="margin-bottom: 0.35rem;">LIVE TRACKING</span>
                        <h3 style="margin-top: 0.25rem;">ORDER #LV-10482</h3>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge badge-success" style="font-weight: 600;">STATUS: QUALITY CHECK</span>
                        <div style="font-size: 0.78rem; color: var(--color-soft-grey); margin-top: 0.35rem;">ESTIMATED TOTAL: ₹399 · 9 GARMENTS</div>
                    </div>
                </div>

                <p style="font-size: 0.88rem; margin-bottom: 1.5rem; color: var(--color-soft-charcoal);">
                    Laser microfiber scan in progress by Sunita Roy. Left cuff tension stabilized with botanical treatment.
                </p>

                <!-- Mini Timeline Preview -->
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                    <div style="padding: 0.65rem; background: #fff; border: 1px solid var(--color-champagne); border-radius: 2px;">
                        <div style="font-size: 0.65rem; color: var(--color-champagne); font-weight: 600;">01 PICKUP</div>
                        <div style="font-size: 0.78rem; color: var(--color-obsidian);">10:05 ✓</div>
                    </div>
                    <div style="padding: 0.65rem; background: #fff; border: 1px solid var(--color-champagne); border-radius: 2px;">
                        <div style="font-size: 0.65rem; color: var(--color-champagne); font-weight: 600;">02 RECEPTION</div>
                        <div style="font-size: 0.78rem; color: var(--color-obsidian);">11:18 ✓</div>
                    </div>
                    <div style="padding: 0.65rem; background: #fff; border: 1px solid var(--color-champagne); border-radius: 2px;">
                        <div style="font-size: 0.65rem; color: var(--color-champagne); font-weight: 600;">03 WASHER 04</div>
                        <div style="font-size: 0.78rem; color: var(--color-obsidian);">12:10 ✓</div>
                    </div>
                    <div style="padding: 0.65rem; background: #fff; border: 2px solid var(--color-obsidian); border-radius: 2px;">
                        <div style="font-size: 0.65rem; color: var(--color-obsidian); font-weight: 700;">04 QUALITY CHECK</div>
                        <div style="font-size: 0.78rem; color: var(--color-obsidian); font-weight: 600;">14:42 ● NOW</div>
                    </div>
                    <div style="padding: 0.65rem; background: var(--color-porcelain); border: 1px solid var(--color-stone); border-radius: 2px; opacity: 0.65;">
                        <div style="font-size: 0.65rem; color: var(--color-soft-grey);">05 DELIVERY</div>
                        <div style="font-size: 0.78rem; color: var(--color-soft-grey);">16:00 ETA</div>
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <span style="font-size: 0.8rem; color: var(--color-soft-grey);">Contains: White Cotton Shirt (LV-GX-82941) + 8 tailored garments</span>
                    <button class="btn btn-secondary btn-sm" onclick="Store.setView('orders', {orderId: 'LV-10482'})">
                        VIEW COMPLETE CHAIN OF CUSTODY →
                    </button>
                </div>
            </div>

            <!-- Wardrobe Showcase Header -->
            <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="eyebrow">DIGITAL WARDROBE</span>
                    <h2>My Curated Garments</h2>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="App.openNewGarmentModal()">+ REGISTER GARMENT</button>
                </div>
            </div>

            <!-- Wardrobe Garments Grid -->
            <div class="garments-grid">
                ${garments.slice(0, 8).map(g => `
                    <div class="garment-card" onclick="Store.setView('garment-dna', {garmentId: '${g.id}'})">
                        <div class="garment-thumb-wrap">
                            <img src="${g.image_url || '/assets/images/white-shirt.jpg'}" alt="${g.name}" class="garment-thumb" />
                            <span class="badge ${g.status === 'IN_ORDER' ? 'badge-champagne' : 'badge-success'}" style="position: absolute; top: 1rem; right: 1rem;">
                                ${g.status === 'IN_ORDER' ? 'IN CARE ATELIER' : 'IN WARDROBE'}
                            </span>
                        </div>
                        <div class="garment-card-body">
                            <div class="garment-id-badge">${g.id}</div>
                            <div class="garment-title">${g.name}</div>
                            <div style="font-size: 0.82rem; color: var(--color-soft-charcoal);">${g.brand} · ${g.fabric}</div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding-top: 0.75rem; border-top: var(--border-light);">
                                <div>
                                    <span style="font-size: 0.65rem; color: var(--color-soft-grey); text-transform: uppercase;">CONDITION</span>
                                    <div style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-obsidian);">${g.condition_score}%</div>
                                </div>
                                <div>
                                    <span style="font-size: 0.65rem; color: var(--color-soft-grey); text-transform: uppercase;">WASHES</span>
                                    <div style="font-size: 0.85rem; font-weight: 500;">${g.wash_cycles} cycles</div>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--color-champagne); font-weight: 600;">DNA →</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="text-align: center; margin-top: 3rem;">
                <p style="font-size: 0.85rem; color: var(--color-soft-grey); margin-bottom: 1rem;">
                    Displaying 8 of ${totalGarments} garments registered to this wardrobe profile.
                </p>
                <button class="btn btn-secondary" onclick="Store.setView('garment-dna', {garmentId: 'LV-GX-82941'})">
                    OPEN COMPREHENSIVE GARMENT DNA VAULT
                </button>
            </div>
        </div>
        `;
    }
};

window.CustomerDashboardView = CustomerDashboardView;
