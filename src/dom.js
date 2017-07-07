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
      if (vendors[vendor] + 'Transform' in testElement.style) {
        return vendors[vendor] + 'Transform';
      }
    }
  }
  return 'transform';
})();

export const mousewheelEvent = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

export const rAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) { setTimeout(callback, 1000 / 60); };

export const cAF =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  function (id) { clearTimeout(id); };

export const getScreenWidth = () =>
  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;


export const getScreenHeight = () =>
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export const maxScreen = el => {
  el.style.position = 'absolute';
  el.style.top = 0;
  el.style.right = 0;
  el.style.bottom = 0;
  el.style.left = 0;
};

export const isScrollable = ({ scrollHeight, clientHeight }) => clientHeight < scrollHeight;

export const scrollTouchBottom = ({ scrollTop, scrollHeight, clientHeight }) => scrollHeight - scrollTop <= clientHeight;

export const scrollTouchTop = screen => screen.scrollTop === 0;

export const touchEvent = {
  touchStart: 'touchstart',
  touchMove: 'touchmove'
};

if (window.navigator.msPointerEnabled) {
  touchEvent.touchStart = 'MSPointerDown';
  touchEvent.touchMove = 'MSPointerMove';
} else if (window.navigator.pointerEnabled) {
  touchEvent.touchStart = 'pointerdown';
  touchEvent.touchMove = 'pointermove';
}

