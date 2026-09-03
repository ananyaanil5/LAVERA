/**
 * Landing Page View - High-Fashion Editorial × AI Technology
 */
const LandingView = {
    render() {
        return `
        <div class="landing-page fade-in">
            <!-- Header -->
            <header class="site-header">
                <div class="container header-inner">
                    <a href="#" onclick="Store.setView('landing'); return false;" aria-label="LAVÉRA Home" style="display: flex; align-items: center; text-decoration: none;">
                        <img src="/assets/images/lavera-logo.jpg" alt="LAVÉRA" class="brand-logo-img" draggable="false" />
                    </a>

                    <nav>
                        <ul class="nav-links">
                            <li><a class="nav-link" href="#hero">HOME</a></li>
                            <li><a class="nav-link" href="#philosophy">PHILOSOPHY</a></li>
                            <li><a class="nav-link" href="#how-it-works">HOW IT WORKS</a></li>
                            <li><a class="nav-link" href="#garment-dna" onclick="Store.setView('garment-dna', {garmentId: 'LV-GX-82941'}); return false;">GARMENT DNA</a></li>
                            <li><a class="nav-link" href="#care-lab" onclick="Store.setView('care-lab'); return false;">CARE LAB</a></li>
                            <li><a class="nav-link" href="#ai-ops" onclick="Store.setView('ai-manager'); return false;">AI LAB</a></li>
                        </ul>
                    </nav>

                    <div class="flex items-center gap-2">
                        <button class="btn btn-outline-champagne" onclick="App.openLoginModal()">SIGN IN</button>
                    </div>
                </div>
            </header>

            <!-- Split-Screen Hero -->
            <section class="hero-split" id="hero">
                <div class="hero-left">
                    <span class="eyebrow">INTELLIGENT GARMENT CARE</span>
                    <h1 class="hero-headline">
                        <span>Care, Curated.</span>
                        <em>Intelligence in</em>
                        <span>every thread.</span>
                    </h1>
                    <p class="hero-supporting">
                        LAVÉRA combines intelligent garment analysis with expert care to preserve what you wear, one garment at a time.
                    </p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" onclick="App.handleBookServiceClick()">BOOK A SERVICE</button>
                        <button class="btn btn-secondary" onclick="Store.setView('garment-dna', {garmentId: 'LV-GX-82941'})">EXPLORE LAVÉRA</button>
                    </div>
                </div>

                <div class="hero-right">
                    <img src="/assets/images/hero-wardrobe.jpg" alt="LAVÉRA Garment Care Atelier" class="hero-image" />
                    <div class="hero-badge-overlay">
                        <span class="eyebrow" style="margin-bottom: 0.35rem;">ATELIER ACTIVE</span>
                        <div style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-obsidian);">Worli Central Studio</div>
                        <div style="font-size: 0.78rem; color: var(--color-soft-grey); margin-top: 0.2rem;">Optical scanning & gentle convective drying online</div>
                    </div>
                </div>
            </section>

            <!-- Four Understated Feature Indicators -->
            <section class="feature-indicators">
                <div class="indicator-item">
                    <div class="indicator-title">EXPERT CARE</div>
                    <div class="indicator-desc">For every fabric</div>
                </div>
                <div class="indicator-item">
                    <div class="indicator-title">AI POWERED</div>
                    <div class="indicator-desc">Intelligent garment analysis</div>
                </div>
                <div class="indicator-item">
                    <div class="indicator-title">PICKUP & DELIVERY</div>
                    <div class="indicator-desc">Seamless convenience</div>
                </div>
                <div class="indicator-item">
                    <div class="indicator-title">SUSTAINABLE</div>
                    <div class="indicator-desc">Gentle on garments, kinder to resources</div>
                </div>
            </section>

            <!-- The LAVÉRA Philosophy -->
            <section class="section-editorial" id="philosophy" style="background-color: var(--color-warm-ivory);">
                <div class="container text-center" style="max-width: 860px; margin: 0 auto; text-align: center;">
                    <span class="eyebrow">THE LAVÉRA PHILOSOPHY</span>
                    <blockquote class="philosophy-quote">
                        "Garments are not just washed.<br />They are understood."
                    </blockquote>
                    <p class="subtext-editorial">
                        LAVÉRA treats garments as valuable objects rather than disposable laundry. Every weave carries a story, a provenance, and an optimal thermodynamic threshold. We listen to the fibers before we touch them.
                    </p>
                </div>
            </section>

            <!-- How It Works (01 Identify, 02 Understand, 03 Care, 04 Preserve) -->
            <section class="section-editorial" id="how-it-works">
                <div class="container">
                    <div class="section-header-center">
                        <span class="eyebrow">METHODOLOGY</span>
                        <h2>The Preservation Lifecycle</h2>
                    </div>

                    <div class="steps-grid">
                        <div class="step-card">
                            <span class="step-number">01</span>
                            <div class="step-title">IDENTIFY</div>
                            <p>Each garment receives a cryptographic digital twin, cataloging fiber composition, tensile integrity, and color profile.</p>
                        </div>
                        <div class="step-card">
                            <span class="step-number">02</span>
                            <div class="step-title">UNDERSTAND</div>
                            <p>Optical laser inspection detects pre-existing micro-abrasions, stains, and button tension before water touch.</p>
                        </div>
                        <div class="step-card">
                            <span class="step-number">03</span>
                            <div class="step-title">CARE</div>
                            <p>Deionized water baths, plant-derived saponins, and cold convective drying tailored precisely to fiber requirements.</p>
                        </div>
                        <div class="step-card">
                            <span class="step-number">04</span>
                            <div class="step-title">PRESERVE</div>
                            <p>Predictive longevity models chart wear progression across cycles, extending garment life by up to 34%.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- The Garment DNA Showcase -->
            <section class="section-editorial" id="garment-dna" style="background-color: var(--color-warm-ivory);">
                <div class="container">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                        <div>
                            <span class="eyebrow">CORE DIFFERENTIATOR</span>
                            <h2>The Garment DNA™</h2>
                            <p class="subtext-editorial" style="margin: 1.5rem 0 2rem;">
                                Every garment in your wardrobe possesses a unique digital identity. From wash count and fiber tensile health to pre-existing damage maps, LAVÉRA remembers its journey.
                            </p>
                            <div class="card" style="margin-bottom: 2rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                    <span class="badge badge-champagne">GARMENT ID: LV-GX-82941</span>
                                    <span style="font-size: 0.76rem; color: var(--color-soft-grey);">17 WASH CYCLES</span>
                                </div>
                                <div style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.25rem;">White Cotton Shirt</div>
                                <div style="font-size: 0.85rem; color: var(--color-soft-charcoal); margin-bottom: 1.25rem;">Aurélia Sartoriale · 100% Egyptian Cotton</div>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: var(--border-light);">
                                    <div>
                                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">CONDITION SCORE</div>
                                        <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-obsidian);">91 / 100</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.68rem; color: var(--color-soft-grey); text-transform: uppercase;">CARE PROFILE</div>
                                        <div style="font-size: 0.85rem; font-weight: 500;">Delicate / Cold Wash</div>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary" onclick="Store.setView('garment-dna', {garmentId: 'LV-GX-82941'})">EXPLORE GARMENT DNA</button>
                        </div>
                        <div>
                            <div style="position: relative; overflow: hidden; border: var(--border-hairline); border-radius: var(--radius-sm); box-shadow: var(--shadow-subtle);">
                                <img src="/assets/images/white-shirt.jpg" alt="White Cotton Shirt" style="width: 100%; height: 500px; object-fit: cover;" />
                                <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
                                    <span class="badge badge-success">DIGITAL TWIN VERIFIED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Virtual Care Lab & AI Operations Interactive Callout -->
            <section class="section-editorial">
                <div class="container">
                    <div class="section-header-center">
                        <span class="eyebrow">INTELLIGENT SUITE</span>
                        <h2>Atelier Science & AI Systems</h2>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
                        <div class="card card-hover" style="cursor: pointer;" onclick="Store.setView('care-lab')">
                            <span class="eyebrow">FEATURE #13</span>
                            <h3 style="margin-bottom: 0.75rem;">The Virtual Wash Lab</h3>
                            <p style="margin-bottom: 1.5rem;">Simulate shrinkage risk, color fading, and fiber stress side-by-side across cold delicate, dry clean, and normal treatments before washing.</p>
                            <div class="flex items-center gap-1" style="font-size: 0.78rem; color: var(--color-champagne); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                                Launch Virtual Wash Lab →
                            </div>
                        </div>

                        <div class="card card-hover" style="cursor: pointer;" onclick="Store.setView('ai-manager')">
                            <span class="eyebrow">FEATURE #12</span>
                            <h3 style="margin-bottom: 0.75rem;">AI Operations Intelligence</h3>
                            <p style="margin-bottom: 1.5rem;">Ask operational queries in natural language, uncover machine bottlenecks in real-time, and apply automated workload rebalancing.</p>
                            <div class="flex items-center gap-1" style="font-size: 0.78rem; color: var(--color-champagne); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                                Open AI Laundry Manager →
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Book A Service Banner -->
            <section class="section-editorial" style="background-color: var(--color-warm-ivory); text-align: center;">
                <div class="container" style="max-width: 780px;">
                    <span class="eyebrow">BESPOKE WARDROBE CONCIERGE</span>
                    <h2 style="margin-bottom: 1.25rem;">Preserve what you wear.</h2>
                    <p class="subtext-editorial" style="margin-bottom: 2.5rem;">
                        Experience the gold standard in intelligent garment curation. Seamless electric fleet pickup, transparent chain of custody, and fiber digital twins.
                    </p>
                    <button class="btn btn-primary" onclick="App.handleBookServiceClick()" style="padding: 1rem 2.5rem; font-size: 0.85rem;">BOOK A SERVICE</button>
                </div>
            </section>

            <!-- Footer -->
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-top">
                        <div>
                            <div style="margin-bottom: 1rem;">
                                <img src="/assets/images/lavera-logo.jpg" alt="LAVÉRA" style="width: 130px; height: auto; display: block;" />
                            </div>
                            <div style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-obsidian); margin-bottom: 0.5rem;">Care, Curated.</div>
                            <p style="font-size: 0.85rem; max-width: 320px;">Intelligent Garment Care. Treating garments as valuable objects rather than disposable laundry.</p>
                        </div>

                        <div>
                            <div class="indicator-title" style="margin-bottom: 1.25rem;">SERVICES</div>
                            <ul class="footer-links-list">
                                <li><a href="#" onclick="Store.setView('orders'); return false;">Delicate Care</a></li>
                                <li><a href="#" onclick="Store.setView('orders'); return false;">Bespoke Dry Clean</a></li>
                                <li><a href="#" onclick="Store.setView('orders'); return false;">Wash & Fold</a></li>
                                <li><a href="#" onclick="Store.setView('orders'); return false;">Express Turnaround</a></li>
                            </ul>
                        </div>

                        <div>
                            <div class="indicator-title" style="margin-bottom: 1.25rem;">INNOVATION</div>
                            <ul class="footer-links-list">
                                <li><a href="#" onclick="Store.setView('garment-dna'); return false;">Garment DNA™</a></li>
                                <li><a href="#" onclick="Store.setView('care-lab'); return false;">Virtual Care Lab</a></li>
                                <li><a href="#" onclick="Store.setView('find-garment'); return false;">Find My Garment</a></li>
                                <li><a href="#" onclick="Store.setView('ai-manager'); return false;">AI Operations</a></li>
                            </ul>
                        </div>

                        <div>
                            <div class="indicator-title" style="margin-bottom: 1.25rem;">ATELIER</div>
                            <ul class="footer-links-list">
                                <li><a href="#philosophy">The Philosophy</a></li>
                                <li><a href="#how-it-works">Sustainability Passport</a></li>
                                <li><a href="#" onclick="App.openLoginModal(); return false;">Client Sign In</a></li>
                                <li><a href="#" onclick="App.demoLogin('admin@lavera.com', 'Admin@123'); return false;">Operations Portal</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <div>© 2026 LAVÉRA Care Systems. All rights reserved.</div>
                        <div class="flex gap-3">
                            <a href="#">Privacy Protocol</a>
                            <a href="#">Terms of Stewardship</a>
                            <a href="#">Chain of Custody Verification</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        `;
    }
};

window.LandingView = LandingView;
