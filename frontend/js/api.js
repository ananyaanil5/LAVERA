/**
 * LAVÉRA REST API Client
 */
const API = {
    baseUrl: '/api',

    getToken() {
        return localStorage.getItem('lavera_token') || '';
    },

    setToken(token) {
        if (token) localStorage.setItem('lavera_token', token);
        else localStorage.removeItem('lavera_token');
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = options.headers || {};

        const token = this.getToken();
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            ...options,
            headers
        };

        try {
            const res = await fetch(url, config);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || `HTTP error ${res.status}`);
            }
            return data;
        } catch (err) {
            console.error(`API Error on ${endpoint}:`, err);
            throw err;
        }
    },

    // Auth
    login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    getMe() {
        return this.request('/auth/me');
    },

    getDemoAccounts() {
        return this.request('/auth/demo-accounts');
    },

    // Garments
    getGarments() {
        return this.request('/garments');
    },

    getGarment(id) {
        return this.request(`/garments/${id}`);
    },

    calculateAging(id, waterTemp, cycleType) {
        return this.request(`/garments/${id}/aging`, {
            method: 'POST',
            body: JSON.stringify({ waterTemp, cycleType })
        });
    },

    inspectGarment(formData) {
        return this.request('/garments/inspect', {
            method: 'POST',
            body: formData
        });
    },

    matchGarment(formData) {
        return this.request('/garments/match', {
            method: 'POST',
            body: formData
        });
    },

    createGarment(formData) {
        return this.request('/garments', {
            method: 'POST',
            body: formData
        });
    },

    // Orders
    getOrders() {
        return this.request('/orders');
    },

    getAllOrders() {
        return this.request('/orders/all');
    },

    getOrder(id) {
        return this.request(`/orders/${id}`);
    },

    createOrder(payload) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    },

    getMissingGarments() {
        return this.request('/orders/missing-audit');
    },

    resolveMissingGarment(action) {
        return this.request('/orders/resolve-missing', {
            method: 'POST',
            body: JSON.stringify({ action })
        });
    },

    // Care Lab
    simulateCare(fabric, treatmentType) {
        return this.request('/care-lab/simulate', {
            method: 'POST',
            body: JSON.stringify({ fabric, treatmentType })
        });
    },

    compareCare(fabric, treatments) {
        return this.request('/care-lab/compare', {
            method: 'POST',
            body: JSON.stringify({ fabric, treatments })
        });
    },

    analyzeStain(formData) {
        return this.request('/care-lab/stain', {
            method: 'POST',
            body: formData
        });
    },

    // AI Operations
    queryAiOperations(query) {
        return this.request('/ai/query', {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    },

    applyAiRecommendation(actionType, actionPayload) {
        return this.request('/ai/apply-action', {
            method: 'POST',
            body: JSON.stringify({ actionType, actionPayload })
        });
    },

    // Machines & Fleet
    getMachines() {
        return this.request('/machines');
    },

    updateMachine(id, payload) {
        return this.request(`/machines/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
    },

    // Inventory
    getInventory() {
        return this.request('/inventory');
    },

    updateInventoryStock(id, stock) {
        return this.request(`/inventory/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock })
        });
    },

    // Analytics
    getMetrics() {
        return this.request('/analytics/metrics');
    },

    getForecast(horizon) {
        return this.request(`/analytics/forecast?horizon=${horizon || 7}`);
    },

    getSustainability() {
        return this.request('/analytics/sustainability');
    },

    // Notifications
    getNotifications() {
        return this.request('/notifications');
    },

    markNotificationRead(id) {
        return this.request(`/notifications/${id}/read`, {
            method: 'PATCH'
        });
    },

    markAllNotificationsRead() {
        return this.request('/notifications/read-all', {
            method: 'POST'
        });
    }
};

window.API = API;
