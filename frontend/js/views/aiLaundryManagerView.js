/**
 * AI Laundry Manager - Operations Intelligence Assistant
 */
const AiLaundryManagerView = {
    currentInsight: null,

    render() {
        return `
        <div class="ai-manager-view fade-in">
            <!-- Header -->
            <div style="margin-bottom: 2.5rem;">
                <span class="eyebrow">FEATURE #12 · OPERATIONAL INTELLIGENCE</span>
                <h1 style="font-size: 2.8rem; margin-bottom: 0.35rem;">AI OPERATIONS INTELLIGENCE</h1>
                <p class="subtext-editorial">
                    "Ask LAVÉRA what is happening across your operation."
                </p>
            </div>

            <!-- Console Card -->
            <div class="ai-console">
                <!-- Suggested Query Chips -->
                <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-soft-grey);">
                    SUGGESTED OPERATIONAL INQUIRIES:
                </div>
                
                <div class="suggested-queries-chips">
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('Why are deliveries delayed today?')">
                        Why are deliveries delayed today?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('Which machine is currently overloaded?')">
                        Which machine is currently overloaded?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('What should we prioritize this afternoon?')">
                        What should we prioritize this afternoon?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('Which garments are at risk of delayed delivery?')">
                        Which garments are at risk of delayed delivery?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('How many orders are expected tomorrow?')">
                        How many orders are expected tomorrow?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('Which service generated the most revenue this week?')">
                        Which service generated the most revenue this week?
                    </button>
                    <button class="query-chip" onclick="AiLaundryManagerView.runQuery('What is causing the current bottleneck?')">
                        What is causing the current bottleneck?
                    </button>
                </div>

                <!-- Custom Query Input -->
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                    <input type="text" class="form-input" id="aiQueryInput" placeholder="Ask anything about orders, machines, capacity, or bottlenecks..." value="Why are deliveries delayed today?" style="font-size: 0.95rem;" />
                    <button class="btn btn-primary" id="askAiBtn" onclick="AiLaundryManagerView.submitCustomQuery()">
                        ANALYZE TELEMETRY
                    </button>
                </div>

                <!-- AI Diagnostic Response Box -->
                <div id="aiResponseContainer">
                    <!-- Default initial diagnosis for prompt query -->
                    <div class="ai-response-box fade-in">
                        <div class="flex justify-between items-center" style="margin-bottom: 0.75rem;">
                            <span class="eyebrow" style="margin: 0;">DIAGNOSTIC REPORT</span>
                            <span class="badge badge-champagne">LIVE DATA INSPECTED</span>
                        </div>

                        <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;" id="responseHeadline">
                            Delivery Latency Root-Cause Analysis
                        </h3>

                        <p style="font-size: 1.05rem; color: var(--color-obsidian); line-height: 1.6; margin-bottom: 1.5rem;" id="responseExplanation">
                            "Delivery delays are primarily associated with a 23% increase in today's order volume and Washer 04 operating at 91% capacity."
                        </p>

                        <!-- Diagnostic Observations Grid -->
                        <div class="diagnostic-metrics-row" id="responseMetrics">
                            <div class="diagnostic-cell">
                                <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">OBSERVATION</div>
                                <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-obsidian); margin-top: 0.25rem;">
                                    Order volume +23%
                                </div>
                            </div>
                            <div class="diagnostic-cell alert">
                                <div style="font-size: 0.68rem; color: var(--color-alert); text-transform: uppercase; font-weight: 600;">BOTTLENECK</div>
                                <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-alert); margin-top: 0.25rem;">
                                    Washer 04 (91% Cap)
                                </div>
                            </div>
                            <div class="diagnostic-cell">
                                <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">AFFECTED BATCH</div>
                                <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-obsidian); margin-top: 0.25rem;">
                                    8 pending orders
                                </div>
                            </div>
                        </div>

                        <!-- Recommended Action Banner -->
                        <div style="padding: 1.25rem 1.5rem; background-color: var(--color-white); border: var(--border-light); border-radius: var(--radius-xs); display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 1rem;">
                            <div>
                                <div style="font-size: 0.68rem; color: var(--color-champagne); font-weight: 600; text-transform: uppercase;">
                                    RECOMMENDED ACTION
                                </div>
                                <div style="font-size: 1rem; font-weight: 600; color: var(--color-obsidian); margin-top: 0.2rem;" id="recommendationActionText">
                                    Move 8 pending orders to Washer 02.
                                </div>
                            </div>

                            <button class="btn btn-primary" id="applyRecommendationBtn" onclick="AiLaundryManagerView.applyRecommendation('REBALANCE_WASHER', {fromMachine: 'WASHER_04', toMachine: 'WASHER_02', orderCount: 8})">
                                APPLY RECOMMENDATION
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    async runQuery(q) {
        const input = document.getElementById('aiQueryInput');
        if (input) input.value = q;
        await this.submitCustomQuery();
    },

    async submitCustomQuery() {
        const input = document.getElementById('aiQueryInput');
        const q = input ? input.value.trim() : 'Why are deliveries delayed today?';
        const container = document.getElementById('aiResponseContainer');
        const btn = document.getElementById('askAiBtn');

        if (btn) btn.innerText = 'INSPECTING DATABASE...';

        try {
            const data = await API.queryAiOperations(q);
            this.currentInsight = data;
            this.renderInsight(data);
        } catch (e) {
            console.error('Query error:', e);
            if (container) container.innerHTML = `<div style="color: var(--color-alert); padding: 2rem;">Error querying operations engine: ${e.message}</div>`;
        } finally {
            if (btn) btn.innerText = 'ANALYZE TELEMETRY';
        }
    },

    renderInsight(data) {
        const container = document.getElementById('aiResponseContainer');
        if (!container) return;

        container.innerHTML = `
        <div class="ai-response-box fade-in">
            <div class="flex justify-between items-center" style="margin-bottom: 0.75rem;">
                <span class="eyebrow" style="margin: 0;">DIAGNOSTIC REPORT</span>
                <span class="badge badge-champagne">LIVE DATA INSPECTED</span>
            </div>

            <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">
                ${data.headline}
            </h3>

            <p style="font-size: 1.05rem; color: var(--color-obsidian); line-height: 1.6; margin-bottom: 1.5rem;">
                "${data.explanation}"
            </p>

            <div class="diagnostic-metrics-row">
                ${data.metrics.map(m => `
                    <div class="diagnostic-cell ${m.alert ? 'alert' : ''}">
                        <div style="font-size: 0.68rem; color: ${m.alert ? 'var(--color-alert)' : 'var(--color-soft-grey)'}; text-transform: uppercase; font-weight: 600;">
                            ${m.label}
                        </div>
                        <div style="font-family: var(--font-serif); font-size: 1.35rem; color: ${m.alert ? 'var(--color-alert)' : 'var(--color-obsidian)'}; margin-top: 0.25rem;">
                            ${m.value}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="padding: 1.25rem 1.5rem; background-color: var(--color-white); border: var(--border-light); border-radius: var(--radius-xs); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <div style="font-size: 0.68rem; color: var(--color-champagne); font-weight: 600; text-transform: uppercase;">
                        RECOMMENDED ACTION
                    </div>
                    <div style="font-size: 1rem; font-weight: 600; color: var(--color-obsidian); margin-top: 0.2rem;">
                        ${data.recommendedAction}
                    </div>
                </div>

                ${data.canApply ? `
                    <button class="btn btn-primary" id="applyRecommendationBtn" onclick="AiLaundryManagerView.applyRecommendation('${data.actionType}', ${JSON.stringify(data.actionPayload || {}).replace(/"/g, '&quot;')})">
                        APPLY RECOMMENDATION
                    </button>
                ` : `
                    <span class="badge badge-success">DIRECTIVE NOTED</span>
                `}
            </div>
        </div>
        `;
    },

    async applyRecommendation(actionType, payload) {
        const btn = document.getElementById('applyRecommendationBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerText = 'EXECUTING WORKFLOW REBALANCE...';
        }

        try {
            const res = await API.applyAiRecommendation(actionType, payload);
            if (res.success) {
                // Show rich confirmation banner
                const container = document.getElementById('aiResponseContainer');
                if (container) {
                    const notice = document.createElement('div');
                    notice.className = 'fade-in';
                    notice.style = 'margin-top: 1.25rem; padding: 1.25rem 1.5rem; background-color: var(--color-success-bg); border: 1px solid rgba(74, 107, 83, 0.3); border-radius: 2px; color: var(--color-success);';
                    notice.innerHTML = `
                        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                            ✓ RECOMMENDATION APPLIED IN DATABASE
                        </div>
                        <div style="font-size: 0.95rem; font-weight: 600; margin: 0.35rem 0 0.5rem; color: var(--color-obsidian);">
                            ${res.message}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--color-soft-charcoal);">
                            • Washer 04 capacity normalized to <strong>${res.fromMachine.newCapacity}</strong><br />
                            • Washer 02 utilized at <strong>${res.toMachine.newCapacity}</strong><br />
                            • Order queues rebalanced. Live notification dispatched to atelier staff.
                        </div>
                    `;
                    container.appendChild(notice);
                }

                if (btn) {
                    btn.className = 'btn btn-secondary';
                    btn.innerText = '✓ RECOMMENDATION APPLIED';
                    btn.disabled = true;
                }

                // Refresh notifications
                Store.fetchNotifications();
            }
        } catch (e) {
            console.error('Apply error:', e);
            alert('Failed to apply recommendation: ' + e.message);
            if (btn) {
                btn.disabled = false;
                btn.innerText = 'APPLY RECOMMENDATION';
            }
        }
    }
};

window.AiLaundryManagerView = AiLaundryManagerView;
