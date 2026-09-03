class CareRecommendationService {
    /**
     * Simulates care treatment outcome based on fabric thermodynamics and surfactant physics.
     */
    simulateTreatment(fabric = '100% Cotton', treatmentType = 'COLD_DELICATE') {
        const f = fabric.toLowerCase();
        const t = treatmentType.toUpperCase();

        const treatmentProfiles = {
            NORMAL_WASH: {
                label: 'Normal Wash (40°C Warm)',
                shrinkage: f.includes('wool') || f.includes('cashmere') ? 'HIGH' : f.includes('cotton') ? 'MEDIUM' : 'LOW',
                colorFading: 'MEDIUM',
                fabricStress: 'MEDIUM-HIGH',
                stainRemoval: 'HIGH (88%)',
                longevityImpact: '-14%',
                water: 62,
                energy: 1.6,
                cost: 240,
                suitable: !f.includes('silk') && !f.includes('cashmere')
            },
            DELICATE: {
                label: 'Delicate Cold Wash (24°C)',
                shrinkage: 'LOW',
                colorFading: 'VERY LOW',
                fabricStress: 'LOW',
                stainRemoval: 'GOOD (76%)',
                longevityImpact: '+8%',
                water: 48,
                energy: 0.9,
                cost: 290,
                suitable: true
            },
            COLD_WASH: {
                label: 'Eco Cold Surfactant (20°C)',
                shrinkage: 'VERY LOW',
                colorFading: 'VERY LOW',
                fabricStress: 'LOW',
                stainRemoval: 'MODERATE (70%)',
                longevityImpact: '+12%',
                water: 44,
                energy: 0.7,
                cost: 260,
                suitable: true
            },
            HIGH_TEMPERATURE: {
                label: 'High Temperature Sanitize (60°C)',
                shrinkage: f.includes('cotton') ? 'HIGH' : 'VERY HIGH',
                colorFading: 'HIGH',
                fabricStress: 'SEVERE',
                stainRemoval: 'MAXIMUM (96%)',
                longevityImpact: '-28%',
                water: 78,
                energy: 2.8,
                cost: 350,
                suitable: f.includes('linen') || f.includes('cotton-heavy')
            },
            DRY_CLEAN: {
                label: 'Bespoke Solvent Dry Clean',
                shrinkage: 'ZERO',
                colorFading: 'LOW',
                fabricStress: 'VERY LOW',
                stainRemoval: 'EXCELLENT for Lipids (92%)',
                longevityImpact: '+5%',
                water: 12,
                energy: 2.2,
                cost: 450,
                suitable: f.includes('wool') || f.includes('silk') || f.includes('tailored')
            },
            EXPRESS: {
                label: 'Rapid Express Cycle (30 mins)',
                shrinkage: 'MEDIUM',
                colorFading: 'MEDIUM',
                fabricStress: 'MEDIUM',
                stainRemoval: 'BASIC (65%)',
                longevityImpact: '-8%',
                water: 52,
                energy: 1.4,
                cost: 380,
                suitable: true
            },
            HAND_WASH: {
                label: 'Artisanal Basin Hand Wash',
                shrinkage: 'ZERO',
                colorFading: 'ZERO',
                fabricStress: 'NEGLIGIBLE',
                stainRemoval: 'MANUAL PRECISION (82%)',
                longevityImpact: '+16%',
                water: 32,
                energy: 0.3,
                cost: 520,
                suitable: f.includes('cashmere') || f.includes('silk') || f.includes('lace')
            }
        };

        const result = treatmentProfiles[t] || treatmentProfiles.DELICATE;
        return {
            treatmentType: t,
            ...result
        };
    }

    /**
     * Compares multiple treatments side-by-side and returns an AI Recommendation
     */
    compareTreatments(fabric = '100% Cotton', treatments = ['NORMAL_WASH', 'DELICATE', 'DRY_CLEAN']) {
        const comparisons = treatments.map(t => this.simulateTreatment(fabric, t));

        const f = fabric.toLowerCase();
        let aiRecommendation = 'Delicate cold washing is recommended because this garment has a high sensitivity to heat and moderate color-fading risk.';

        if (f.includes('cashmere') || f.includes('wool')) {
            aiRecommendation = 'Hand wash with botanical conditioning or gentle solvent dry clean is imperative. Mechanical spinning causes irreversible felting.';
        } else if (f.includes('silk')) {
            aiRecommendation = 'Delicate zero-agitation cold bath is recommended. Avoid thermal drying to preserve natural protein luster.';
        } else if (f.includes('linen')) {
            aiRecommendation = 'Cold gentle wash followed by damp steam pressing preserves natural flax luster while minimizing fiber brittleness.';
        }

        return {
            fabric,
            comparisons,
            aiRecommendation
        };
    }
}

module.exports = new CareRecommendationService();
