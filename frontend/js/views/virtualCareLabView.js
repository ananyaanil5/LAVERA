/**
 * Virtual Wash Lab & AI Stain Analysis View
 */
const VirtualCareLabView = {
    currentFabric: '100% Egyptian Cotton',
    selectedTreatments: ['NORMAL_WASH', 'DELICATE', 'DRY_CLEAN'],

    async render() {
        return `
        <div class="care-lab-view fade-in">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 3.5rem;">
                <span class="eyebrow">THERMODYNAMIC SIMULATION</span>
                <h1 style="margin-bottom: 0.75rem;">Before you wash it,<br /><em>know what it needs.</em></h1>
                <p class="subtext-editorial" style="max-width: 680px; margin: 0 auto;">
                    Test treatment cycles in a simulated environment before committing your wardrobe. Our fiber model evaluates shrinkage, color migration, and cellulose stress.
                </p>
            </div>

            <!-- Main Simulation Workspace -->
            <div class="card" style="margin-bottom: 3rem;">
                <div class="flex justify-between items-center" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: var(--border-light);">
                    <div>
                        <span class="eyebrow" style="margin: 0;">SELECT GARMENT OR FABRIC</span>
                        <h3 style="margin-top: 0.25rem;">Virtual Wash Lab</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <select class="form-select" id="labFabricSelect" style="width: 260px;" onchange="VirtualCareLabView.onFabricChange(this.value)">
                            <option value="100% Egyptian Cotton" selected>White Cotton Shirt (100% Cotton)</option>
                            <option value="100% Mongolian Cashmere">Beige Cashmere Knit (100% Cashmere)</option>
                            <option value="100% Mulberry Silk Charmeuse">Ivory Silk Blouse (100% Silk)</option>
                            <option value="100% Virgin Wool">Structured Blazer (100% Wool)</option>
                            <option value="100% French Flax Linen">Pleated Trousers (100% Linen)</option>
                        </select>
                        <button class="btn btn-primary btn-sm" onclick="VirtualCareLabView.runSimulation()">
                            RUN SIMULATION
                        </button>
                    </div>
                </div>

                <!-- Treatment Checkboxes for Side-by-Side Comparison -->
                <div style="margin-bottom: 2rem;">
                    <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-soft-grey); margin-bottom: 0.75rem;">
                        COMPARE TREATMENTS SIDE-BY-SIDE:
                    </div>
                    <div class="flex gap-2" style="flex-wrap: wrap;">
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="NORMAL_WASH" checked onchange="VirtualCareLabView.toggleTreatment(this)" /> Normal Wash (Warm 40°C)
                        </label>
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="DELICATE" checked onchange="VirtualCareLabView.toggleTreatment(this)" /> Cold Delicate (24°C)
                        </label>
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="DRY_CLEAN" checked onchange="VirtualCareLabView.toggleTreatment(this)" /> Bespoke Dry Clean
                        </label>
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="COLD_WASH" onchange="VirtualCareLabView.toggleTreatment(this)" /> Eco Cold (20°C)
                        </label>
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="HIGH_TEMPERATURE" onchange="VirtualCareLabView.toggleTreatment(this)" /> High Temp (60°C)
                        </label>
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                            <input type="checkbox" value="HAND_WASH" onchange="VirtualCareLabView.toggleTreatment(this)" /> Artisanal Hand Wash
                        </label>
                    </div>
                </div>

                <!-- Simulation Comparative Matrix -->
                <div id="simulationResultsArea">
                    <div style="text-align: center; padding: 2rem; color: var(--color-soft-grey);">
                        Loading baseline simulation matrix...
                    </div>
                </div>
            </div>

            <!-- AI Stain Analysis Module (Feature #14) -->
            <div class="card" style="border-left: 3px solid var(--color-champagne);">
                <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
                    <div>
                        <span class="eyebrow" style="margin: 0;">FEATURE #14 · CHEMICAL TARGETING</span>
                        <h2 style="font-size: 2rem; margin-top: 0.25rem;">AI Stain Analysis</h2>
                    </div>
                    <span class="badge badge-champagne">SPECTRAL CLASSIFIER</span>
                </div>

                <p class="subtext-editorial" style="margin-bottom: 2rem;">
                    Upload a high-resolution photograph of any stain. The neural vision classifier categorizes tannin, lipid, protein, and anthocyanin compounds, generating a safe pre-treatment protocol and thermal warnings.
                </p>

                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; align-items: start;">
                    <!-- Upload Box -->
                    <div class="upload-zone" onclick="document.getElementById('stainFileInput').click()">
                        <input type="file" id="stainFileInput" accept="image/*" style="display: none;" onchange="VirtualCareLabView.handleStainUpload(event)" />
                        <div id="stainUploadPrompt">
                            <div style="font-size: 2rem; color: var(--color-champagne); margin-bottom: 0.5rem;">🧪</div>
                            <div style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-obsidian);">
                                Upload Stain Photograph
                            </div>
                            <div style="font-size: 0.78rem; color: var(--color-soft-grey); margin: 0.25rem 0 1rem;">
                                Instant classification for Coffee, Oil, Wine, Ink, Food
                            </div>
                            <button type="button" class="btn btn-outline-champagne btn-sm" onclick="event.stopPropagation(); VirtualCareLabView.loadSampleCoffeeStain()">
                                ✦ LOAD SAMPLE COFFEE STAIN
                            </button>
                        </div>

                        <div id="stainPreviewWrap" style="display: none; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <img id="stainPreviewImg" src="" alt="Stain Preview" style="width: 130px; height: 130px; object-fit: cover; border-radius: 2px; border: var(--border-light);" />
                            <div style="font-size: 0.78rem; color: var(--color-soft-grey);" id="stainFileName">sample-coffee-stain.jpg</div>
                            <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); VirtualCareLabView.analyzeCurrentStain()">
                                ANALYZE STAIN NOW
                            </button>
                        </div>
                    </div>

                    <!-- Analysis Output Container -->
                    <div id="stainAnalysisOutput">
                        <div style="padding: 2rem; text-align: center; background-color: var(--color-warm-ivory); border: var(--border-light); border-radius: var(--radius-xs); color: var(--color-soft-grey);">
                            Upload or load the sample coffee stain photograph to run neural analysis.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    async afterRender() {
        await this.runSimulation();
    },

    onFabricChange(val) {
        this.currentFabric = val;
        this.runSimulation();
    },

    toggleTreatment(cb) {
        if (cb.checked) {
            if (!this.selectedTreatments.includes(cb.value)) this.selectedTreatments.push(cb.value);
        } else {
            this.selectedTreatments = this.selectedTreatments.filter(t => t !== cb.value);
            if (this.selectedTreatments.length === 0) this.selectedTreatments = ['DELICATE'];
        }
        this.runSimulation();
    },

    async runSimulation() {
        const area = document.getElementById('simulationResultsArea');
        if (!area) return;

        try {
            const data = await API.compareCare(this.currentFabric, this.selectedTreatments);
            const comps = data.comparisons || [];

            area.innerHTML = `
            <div style="overflow-x: auto;">
                <table class="table-editorial" style="margin-bottom: 2rem;">
                    <thead>
                        <tr>
                            <th>METRIC</th>
                            ${comps.map(c => `<th>${c.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-weight: 600;">SHRINKAGE RISK</td>
                            ${comps.map(c => `<td style="color: ${c.shrinkage.includes('HIGH') ? 'var(--color-alert)' : 'var(--color-obsidian)'}; font-weight: 500;">${c.shrinkage}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">COLOR FADING RISK</td>
                            ${comps.map(c => `<td>${c.colorFading}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">FABRIC STRESS</td>
                            ${comps.map(c => `<td>${c.fabricStress}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">LONGEVITY IMPACT</td>
                            ${comps.map(c => `<td style="color: ${c.longevityImpact.startsWith('+') ? 'var(--color-success)' : 'var(--color-alert)'}; font-weight: 600;">${c.longevityImpact}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">WATER CONSUMPTION</td>
                            ${comps.map(c => `<td>${c.water} L</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">ENERGY CONSUMPTION</td>
                            ${comps.map(c => `<td>${c.energy} kWh</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">ESTIMATED COST</td>
                            ${comps.map(c => `<td>₹${c.cost}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- AI Recommendation Callout -->
            <div style="padding: 1.5rem; background-color: var(--color-warm-ivory); border-left: 3px solid var(--color-champagne); border-radius: var(--radius-xs);">
                <div style="font-size: 0.72rem; color: var(--color-champagne); text-transform: uppercase; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
                    AI CARE RECOMMENDATION
                </div>
                <div style="font-size: 0.95rem; color: var(--color-obsidian); font-weight: 500;">
                    "${data.aiRecommendation}"
                </div>
            </div>
            `;
        } catch (e) {
            console.error('Simulation error:', e);
        }
    },

    currentStainFile: null,

    handleStainUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        this.currentStainFile = file;
        this.showStainPreview(URL.createObjectURL(file), file.name);
    },

    async loadSampleCoffeeStain() {
        try {
            const res = await fetch('/assets/images/sample-coffee-stain.jpg');
            const blob = await res.blob();
            this.currentStainFile = new File([blob], 'sample-coffee-stain.jpg', { type: 'image/jpeg' });
            this.showStainPreview('/assets/images/sample-coffee-stain.jpg', 'sample-coffee-stain.jpg');
            await this.analyzeCurrentStain();
        } catch (e) {
            console.error('Failed to load sample stain:', e);
        }
    },

    showStainPreview(url, name) {
        const prompt = document.getElementById('stainUploadPrompt');
        const preview = document.getElementById('stainPreviewWrap');
        const img = document.getElementById('stainPreviewImg');
        const fname = document.getElementById('stainFileName');

        if (prompt && preview && img) {
            prompt.style.display = 'none';
            preview.style.display = 'flex';
            img.src = url;
            fname.innerText = name;
        }
    },

    async analyzeCurrentStain() {
        const out = document.getElementById('stainAnalysisOutput');
        if (out) out.innerHTML = `<div style="padding: 2rem; text-align: center;">Analyzing spectral density and molecular structure...</div>`;

        try {
            const formData = new FormData();
            if (this.currentStainFile) {
                formData.append('image', this.currentStainFile);
            }
            formData.append('notes', 'coffee stain');

            const res = await API.analyzeStain(formData);

            out.innerHTML = `
            <div class="fade-in" style="background-color: var(--color-warm-ivory); border: var(--border-light); padding: 1.75rem; border-radius: var(--radius-xs);">
                <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">DETECTED STAIN</div>
                        <div style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--color-obsidian); font-weight: 500;">
                            ${res.detectedStain}
                        </div>
                    </div>
                    <div class="match-confidence-badge">
                        Confidence: ${res.confidencePercentage}
                    </div>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.72rem; color: var(--color-soft-grey); text-transform: uppercase; margin-bottom: 0.5rem;">
                        RECOMMENDED PRE-TREATMENT PROTOCOL:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                        ${res.treatmentProtocol.map(step => `
                            <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-obsidian); display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: var(--color-champagne);">✓</span> ${step}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Mandatory Warning -->
                <div style="padding: 0.85rem 1rem; background-color: var(--color-alert-bg); border-left: 3px solid var(--color-alert); border-radius: 2px;">
                    <div style="font-size: 0.68rem; color: var(--color-alert); font-weight: 700; text-transform: uppercase;">
                        THERMAL WARNING
                    </div>
                    <div style="font-size: 0.8rem; color: var(--color-obsidian); margin-top: 0.15rem;">
                        "${res.warning}"
                    </div>
                </div>
            </div>
            `;
        } catch (e) {
            console.error('Stain analysis failed:', e);
            if (out) out.innerHTML = `<div style="color: var(--color-alert); padding: 1.5rem;">Stain analysis failed: ${e.message}</div>`;
        }
    }
};

window.VirtualCareLabView = VirtualCareLabView;
