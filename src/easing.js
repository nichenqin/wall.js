export const linear = function (t, b, c, d) {
  return c * t / d + b;
};

export const easeIn = function (t, b, c, d) {
  t /= d;
  return c * t * t + b;
};

export const easeOut = function (t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
};

export const easeInOut = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t * t + b;
  t -= 2;
  return -c / 2 * (t * t * t * t - 2) + b;
};
