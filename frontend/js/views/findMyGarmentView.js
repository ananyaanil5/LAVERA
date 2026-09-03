/**
 * Find My Garment View - Computer Vision Garment Search Engine
 */
const FindMyGarmentView = {
    selectedFile: null,

    render() {
        return `
        <div class="find-container fade-in">
            <div style="text-align: center; margin-bottom: 3rem;">
                <span class="eyebrow">COMPUTER VISION RETRIEVAL</span>
                <h1 style="margin-bottom: 0.75rem;">Can't remember where it is?<br /><em>We'll find it.</em></h1>
                <p class="subtext-editorial" style="max-width: 600px; margin: 0 auto;">
                    Upload a photograph of any garment. LAVÉRA analyzes weave patterns, silhouettes, and color profiles to match your registered wardrobe, retrieving its live facility station and order tracking.
                </p>
            </div>

            <!-- Upload Area -->
            <div class="card" style="margin-bottom: 2.5rem;">
                <div class="upload-zone" id="findDropZone" onclick="document.getElementById('garmentSearchInput').click()">
                    <input type="file" id="garmentSearchInput" accept="image/jpeg,image/png,image/webp" style="display: none;" onchange="FindMyGarmentView.handleFileSelect(event)" />
                    
                    <div id="dropZonePrompt">
                        <div style="font-size: 2.2rem; color: var(--color-champagne); margin-bottom: 0.75rem;">📷</div>
                        <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-obsidian); margin-bottom: 0.25rem;">
                            Drop garment photograph here, or click to upload
                        </div>
                        <div style="font-size: 0.78rem; color: var(--color-soft-grey); margin-bottom: 1.25rem;">
                            Supports JPG, PNG, WEBP (Max 10MB)
                        </div>
                        <div class="flex justify-center gap-2">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); document.getElementById('garmentSearchInput').click()">
                                CHOOSE FILE
                            </button>
                            <button type="button" class="btn btn-outline-champagne btn-sm" onclick="event.stopPropagation(); FindMyGarmentView.loadSampleDemoPhoto()">
                                ✦ LOAD SAMPLE WHITE SHIRT PHOTO
                            </button>
                        </div>
                    </div>

                    <div id="dropZonePreview" style="display: none; align-items: center; justify-content: center; gap: 1.5rem;">
                        <img id="previewImg" src="" alt="Garment Preview" style="width: 140px; height: 140px; object-fit: cover; border: var(--border-hairline); border-radius: 2px;" />
                        <div style="text-align: left;">
                            <div style="font-family: var(--font-serif); font-size: 1.25rem;" id="previewFileName">garment-photo.jpg</div>
                            <div style="font-size: 0.78rem; color: var(--color-soft-grey); margin: 0.25rem 0 1rem;" id="previewFileSize">Ready for optical search</div>
                            <button type="button" class="btn btn-primary" id="runSearchBtn" onclick="event.stopPropagation(); FindMyGarmentView.executeSearch()">
                                SEARCH WARDROBE DATABASE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Results Placeholder / Container -->
            <div id="searchResultsContainer"></div>
        </div>
        `;
    },

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        this.selectedFile = file;
        this.showPreview(file, URL.createObjectURL(file), file.name, `${(file.size / 1024).toFixed(1)} KB`);
    },

    async loadSampleDemoPhoto() {
        // Fetch the generated white-shirt asset as a File object for authentic upload pipeline
        try {
            const response = await fetch('/assets/images/white-shirt.jpg');
            const blob = await response.blob();
            this.selectedFile = new File([blob], 'white-cotton-shirt-sample.jpg', { type: 'image/jpeg' });
            this.showPreview(this.selectedFile, '/assets/images/white-shirt.jpg', 'white-cotton-shirt-sample.jpg', '635.7 KB');
        } catch (e) {
            console.error('Failed to load sample image:', e);
        }
    },

    showPreview(file, url, name, size) {
        const prompt = document.getElementById('dropZonePrompt');
        const preview = document.getElementById('dropZonePreview');
        const img = document.getElementById('previewImg');
        const fname = document.getElementById('previewFileName');
        const fsize = document.getElementById('previewFileSize');

        if (prompt && preview && img) {
            prompt.style.display = 'none';
            preview.style.display = 'flex';
            img.src = url;
            fname.innerText = name;
            fsize.innerText = size;
        }
    },

    async executeSearch() {
        const resultsEl = document.getElementById('searchResultsContainer');
        const searchBtn = document.getElementById('runSearchBtn');
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerText = 'ANALYZING WEAVE & MATCHING...';
        }

        try {
            const formData = new FormData();
            if (this.selectedFile) {
                formData.append('image', this.selectedFile);
            }
            formData.append('hint', 'cotton shirt');

            const match = await API.matchGarment(formData);
            this.renderMatchResult(match);
        } catch (e) {
            console.error('Search error:', e);
            if (resultsEl) {
                resultsEl.innerHTML = `
                    <div class="card" style="text-align: center; border-color: var(--color-alert);">
                        <div style="color: var(--color-alert); font-size: 1.1rem; margin-bottom: 0.5rem;">Search Query Failed</div>
                        <p>${e.message || 'Could not connect to matching engine.'}</p>
                    </div>
                `;
            }
        } finally {
            if (searchBtn) {
                searchBtn.disabled = false;
                searchBtn.innerText = 'SEARCH WARDROBE DATABASE';
            }
        }
    },

    renderMatchResult(match) {
        const resultsEl = document.getElementById('searchResultsContainer');
        if (!resultsEl) return;

        const g = match.garment;

        resultsEl.innerHTML = `
        <div class="match-result-card fade-in">
            <div class="match-photo-wrap">
                <img src="${match.uploadedImage || g.imageUrl || '/assets/images/white-shirt.jpg'}" alt="${g.name}" />
            </div>

            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
                        <span class="badge badge-success" style="font-weight: 600;">MATCH FOUND</span>
                        <div class="match-confidence-badge">
                            ✦ MATCH CONFIDENCE: ${match.matchConfidence}%
                        </div>
                    </div>

                    <h2 style="font-size: 2.2rem; margin-bottom: 0.25rem;">${g.name}</h2>
                    <div style="font-size: 0.95rem; color: var(--color-soft-charcoal); margin-bottom: 1.5rem;">
                        ${g.brand} · ${g.fabric} · Size ${g.size}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; padding: 1.25rem; background-color: var(--color-warm-ivory); border: var(--border-light); border-radius: 2px; margin-bottom: 1.5rem;">
                        <div>
                            <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">GARMENT ID</div>
                            <div style="font-family: monospace; font-size: 1.05rem; font-weight: 600; color: var(--color-obsidian);">${g.id}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">CURRENT LOCATION</div>
                            <div style="font-size: 1.05rem; font-weight: 600; color: var(--color-champagne);">${match.currentLocation}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">ACTIVE ORDER</div>
                            <div style="font-size: 0.95rem; font-weight: 600;">${match.orderId}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">LAST SCANNED</div>
                            <div style="font-size: 0.95rem; color: var(--color-soft-charcoal);">${match.lastScanned}</div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="btn btn-primary" onclick="Store.setView('garment-dna', {garmentId: '${g.id}'})">
                        VIEW GARMENT DNA →
                    </button>
                    <button class="btn btn-secondary" onclick="Store.setView('orders', {orderId: '${match.orderId.replace('#', '')}'})">
                        TRACK ORDER CUSTODY
                    </button>
                </div>
            </div>
        </div>
        `;

        resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
};

window.FindMyGarmentView = FindMyGarmentView;
