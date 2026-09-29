function evaluate(input) {
  const { revenue = 0, products = 0, workflows = 0 } = input || {};

  const score = revenue * 0.6 + products * 0.2 + workflows * 0.2;

  let tier = 'basic';
  if (score > 10000) tier = 'pro';
  if (score > 50000) tier = 'enterprise';

  return { score, tier };
}

module.exports = { evaluate };
