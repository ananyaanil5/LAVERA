/**
 * LAVÉRA Master Application Controller & Router
 */
const App = {
    async init() {
        console.log('Initializing LAVÉRA Application Engine...');

        // Subscribe to Store updates
        Store.subscribe((state) => {
            this.updateHeaderUI();
            this.renderActiveView();
        });

        // Parse URL parameters for instant deep-linking and demo views
        const urlParams = new URLSearchParams(window.location.search);
        const demoParam = urlParams.get('demo');
        const viewParam = urlParams.get('view');

        if (demoParam === 'admin') {
            await this.demoLogin('admin@lavera.com', 'Admin@123', viewParam);
        } else if (demoParam === 'customer' || viewParam) {
            await this.demoLogin('demo@lavera.com', 'Demo@123', viewParam);
        } else {
            // Check active session
            const token = Store.state.token;
            if (token) {
                try {
                    const data = await API.getMe();
                    if (data && data.user) {
                        Store.setUser(data.user, token);
                        // Default to landing page when opened normally
                        Store.setView(viewParam || 'landing');
                        await Store.fetchNotifications();
                    } else {
                        Store.setView('landing');
                    }
                } catch (e) {
                    console.warn('Session expired. Showing landing page.');
                    Store.setUser(null, '');
                    Store.setView('landing');
                }
            } else {
                Store.setView(viewParam || 'landing');
            }
        }

        // Render demo bar
        this.renderDemoHelperBar();
    },

    updateHeaderUI() {
        const headerEl = document.getElementById('appMainHeader');
        if (!headerEl) return;

        const user = Store.state.currentUser;
        const view = Store.state.activeView;

        if (!user || view === 'landing') {
            headerEl.style.display = 'none';
            return;
        }

        headerEl.style.display = 'block';

        // Check if admin/manager or customer to render correct tabs
        const isStaffOrAdmin = ['ADMIN', 'MANAGER', 'STAFF'].includes(user.role);

        headerEl.innerHTML = `
        <div class="dashboard-header">
            <div class="flex items-center justify-between">
                <a href="#" onclick="Store.setView('landing'); return false;" aria-label="LAVÉRA Home" style="display: flex; align-items: center; text-decoration: none;">
                    <img
                        src="/assets/images/lavera-logo.jpg"
                        alt="LAVÉRA"
                        class="brand-logo-img"
                        draggable="false"
                    />
                </a>

                <div class="flex items-center gap-4">
                    <!-- Hamburger (mobile only) -->
                    <button
                        class="nav-hamburger"
                        id="navHamburger"
                        aria-label="Toggle navigation"
                        aria-expanded="false"
                        onclick="App.toggleMobileNav()"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <!-- Notification Bell & Drawer -->
                    <div class="notif-bell-wrap" onclick="App.toggleNotificationDrawer()">
                        <span style="font-size: 1.25rem;">🔔</span>
                        ${Store.state.unreadCount > 0 ? `<div class="notif-badge">${Store.state.unreadCount}</div>` : ''}

                        <div class="notif-drawer" id="notifDrawer" onclick="event.stopPropagation()">
                            <div class="flex justify-between items-center" style="margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: var(--border-light);">
                                <strong style="font-size: 0.85rem; text-transform: uppercase;">Atelier Notifications</strong>
                                <button class="btn btn-ghost btn-sm" style="padding: 0; font-size: 0.72rem; color: var(--color-champagne);" onclick="App.markAllNotificationsRead()">Mark all read</button>
                            </div>
                            <div style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;" id="notifListContainer">
                                ${Store.state.notifications.map(n => `
                                    <div style="padding: 0.65rem; background: ${n.is_read ? 'var(--color-white)' : 'var(--color-warm-ivory)'}; border: var(--border-light); border-radius: 2px; font-size: 0.78rem;">
                                        <div style="font-weight: 600; color: var(--color-obsidian);">${n.title}</div>
                                        <div style="color: var(--color-soft-charcoal); margin-top: 0.15rem;">${n.message}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- User Profile & Logout -->
                    <div class="flex items-center gap-2">
                        <div style="text-align: right;">
                            <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-obsidian);">${user.name}</div>
                            <div style="font-size: 0.68rem; color: var(--color-champagne); font-weight: 600; text-transform: uppercase;">${user.role}</div>
                        </div>
                        <button class="btn btn-ghost btn-sm" style="color: var(--color-soft-grey);" onclick="App.logout()" title="Sign Out" aria-label="Sign Out">
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <nav class="dashboard-nav-bar" id="dashboardNavBar" role="navigation" aria-label="Main Navigation">
            <ul class="dashboard-tabs">
                <li class="dash-tab ${view === 'dashboard' ? 'active' : ''}" onclick="Store.setView('dashboard'); App.closeMobileNav()">
                    Overview
                </li>
                <li class="dash-tab ${view === 'garment-dna' ? 'active' : ''}" onclick="Store.setView('garment-dna', {garmentId: 'LV-GX-82941'}); App.closeMobileNav()">
                    Garment DNA
                </li>
                <li class="dash-tab ${view === 'orders' ? 'active' : ''}" onclick="Store.setView('orders', {orderId: 'LV-10482'}); App.closeMobileNav()">
                    Orders &amp; Custody
                </li>
                <li class="dash-tab ${view === 'care-lab' ? 'active' : ''}" onclick="Store.setView('care-lab'); App.closeMobileNav()">
                    AI Care Lab
                </li>
                <li class="dash-tab ${view === 'find-garment' ? 'active' : ''}" onclick="Store.setView('find-garment'); App.closeMobileNav()">
                    Find My Garment
                </li>
                <li class="dash-tab ${view === 'ai-manager' ? 'active' : ''}" onclick="Store.setView('ai-manager'); App.closeMobileNav()">
                    AI Operations
                </li>
                ${isStaffOrAdmin ? `
                <li class="dash-tab ${view === 'admin' ? 'active' : ''}" onclick="Store.setView('admin'); App.closeMobileNav()">
                    Command &amp; Machines
                </li>
                ` : ''}
            </ul>
        </nav>
        `;
    },

    async renderActiveView() {
        const viewContainer = document.getElementById('mainContentArea');
        if (!viewContainer) return;

        const view = Store.state.activeView;

        if (view === 'landing') {
            viewContainer.innerHTML = LandingView.render();
            return;
        }

        // Check if user needs to be logged in
        if (!Store.state.currentUser) {
            this.openLoginModal();
            return;
        }

        const renderView = async () => {
            if (view === 'dashboard') {
                return await CustomerDashboardView.render();
            } else if (view === 'garment-dna') {
                return await GarmentDnaView.render();
            } else if (view === 'find-garment') {
                return FindMyGarmentView.render();
            } else if (view === 'care-lab') {
                const html = await VirtualCareLabView.render();
                if (VirtualCareLabView.afterRender) setTimeout(() => VirtualCareLabView.afterRender(), 50);
                return html;
            } else if (view === 'orders') {
                return await OrderManagementView.render();
            } else if (view === 'ai-manager') {
                return AiLaundryManagerView.render();
            } else if (view === 'admin') {
                return await AdminDashboardView.render();
            }
            return '';
        };

        try {
            const html = await renderView();
            viewContainer.innerHTML = html;
        } catch (err) {
            console.error('View render error:', err);
            viewContainer.innerHTML = `
                <div style="padding: 3rem; color: var(--color-alert);">
                    <strong>View render error:</strong> ${err.message}
                    <pre style="margin-top:1rem; font-size:0.75rem; opacity:0.6;">${err.stack}</pre>
                </div>`;
        }
    },

    toggleNotificationDrawer() {
        const drawer = document.getElementById('notifDrawer');
        if (drawer) drawer.classList.toggle('open');
    },

    toggleMobileNav() {
        const nav = document.getElementById('dashboardNavBar');
        const btn = document.getElementById('navHamburger');
        if (!nav) return;
        const isOpen = nav.classList.toggle('open');
        if (btn) {
            btn.classList.toggle('open', isOpen);
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    },

    closeMobileNav() {
        const nav = document.getElementById('dashboardNavBar');
        const btn = document.getElementById('navHamburger');
        if (nav) nav.classList.remove('open');
        if (btn) {
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    },

    async markAllNotificationsRead() {
        try {
            await API.markAllNotificationsRead();
            Store.state.unreadCount = 0;
            Store.state.notifications = Store.state.notifications.map(n => ({ ...n, is_read: 1 }));
            Store.notify();
        } catch (e) {
            console.error('Failed to mark read:', e);
        }
    },

    handleBookServiceClick() {
        if (!Store.state.currentUser) {
            this.openLoginModal();
        } else {
            this.openCreateOrderModal();
        }
    },

    openLoginModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('active');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    async handleLoginSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errEl = document.getElementById('loginError');

        try {
            const data = await API.login(email, password);
            Store.setUser(data.user, data.token);
            this.closeModal('authModal');
            Store.setView('dashboard');
            await Store.fetchNotifications();
        } catch (err) {
            if (errEl) errEl.innerText = err.message || 'Invalid credentials.';
        }
    },

    async demoLogin(email, password, targetView = null) {
        try {
            const data = await API.login(email, password);
            Store.setUser(data.user, data.token);
            this.closeModal('authModal');
            if (targetView) {
                Store.setView(targetView);
            } else if (['ADMIN', 'MANAGER'].includes(data.user.role)) {
                Store.setView('ai-manager');
            } else {
                Store.setView('dashboard');
            }
            await Store.fetchNotifications();
        } catch (e) {
            console.error('Demo login failed:', e);
        }
    },

    logout() {
        Store.setUser(null, '');
        Store.setView('landing');
    },

    // Floating Demo Helper Bar
    renderDemoHelperBar() {
        const existing = document.getElementById('demoHelperBar');
        if (existing) return;

        const bar = document.createElement('div');
        bar.id = 'demoHelperBar';
        bar.className = 'demo-helper-bar';
        bar.innerHTML = `
            <span style="font-weight: 700; color: var(--color-champagne); letter-spacing: 0.08em;">✦ DEMO HELPER</span>
            <button onclick="App.demoLogin('demo@lavera.com', 'Demo@123')">Customer: Ananya</button>
            <button onclick="App.demoLogin('admin@lavera.com', 'Admin@123')">Admin: Alain</button>
            <button onclick="App.demoLogin('manager@lavera.com', 'Admin@123')">Manager: Claire</button>
            <button onclick="Store.setView('landing')">Landing Page</button>
        `;
        document.body.appendChild(bar);
    },

    // Order Creation Modal
    openCreateOrderModal() {
        const modal = document.getElementById('createOrderModal');
        if (!modal) return;

        const garments = Store.state.garments || [];
        const container = document.getElementById('orderGarmentsSelector');
        if (container) {
            container.innerHTML = garments.slice(0, 8).map(g => `
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; background: var(--color-warm-ivory); border: var(--border-light); border-radius: 2px; cursor: pointer;">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" name="orderGarment" value="${g.id}" checked onchange="App.recalculateOrderPrice()" />
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 600;">${g.name}</div>
                            <div style="font-size: 0.72rem; color: var(--color-soft-grey);">${g.brand} · ${g.fabric}</div>
                        </div>
                    </div>
                    <span style="font-family: monospace; font-size: 0.75rem; color: var(--color-soft-grey);">${g.id}</span>
                </label>
            `).join('');
        }

        this.recalculateOrderPrice();
        modal.classList.add('active');
    },

    recalculateOrderPrice() {
        const checkboxes = document.querySelectorAll('input[name="orderGarment"]:checked');
        const count = checkboxes.length;
        const serviceSelect = document.getElementById('orderServiceType');
        const service = serviceSelect ? serviceSelect.value : 'Premium Garment Care';
        const pricePerItem = service.includes('Dry') ? 85 : service.includes('Premium') ? 65 : 45;
        const total = count * pricePerItem;

        const countEl = document.getElementById('orderSelectedCount');
        const priceEl = document.getElementById('orderEstimatedTotal');
        if (countEl) countEl.innerText = `${count} Garments`;
        if (priceEl) priceEl.innerText = `₹${total}`;
    },

    async handleOrderSubmit(e) {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('input[name="orderGarment"]:checked');
        const garmentIds = Array.from(checkboxes).map(cb => cb.value);

        if (garmentIds.length === 0) {
            alert('Please select at least one garment.');
            return;
        }

        const serviceType = document.getElementById('orderServiceType').value;
        const pickupDate = document.getElementById('orderPickupDate').value;
        const timeSlot = document.getElementById('orderTimeSlot').value;
        const instructions = document.getElementById('orderInstructions').value;

        try {
            const data = await API.createOrder({
                serviceType,
                garmentIds,
                pickupDate,
                timeSlot,
                instructions
            });

            this.closeModal('createOrderModal');
            alert(`Order #${data.order.id} confirmed! Opening Chain of Custody...`);
            Store.setView('orders', { orderId: data.order.id });
        } catch (err) {
            alert('Order creation failed: ' + err.message);
        }
    },

    // Register New Garment Modal
    openNewGarmentModal() {
        const modal = document.getElementById('newGarmentModal');
        if (modal) modal.classList.add('active');
    },

    async handleNewGarmentSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('newGarmentName').value;
        const brand = document.getElementById('newGarmentBrand').value;
        const fabric = document.getElementById('newGarmentFabric').value;
        const color = document.getElementById('newGarmentColor').value;
        const size = document.getElementById('newGarmentSize').value;
        const fileInput = document.getElementById('newGarmentImage');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('fabric', fabric);
            formData.append('color', color);
            formData.append('size', size);
            if (fileInput && fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            const data = await API.createGarment(formData);
            this.closeModal('newGarmentModal');
            alert(`Garment DNA initialized: ${data.garment.id}`);
            Store.setView('garment-dna', { garmentId: data.garment.id });
        } catch (err) {
            alert('Failed to register garment: ' + err.message);
        }
    },

    // Upload Damage Inspection Modal
    openInspectionModal(garmentId) {
        const modal = document.getElementById('inspectionModal');
        if (modal) {
            document.getElementById('inspectionGarmentId').value = garmentId || 'LV-GX-82941';
            modal.classList.add('active');
        }
    },

    async handleInspectionSubmit(e) {
        e.preventDefault();
        const garmentId = document.getElementById('inspectionGarmentId').value;
        const fileInput = document.getElementById('inspectionFileInput');

        try {
            const formData = new FormData();
            formData.append('garmentId', garmentId);
            if (fileInput && fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            const data = await API.inspectGarment(formData);
            this.closeModal('inspectionModal');
            alert(`Inspection recorded: ${data.analysis.detectedCondition} (${data.analysis.confidencePercentage} confidence)`);
            Store.setView('garment-dna', { garmentId: garmentId });
        } catch (err) {
            alert('Inspection upload failed: ' + err.message);
        }
    }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
