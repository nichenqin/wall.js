const easing = {};

easing.linear = (t, b, c, d) => c * t / d + b;

easing.easeIn = (t, b, c, d) => {
  t /= d;
  return c * t * t + b;
};

easing.easeOut = (t, b, c, d) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

easing.easeInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

module.exports = easing;