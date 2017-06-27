export const linear = function (t, b, c, d) {
  return c * t / d + b;
};

export const easeIn = function (t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1)) + b;
};

export const easeOut = function (t, b, c, d) {
  return c * (-Math.pow(2, -10 * t / d) + 1) + b;
};

export const easeInOut = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};
