export const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) { setTimeout(callback, 1000 / 60); };

export const throwNewError = p => { throw new Error(`${p} is required`); };

export const toArray = o => Array.prototype.slice.call(o);

export const transformElement = (el, transform) => {
  el.style.WebkitTransform = transform;
  el.style.MozTransform = transform;
  el.style.msTransform = transform;
  el.style.transform = transform;
};