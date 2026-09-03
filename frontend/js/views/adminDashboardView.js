/**
 * Admin / Operations Dashboard View
 * Includes Machine Hub, Smart Inventory, Missing Garment Intelligence, and AI Demand Forecast
 */
const AdminDashboardView = {
    activeSubTab: 'overview', // 'overview', 'machines', 'inventory', 'missing', 'forecast'

    async render() {
        let metrics = {
            ordersToday: 126,
            totalRevenue: '₹1,48,200',
            activeGarments: 32,
            machineUtilization: '68%',
            deliveryPerformance: '98.4%',
            customerSatisfaction: '4.95 / 5.0'
        };
        let machines = [];
        let inventory = [];
        let missingAudit = null;
        let forecast = null;

        try {
            metrics = await API.getMetrics();
            const mData = await API.getMachines();
            machines = mData.machines || [];
            const iData = await API.getInventory();
            inventory = iData.inventory || [];
            missingAudit = await API.getMissingGarments();
            forecast = await API.getForecast(7);
        } catch (e) {
            console.warn('Admin view data fallback:', e);
        }

        return `
        <div class="admin-dashboard fade-in">
            <!-- Header -->
            <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
                <div>
                    <span class="eyebrow">COMMAND & ATELIER OPERATIONS</span>
                    <h1 style="font-size: 2.5rem; margin-bottom: 0.25rem;">Operations Command Center</h1>
                    <p style="font-size: 0.9rem; color: var(--color-soft-grey);">
                        Real-time telemetry across machines, staff routing, inventory, and demand intake.
                    </p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="Store.setView('ai-manager')">
                        ✦ OPEN AI LAUNDRY MANAGER
                    </button>
                    <button class="btn btn-outline-champagne btn-sm" onclick="Store.setView('dashboard')">
                        VIEW CUSTOMER PORTAL
                    </button>
                </div>
            </div>

            <!-- Operations Metrics Cards -->
            <div class="stats-grid" style="grid-template-columns: repeat(6, 1fr); margin-bottom: 2.5rem;">
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">ORDERS TODAY</div>
                    <div class="stat-value" style="font-size: 2rem;">${metrics.ordersToday}</div>
                    <div class="stat-footnote">+14% vs yesterday</div>
                </div>
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">REVENUE</div>
                    <div class="stat-value" style="font-size: 2rem; color: var(--color-champagne);">${metrics.totalRevenue}</div>
                    <div class="stat-footnote">Bespoke care surge</div>
                </div>
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">ACTIVE GARMENTS</div>
                    <div class="stat-value" style="font-size: 2rem;">${metrics.activeGarments}</div>
                    <div class="stat-footnote">In facility processing</div>
                </div>
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">UTILIZATION</div>
                    <div class="stat-value" style="font-size: 2rem;">${metrics.machineUtilization}</div>
                    <div class="stat-footnote">Fleet average load</div>
                </div>
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">DELIVERY PERF</div>
                    <div class="stat-value" style="font-size: 2rem;">${metrics.deliveryPerformance}</div>
                    <div class="stat-footnote">On-time concierge drop</div>
                </div>
                <div class="stat-card" style="padding: 1.25rem;">
                    <div class="stat-label">CLIENT RATING</div>
                    <div class="stat-value" style="font-size: 2rem;">${metrics.customerSatisfaction.split(' ')[0]}</div>
                    <div class="stat-footnote">Top quartile index</div>
                </div>
            </div>

            <!-- Sub Navigation Tabs -->
            <div style="display: flex; gap: 1.5rem; border-bottom: var(--border-hairline); margin-bottom: 2.5rem;">
                <button class="dash-tab ${this.activeSubTab === 'overview' ? 'active' : ''}" onclick="AdminDashboardView.switchSubTab('overview')">
                    OVERVIEW & MACHINES
                </button>
                <button class="dash-tab ${this.activeSubTab === 'inventory' ? 'active' : ''}" onclick="AdminDashboardView.switchSubTab('inventory')">
                    SMART INVENTORY
                </button>
                <button class="dash-tab ${this.activeSubTab === 'missing' ? 'active' : ''}" onclick="AdminDashboardView.switchSubTab('missing')">
                    MISSING GARMENT AUDIT
                </button>
                <button class="dash-tab ${this.activeSubTab === 'forecast' ? 'active' : ''}" onclick="AdminDashboardView.switchSubTab('forecast')">
                    AI DEMAND FORECAST
                </button>
            </div>

            <!-- TAB 1: Machines & Fleet Management -->
            <div id="subTabContent">
                ${this.renderSubTabContent(machines, inventory, missingAudit, forecast)}
            </div>
        </div>
        `;
    },

    switchSubTab(tab) {
        this.activeSubTab = tab;
        const main = document.getElementById('mainContentArea');
        if (main) App.renderActiveView();
    },

    renderSubTabContent(machines, inventory, missingAudit, forecast) {
        if (this.activeSubTab === 'inventory') {
            return this.renderInventorySection(inventory);
        } else if (this.activeSubTab === 'missing') {
            return this.renderMissingGarmentSection(missingAudit);
        } else if (this.activeSubTab === 'forecast') {
            return this.renderForecastSection(forecast);
        }
        return this.renderOverviewAndMachines(machines);
    },

    renderOverviewAndMachines(machines) {
        return `
        <div class="fade-in">
            <!-- Machine Fleet (Feature #20) -->
            <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="eyebrow" style="margin: 0;">FEATURE #20 · FLEET TELEMETRY</span>
                    <h2 style="font-size: 1.8rem; margin-top: 0.25rem;">Machine Management Hub</h2>
                </div>
                <div class="flex gap-2">
                    <span class="badge badge-success">4 WASHERS OPERATIONAL</span>
                    <span class="badge badge-success">2 CONVECTIVE DRYERS</span>
                </div>
            </div>

            <div class="machines-grid">
                ${machines.map(m => {
                    const isOverloaded = m.status === 'OVERLOADED';
                    const isRunning = m.status === 'RUNNING';
                    const isAvailable = m.status === 'AVAILABLE';

                    return `
                    <div class="machine-card ${isOverloaded ? 'overloaded' : ''}">
                        <div class="flex justify-between items-center" style="margin-bottom: 0.5rem;">
                            <div style="font-family: monospace; font-size: 0.72rem; color: var(--color-soft-grey);">${m.id}</div>
                            <span class="badge ${isOverloaded ? 'badge-alert' : isRunning ? 'badge-champagne' : 'badge-success'}">
                                ${m.status}
                            </span>
                        </div>

                        <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-obsidian); margin-bottom: 0.25rem;">
                            ${m.name}
                        </div>
                        <div style="font-size: 0.78rem; color: var(--color-soft-charcoal); margin-bottom: 0.75rem;">
                            Program: <strong>${m.cycle_name || 'Idle'}</strong> · Temp: <strong>${m.temperature || 'Ambient'}</strong>
                        </div>

                        <div class="flex justify-between items-center" style="font-size: 0.72rem; color: var(--color-soft-grey);">
                            <span>CAPACITY LOAD</span>
                            <span style="font-weight: 600; color: ${isOverloaded ? 'var(--color-alert)' : 'var(--color-obsidian)'};">${m.capacity_pct}%</span>
                        </div>
                        <div class="capacity-track">
                            <div class="capacity-fill ${m.capacity_pct > 80 ? 'high' : ''}" style="width: ${m.capacity_pct}%;"></div>
                        </div>

                        <div class="flex justify-between items-center" style="margin-top: 1rem; font-size: 0.75rem; color: var(--color-soft-grey); border-top: var(--border-light); padding-top: 0.75rem;">
                            <span>Batch: ${m.current_order_id ? '#' + m.current_order_id : 'Queue Empty'}</span>
                            <span>ETA: ${m.estimated_completion}</span>
                        </div>

                        <div style="margin-top: 1rem;">
                            <select class="form-select" style="font-size: 0.72rem; padding: 0.4rem 0.6rem;" onchange="AdminDashboardView.updateMachineStatus('${m.id}', this.value)">
                                <option value="AVAILABLE" ${m.status === 'AVAILABLE' ? 'selected' : ''}>Set Available</option>
                                <option value="RUNNING" ${m.status === 'RUNNING' ? 'selected' : ''}>Set Running</option>
                                <option value="OVERLOADED" ${m.status === 'OVERLOADED' ? 'selected' : ''}>Flag Overloaded</option>
                                <option value="MAINTENANCE" ${m.status === 'MAINTENANCE' ? 'selected' : ''}>Set Maintenance</option>
                            </select>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    },

    renderInventorySection(inventory) {
        return `
        <div class="fade-in">
            <!-- Smart Inventory (Feature #17) -->
            <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="eyebrow" style="margin: 0;">FEATURE #17 · SUPPLY CHAIN AUTOMATION</span>
                    <h2 style="font-size: 1.8rem; margin-top: 0.25rem;">Smart Chemical & Packaging Inventory</h2>
                </div>
                <button class="btn btn-primary btn-sm" onclick="alert('Procurement PO triggered for low-stock consumables.')">
                    TRIGGER ATELIER REORDER
                </button>
            </div>

            <!-- Alert Banner for Delicate Detergent as specified in prompt -->
            <div style="padding: 1.25rem 1.5rem; background-color: var(--color-warning-bg); border-left: 3px solid var(--color-warning); border-radius: var(--radius-xs); margin-bottom: 2rem;">
                <div class="flex justify-between items-center">
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-warning); font-weight: 700; text-transform: uppercase;">
                            REORDER WARNING · DELICATE DETERGENT
                        </div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: var(--color-obsidian); margin-top: 0.2rem;">
                            Current Stock: 18 L · Projected Daily Usage: 4.2 L/day · Estimated Remaining: 4 Days
                        </div>
                    </div>
                    <span class="badge badge-warning" style="font-weight: 700;">REORDER SOON</span>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="table-editorial">
                    <thead>
                        <tr>
                            <th>ITEM NAME</th>
                            <th>CURRENT STOCK</th>
                            <th>PROJECTED USAGE</th>
                            <th>DAYS REMAINING</th>
                            <th>REORDER LEVEL</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventory.map(item => `
                            <tr>
                                <td style="font-weight: 600;">${item.item_name}</td>
                                <td style="font-family: monospace; font-size: 0.95rem;">${item.current_stock} ${item.unit}</td>
                                <td>${item.projected_usage_per_day} ${item.unit}/day</td>
                                <td style="font-weight: 600; color: ${item.days_remaining <= 4 ? 'var(--color-alert)' : 'var(--color-obsidian)'};">${item.days_remaining} days</td>
                                <td>${item.reorder_level} ${item.unit}</td>
                                <td>
                                    <span class="badge ${item.status === 'REORDER_SOON' ? 'badge-warning' : 'badge-success'}">
                                        ${item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" style="padding: 0.35rem 0.75rem; font-size: 0.68rem;" onclick="AdminDashboardView.promptStockUpdate('${item.id}', ${item.current_stock})">
                                        UPDATE STOCK
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    },

    renderMissingGarmentSection(audit) {
        if (!audit) return `<div>Loading audit...</div>`;
        return `
        <div class="fade-in">
            <!-- Missing Garment Intelligence (Feature #18) -->
            <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="eyebrow" style="margin: 0;">FEATURE #18 · CUSTODY RECONCILIATION</span>
                    <h2 style="font-size: 1.8rem; margin-top: 0.25rem;">Missing Garment Intelligence</h2>
                </div>
                <span class="badge badge-alert">1 SYSTEM ALERT</span>
            </div>

            <!-- Reconciliation Card -->
            <div class="card" style="margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: var(--border-light);">
                    <div style="background: var(--color-warm-ivory); padding: 1rem; border-radius: 2px;">
                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">EXPECTED GARMENTS</div>
                        <div style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-obsidian);">${audit.expectedGarments}</div>
                    </div>
                    <div style="background: var(--color-warm-ivory); padding: 1rem; border-radius: 2px;">
                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">RECEIVED INTAKE</div>
                        <div style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-obsidian);">${audit.receivedGarments}</div>
                    </div>
                    <div style="background: var(--color-warm-ivory); padding: 1rem; border-radius: 2px;">
                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">PROCESSED</div>
                        <div style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-alert);">${audit.processedGarments}</div>
                    </div>
                    <div style="background: var(--color-warm-ivory); padding: 1rem; border-radius: 2px;">
                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">DELIVERED</div>
                        <div style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-alert);">${audit.deliveredGarments}</div>
                    </div>
                </div>

                <!-- Alert Box -->
                <div style="padding: 1.5rem; background-color: var(--color-alert-bg); border-left: 3px solid var(--color-alert); border-radius: 2px; margin-bottom: 2rem;">
                    <div class="flex justify-between items-center">
                        <div>
                            <div style="font-size: 0.72rem; color: var(--color-alert); font-weight: 700; text-transform: uppercase;">
                                SYSTEM ALERT
                            </div>
                            <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-obsidian); margin: 0.25rem 0;">
                                "${audit.systemAlert}"
                            </div>
                            <div style="font-size: 0.85rem; color: var(--color-soft-charcoal);">
                                Garment: <strong>${audit.unaccountedGarment.name}</strong> (${audit.unaccountedGarment.brand} · ${audit.unaccountedGarment.fabric}) · Order #${audit.orderId}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">LAST CONFIRMED LOCATION</div>
                            <div style="font-size: 1.1rem; font-weight: 600; color: var(--color-obsidian);">${audit.lastConfirmedLocation}</div>
                            <div style="font-size: 0.78rem; color: var(--color-champagne);">LAST SCAN: ${audit.lastScan}</div>
                        </div>
                    </div>

                    <!-- Staff Action Buttons -->
                    <div class="flex gap-2" style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(156, 75, 61, 0.2);">
                        <button class="btn btn-primary btn-sm" onclick="AdminDashboardView.handleMissingAction('MARK_FOUND')">
                            MARK FOUND
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="AdminDashboardView.handleMissingAction('INVESTIGATE')">
                            INVESTIGATE
                        </button>
                        <button class="btn btn-secondary btn-sm" style="color: var(--color-alert);" onclick="AdminDashboardView.handleMissingAction('REPORT_LOST')">
                            REPORT LOST
                        </button>
                    </div>
                </div>

                <!-- Audit Log -->
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-soft-grey); letter-spacing: 0.1em; margin-bottom: 0.75rem;">
                    TOUCHPOINT AUDIT LOG:
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${audit.auditLog.map(al => `
                        <div style="display: flex; justify-content: space-between; padding: 0.65rem 1rem; background: var(--color-warm-ivory); border: var(--border-light); font-size: 0.82rem;">
                            <span><strong>${al.station}:</strong> ${al.event}</span>
                            <span style="font-family: monospace; color: var(--color-champagne);">${al.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    },

    renderForecastSection(forecast) {
        if (!forecast) return `<div>Loading forecast...</div>`;
        return `
        <div class="fade-in">
            <!-- AI Demand Forecast (Feature #16) -->
            <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="eyebrow" style="margin: 0;">FEATURE #16 · PREDICTIVE SCHEDULING</span>
                    <h2 style="font-size: 1.8rem; margin-top: 0.25rem;">AI Demand Forecast</h2>
                </div>
                <div class="flex items-center gap-2">
                    <span style="font-size: 0.75rem; color: var(--color-soft-grey); text-transform: uppercase;">Horizon:</span>
                    <button class="btn btn-secondary btn-sm" style="${forecast.forecastHorizonDays === 7 ? 'border-color: var(--color-champagne); font-weight: 600;' : ''}" onclick="AdminDashboardView.changeForecastHorizon(7)">7 Days</button>
                    <button class="btn btn-secondary btn-sm" style="${forecast.forecastHorizonDays === 14 ? 'border-color: var(--color-champagne); font-weight: 600;' : ''}" onclick="AdminDashboardView.changeForecastHorizon(14)">14 Days</button>
                    <button class="btn btn-secondary btn-sm" style="${forecast.forecastHorizonDays === 30 ? 'border-color: var(--color-champagne); font-weight: 600;' : ''}" onclick="AdminDashboardView.changeForecastHorizon(30)">30 Days</button>
                </div>
            </div>

            <!-- Top Numbers Row -->
            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 2rem;">
                <div class="stat-card">
                    <div class="stat-label">TODAY'S ACTUAL</div>
                    <div class="stat-value">${forecast.todayActual} orders</div>
                    <div class="stat-footnote">Active capacity: 78%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">TOMORROW PREDICTED</div>
                    <div class="stat-value" style="color: var(--color-champagne);">${forecast.tomorrowPredicted} predicted</div>
                    <div class="stat-footnote">+17.5% volume anticipated</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">NEXT 7 DAYS GROWTH</div>
                    <div class="stat-value">${forecast.sevenDayGrowthRate}</div>
                    <div class="stat-footnote">Weekend evening events</div>
                </div>
            </div>

            <!-- Clean Bar Chart Visualization (Minimal, No Rainbow) -->
            <div class="card" style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.3rem; margin-bottom: 1.5rem;">Volume Projection Horizon (${forecast.forecastHorizonDays} Days)</h3>
                
                <div style="display: flex; align-items: flex-end; gap: 1.25rem; height: 260px; padding: 1rem 0; border-bottom: var(--border-light); overflow-x: auto;">
                    ${forecast.forecast.map(f => {
                        const heightPct = Math.min(100, Math.round((f.predicted / 180) * 100));
                        return `
                        <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 65px;">
                            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-obsidian);">${f.predicted}</div>
                            <div style="width: 38px; height: ${heightPct}%; background-color: var(--color-champagne); border-radius: 2px 2px 0 0; transition: height 0.6s ease;"></div>
                            <div style="font-size: 0.72rem; color: var(--color-soft-grey); margin-top: 0.75rem; white-space: nowrap;">${f.date}</div>
                        </div>
                        `;
                    }).join('')}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; font-size: 0.8rem; color: var(--color-soft-grey);">
                    <div>✦ Atelier daily threshold capacity: 175 orders/day</div>
                    <div style="color: var(--color-soft-charcoal);">Insight: <em>"${forecast.insight}"</em></div>
                </div>
            </div>
        </div>
        `;
    },

    async updateMachineStatus(id, status) {
        try {
            await API.updateMachine(id, { status });
            alert(`Machine ${id} status updated to ${status}.`);
            App.renderActiveView();
        } catch (e) {
            alert('Failed to update machine: ' + e.message);
        }
    },

    async promptStockUpdate(id, current) {
        const val = prompt('Enter new stock level (L / pcs):', current);
        if (val !== null && !isNaN(val)) {
            try {
                await API.updateInventoryStock(id, Number(val));
                alert('Stock level successfully updated.');
                App.renderActiveView();
            } catch (e) {
                alert('Error updating stock: ' + e.message);
            }
        }
    },

    async handleMissingAction(action) {
        try {
            const res = await API.resolveMissingGarment(action);
            alert(`Action Recorded: ${res.message}`);
            App.renderActiveView();
        } catch (e) {
            alert('Error updating missing garment: ' + e.message);
        }
    },

    async changeForecastHorizon(days) {
        try {
            const f = await API.getForecast(days);
            const content = document.getElementById('subTabContent');
            if (content) content.innerHTML = this.renderForecastSection(f);
        } catch (e) {
            console.error('Forecast horizon error:', e);
        }
    }
};

window.AdminDashboardView = AdminDashboardView;
