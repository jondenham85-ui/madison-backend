function analyzeProducts(input) {
  const { products = [] } = input || {};
  const count = products.length;
  const active = products.filter(p => p && p.active).length;

  return {
    count,
    active,
    inactive: count - active
  };
}

module.exports = { analyzeProducts };
