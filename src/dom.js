const testElement = document.createElement('div');

export const hasTransform3d =
  'WebkitPerspective' in testElement.style ||
  'MozPerspective' in testElement.style ||
  'msPerspective' in testElement.style ||
  'OPerspective' in testElement.style ||
  'perspective' in testElement.style;

export const transformProp = (() => {
  if (!('transform' in testElement.style)) {
    const vendors = ['Webkit', 'Moz', 'ms'];
    for (let vendor in vendors) {
      console.log(vendors[vendor]);
      if (vendors[vendor] + 'Transform' in testElement.style) {
        return vendors[vendor] + 'Transform';
      }
    }
  }

  return 'transform';
})();

export const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) { setTimeout(callback, 1000 / 60); };

export const cAF = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  function (id) { clearTimeout(id); };

export const getScreenWidth = () => {
  return window.innerWidth && document.documentElement.clientWidth ?
    Math.min(window.innerWidth, document.documentElement.clientWidth) :
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};

export const getScreenHeight = () => {
  return window.innerHeight && document.documentElement.clientHeight ?
    Math.min(window.innerHeight, document.documentElement.clientHeight) :
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
};