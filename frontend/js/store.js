/**
 * LAVÉRA State Management Store
 */
const Store = {
    state: {
        currentUser: null,
        token: localStorage.getItem('lavera_token') || '',
        activeView: 'landing', // 'landing', 'dashboard', 'garment-dna', 'find-garment', 'care-lab', 'orders', 'ai-manager', 'admin'
        selectedGarmentId: 'LV-GX-82941',
        selectedOrderId: 'LV-10482',
        notifications: [],
        unreadCount: 0,
        garments: [],
        orders: [],
        machines: [],
        inventory: []
    },

    listeners: [],

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    },

    notify() {
        this.listeners.forEach(fn => fn(this.state));
    },

    setUser(user, token) {
        this.state.currentUser = user;
        this.state.token = token || '';
        API.setToken(token);
        this.notify();
    },

    setView(view, params = {}) {
        this.state.activeView = view;
        if (params.garmentId) this.state.selectedGarmentId = params.garmentId;
        if (params.orderId) this.state.selectedOrderId = params.orderId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.notify();
    },

    setNotifications(list) {
        this.state.notifications = list || [];
        this.state.unreadCount = this.state.notifications.filter(n => !n.is_read).length;
        this.notify();
    },

    async fetchNotifications() {
        if (!this.state.currentUser) return;
        try {
            const data = await API.getNotifications();
            this.setNotifications(data.notifications);
        } catch (e) {
            console.warn('Could not fetch notifications:', e.message);
        }
    }
};

window.Store = Store;
