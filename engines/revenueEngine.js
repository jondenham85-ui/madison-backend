function analyzeRevenue(input) {
  const { daily = [], monthly = 0 } = input || {};

  const totalDaily = daily.reduce((sum, v) => sum + (v || 0), 0);
  const avgDaily = daily.length ? totalDaily / daily.length : 0;

  return {
    monthly,
    totalDaily,
    avgDaily
  };
}

module.exports = { analyzeRevenue };
