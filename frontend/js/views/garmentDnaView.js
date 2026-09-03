/**
 * Garment DNA View - Digital Twin, Aging Predictor & Pre-existing Damage Inspection
 */
const GarmentDnaView = {
    async render() {
        const garmentId = Store.state.selectedGarmentId || 'LV-GX-82941';
        let garmentData = null;

        try {
            garmentData = await API.getGarment(garmentId);
        } catch (e) {
            console.error('Error fetching garment DNA:', e);
        }

        const g = garmentData ? garmentData.garment : {
            id: 'LV-GX-82941',
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
            image_url: '/assets/images/white-shirt.jpg'
        };

        const longevity = (garmentData && garmentData.longevity) ? garmentData.longevity : {
            currentCondition: 91,
            projections: { after10Washes: 87, after20Washes: 84, after25Washes: 79, after50Washes: 66 },
            recommendation: 'Switching to cold-water delicate cycles may extend expected garment longevity.',
            summary: "Based on the garment's fabric, washing history and treatment patterns, this garment is currently expected to retain approximately 84% of its original condition over the next 20 washes."
        };

        const careHistory = (garmentData && garmentData.careHistory && garmentData.careHistory.length > 0) ? garmentData.careHistory : [
            { wash_date: '12 Aug', cycle_type: 'Cold Wash', notes: 'Surfactant pH 6.8, 28°C gentle wash.' },
            { wash_date: '04 Aug', cycle_type: 'Delicate Cycle', notes: 'Enzymatic rinse and natural air tunnel dry.' },
            { wash_date: '21 Jul', cycle_type: 'Stain Treatment', notes: 'Targeted botanical spot lift for tannin residue.' },
            { wash_date: '03 Jul', cycle_type: 'Cold Wash', notes: 'Gentle hand-finish iron.' }
        ];

        const inspections = (garmentData && garmentData.inspections && garmentData.inspections.length > 0) ? garmentData.inspections : [
            {
                detected_condition: 'Small fabric abrasion near left cuff.',
                confidence: 0.87,
                stage: 'BEFORE_CARE',
                snapshot_url: '/assets/images/white-shirt.jpg'
            }
        ];

        return `
        <div class="garment-dna-view fade-in">
            <!-- Header with Quick Garment Switcher -->
            <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
                <div>
                    <span class="eyebrow">DIGITAL TWIN SPECIFICATION</span>
                    <h1>GARMENT DNA™</h1>
                </div>
                <div class="flex items-center gap-2">
                    <span style="font-size: 0.75rem; color: var(--color-soft-grey); text-transform: uppercase;">Switch Garment:</span>
                    <select class="form-select" style="width: auto; padding: 0.5rem 1rem;" onchange="Store.setView('garment-dna', {garmentId: this.value})">
                        <option value="LV-GX-82941" ${g.id === 'LV-GX-82941' ? 'selected' : ''}>LV-GX-82941 · White Cotton Shirt</option>
                        <option value="LV-GX-82942" ${g.id === 'LV-GX-82942' ? 'selected' : ''}>LV-GX-82942 · Beige Cashmere Knit</option>
                        <option value="LV-GX-82943" ${g.id === 'LV-GX-82943' ? 'selected' : ''}>LV-GX-82943 · Ivory Silk Blouse</option>
                    </select>
                    <button class="btn btn-primary btn-sm" onclick="Store.setView('care-lab')">
                        TEST IN CARE LAB →
                    </button>
                </div>
            </div>

            <!-- Two Column Main Layout -->
            <div class="dna-view-grid">
                <!-- Left Column: Photography & Visual Health -->
                <div>
                    <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
                        <div style="position: relative; overflow: hidden; border-radius: var(--radius-xs); height: 420px; background: var(--color-warm-ivory);">
                            <img src="${g.image_url || '/assets/images/white-shirt.jpg'}" alt="${g.name}" style="width: 100%; height: 100%; object-fit: cover;" id="dnaGarmentImg" />
                            <div style="position: absolute; top: 1rem; left: 1rem;">
                                <span class="badge badge-champagne">GARMENT ID: ${g.id}</span>
                            </div>
                            <div style="position: absolute; bottom: 1rem; right: 1rem;">
                                <span class="badge ${g.status === 'IN_ORDER' ? 'badge-warning' : 'badge-success'}">
                                    ${g.status === 'IN_ORDER' ? 'IN CARE ATELIER' : 'IN WARDROBE'}
                                </span>
                            </div>
                        </div>

                        <!-- Visual Garment Health Indicator -->
                        <div class="dna-health-indicator">
                            <div class="health-gauge" id="healthScoreGauge">
                                ${g.condition_score}
                            </div>
                            <div style="flex-grow: 1;">
                                <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase; letter-spacing: 0.1em;">
                                    CONDITION SCORE · HEALTH GAUGE
                                </div>
                                <div style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-obsidian); margin: 0.15rem 0;">
                                    ${g.condition_score} / 100 · High Tensile Integrity
                                </div>
                                <div style="font-size: 0.78rem; color: var(--color-champagne);">
                                    WASH HISTORY: ${g.wash_cycles} cycles · Last: ${g.last_washed}
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="GarmentDnaView.triggerInspectionUpload('${g.id}')">
                                📷 UPLOAD NEW INSPECTION
                            </button>
                            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="Store.setView('find-garment')">
                                🔍 SEARCH SIMILAR
                            </button>
                        </div>
                    </div>

                    <!-- Pre-Existing Damage Detection (BEFORE CARE Snapshot) -->
                    <div class="card" id="inspectionCard" style="border-left: 3px solid var(--color-champagne);">
                        <div class="flex justify-between items-center" style="margin-bottom: 0.75rem;">
                            <span class="eyebrow" style="margin: 0;">GARMENT INSPECTION</span>
                            <span class="badge badge-champagne">BEFORE CARE SNAPSHOT</span>
                        </div>

                        <div style="margin: 1rem 0; padding: 1rem; background-color: var(--color-warm-ivory); border: var(--border-light); border-radius: var(--radius-xs);">
                            <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">DETECTED CONDITION:</div>
                            <div style="font-size: 1.05rem; font-family: var(--font-serif); color: var(--color-obsidian); margin: 0.35rem 0;">
                                ${inspections[0].detected_condition}
                            </div>
                            <div class="flex items-center gap-2" style="margin-top: 0.5rem;">
                                <span class="badge badge-success">Confidence: ${Math.round(inspections[0].confidence * 100)}%</span>
                                <span style="font-size: 0.78rem; color: var(--color-soft-grey);">Stage: ${inspections[0].stage}</span>
                            </div>
                        </div>

                        <p style="font-size: 0.8rem; color: var(--color-soft-charcoal);">
                            Audit note: Microfiber laser scan mapped tensile variation on cuff edge. Botanical fiber stabilizer applied prior to surfactant contact.
                        </p>
                    </div>
                </div>

                <!-- Right Column: Specs, Longevity Predictor & History -->
                <div>
                    <!-- Garment Identity Header -->
                    <div class="card" style="margin-bottom: 2rem;">
                        <h2 style="font-size: 2.2rem; margin-bottom: 0.25rem;">${g.name}</h2>
                        <div style="font-size: 0.95rem; color: var(--color-soft-charcoal); margin-bottom: 1.5rem;">
                            ${g.brand} · ${g.fabric} · Size ${g.size}
                        </div>

                        <table class="dna-spec-table">
                            <tbody>
                                <tr>
                                    <td>GARMENT ID</td>
                                    <td style="font-family: monospace; font-weight: 600;">${g.id}</td>
                                </tr>
                                <tr>
                                    <td>BRAND / ATELIER</td>
                                    <td>${g.brand}</td>
                                </tr>
                                <tr>
                                    <td>FABRIC COMPOSITION</td>
                                    <td>${g.fabric}</td>
                                </tr>
                                <tr>
                                    <td>COLOR CODE</td>
                                    <td>${g.color}</td>
                                </tr>
                                <tr>
                                    <td>PURCHASE DATE</td>
                                    <td>${g.purchase_date || '2024-03-15'}</td>
                                </tr>
                                <tr>
                                    <td>NUMBER OF WASHES</td>
                                    <td>${g.wash_cycles} cycles recorded</td>
                                </tr>
                                <tr>
                                    <td>LAST WASHED</td>
                                    <td>${g.last_washed}</td>
                                </tr>
                                <tr>
                                    <td>CARE PROFILE</td>
                                    <td style="font-weight: 500; color: var(--color-champagne);">${g.care_recommendation}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- GARMENT AGING PREDICTOR (Garment Longevity) -->
                    <div class="card" style="margin-bottom: 2rem;">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="eyebrow" style="margin: 0;">AI PREDICTION MODEL</span>
                                <h3 style="margin-top: 0.25rem;">GARMENT LONGEVITY</h3>
                            </div>
                            <span class="badge badge-champagne">DYNAMIC DECAY ENGINE</span>
                        </div>

                        <p class="subtext-editorial" style="font-size: 0.95rem; margin: 1.25rem 0 1rem;" id="agingSummaryText">
                            "${longevity.summary}"
                        </p>

                        <!-- Clean Projection Grid -->
                        <div class="aging-chart-box">
                            <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
                                <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-soft-grey); font-weight: 600;">
                                    TENSILE INTEGRITY PROJECTION CURVE
                                </div>
                                <div class="flex gap-1">
                                    <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.65rem;" onclick="GarmentDnaView.simulateAging('${g.id}', 'cold', 'delicate')">Cold Delicate</button>
                                    <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.65rem;" onclick="GarmentDnaView.simulateAging('${g.id}', 'hot', 'normal')">Hot Normal</button>
                                </div>
                            </div>

                            <div class="aging-projections-row" id="projectionsGrid">
                                <div class="projection-pill">
                                    <div class="val">${longevity.currentCondition}%</div>
                                    <div class="lbl">CURRENT CONDITION</div>
                                </div>
                                <div class="projection-pill">
                                    <div class="val" style="color: var(--color-champagne);">${longevity.projections.after10Washes}%</div>
                                    <div class="lbl">AFTER 10 WASHES</div>
                                </div>
                                <div class="projection-pill">
                                    <div class="val" style="color: var(--color-champagne);">${longevity.projections.after25Washes}%</div>
                                    <div class="lbl">AFTER 25 WASHES</div>
                                </div>
                                <div class="projection-pill">
                                    <div class="val">${longevity.projections.after50Washes}%</div>
                                    <div class="lbl">AFTER 50 WASHES</div>
                                </div>
                            </div>

                            <div style="background: #fff; padding: 0.85rem 1rem; border: var(--border-light); border-radius: var(--radius-xs); margin-top: 1rem;">
                                <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">AI LONGEVITY RECOMMENDATION:</div>
                                <div style="font-size: 0.85rem; color: var(--color-obsidian); font-weight: 500; margin-top: 0.25rem;" id="agingRecommendationText">
                                    "${longevity.recommendation}"
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Care History Log -->
                    <div class="card">
                        <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
                            <span class="eyebrow" style="margin: 0;">LIFECYCLE AUDIT</span>
                            <span style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase;">CHRONOLOGICAL</span>
                        </div>
                        <h3 style="margin-bottom: 1.25rem;">CARE HISTORY</h3>

                        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                            ${careHistory.map(ch => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--color-warm-ivory); border: var(--border-light); border-radius: 2px;">
                                    <div class="flex items-center gap-3">
                                        <div style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-champagne); width: 65px;">
                                            ${ch.wash_date}
                                        </div>
                                        <div>
                                            <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-obsidian);">${ch.cycle_type}</div>
                                            <div style="font-size: 0.76rem; color: var(--color-soft-grey);">${ch.notes || 'Gentle wash cycle executed.'}</div>
                                        </div>
                                    </div>
                                    <span class="badge badge-champagne">VERIFIED</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    async simulateAging(garmentId, waterTemp, cycleType) {
        try {
            const data = await API.calculateAging(garmentId, waterTemp, cycleType);
            if (data && data.longevity) {
                const l = data.longevity;
                const grid = document.getElementById('projectionsGrid');
                if (grid) {
                    grid.innerHTML = `
                        <div class="projection-pill">
                            <div class="val">${l.currentCondition}%</div>
                            <div class="lbl">CURRENT CONDITION</div>
                        </div>
                        <div class="projection-pill">
                            <div class="val" style="color: var(--color-champagne);">${l.projections.after10Washes}%</div>
                            <div class="lbl">AFTER 10 WASHES</div>
                        </div>
                        <div class="projection-pill">
                            <div class="val" style="color: var(--color-champagne);">${l.projections.after25Washes}%</div>
                            <div class="lbl">AFTER 25 WASHES</div>
                        </div>
                        <div class="projection-pill">
                            <div class="val">${l.projections.after50Washes}%</div>
                            <div class="lbl">AFTER 50 WASHES</div>
                        </div>
                    `;
                }
                const sumEl = document.getElementById('agingSummaryText');
                if (sumEl) sumEl.innerText = `"${l.summary}"`;
                const recEl = document.getElementById('agingRecommendationText');
                if (recEl) recEl.innerText = `"${l.recommendation}"`;
            }
        } catch (e) {
            console.error('Simulation error:', e);
        }
    },

    triggerInspectionUpload(garmentId) {
        App.openInspectionModal(garmentId);
    }
};

window.GarmentDnaView = GarmentDnaView;
