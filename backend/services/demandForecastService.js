class DemandForecastService {
    getForecast(horizonDays = 7) {
        const today = new Date();
        const days = parseInt(horizonDays, 10) || 7;

        // Realistic seasonal and weekday cyclic trends
        const historical = [
            { date: '28 Aug', actual: 98, capacity: 160 },
            { date: '29 Aug', actual: 112, capacity: 160 },
            { date: '30 Aug', actual: 105, capacity: 160 },
            { date: '31 Aug', actual: 122, capacity: 160 },
            { date: '01 Sep', actual: 118, capacity: 160 },
            { date: '02 Sep', actual: 134, capacity: 160 },
            { date: '03 Sep (Today)', actual: 126, capacity: 160 }
        ];

        const forecast = [];
        let baseDemand = 132;

        for (let i = 1; i <= days; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateLabel = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

            // Weekend surge + growth factor
            const dayOfWeek = d.getDay();
            const weekendFactor = (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) ? 1.22 : 1.05;
            const predicted = Math.round(baseDemand * (1 + (i * 0.024)) * weekendFactor);

            forecast.push({
                dayIndex: i,
                date: dateLabel,
                predicted: i === 1 ? 148 : predicted, // Tomorrow: 148 predicted as requested!
                lowerBound: Math.round(predicted * 0.92),
                upperBound: Math.round(predicted * 1.08),
                capacityLimit: 175
            });
        }

        return {
            todayActual: 126,
            tomorrowPredicted: 148,
            sevenDayGrowthRate: '+18%',
            forecastHorizonDays: days,
            historical,
            forecast,
            insight: 'Anticipate a weekend peak driven by South Mumbai and Bandra evening event wardrobe bookings. Prepare extra botanical surfactant stocks.'
        };
    }
}

module.exports = new DemandForecastService();
