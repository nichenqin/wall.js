export const throwNewError = p => { throw new Error(`${p} is required`); };

export const toArray = o => Array.prototype.slice.call(o);

export const merge = (targetObj, obj) => {
  Object.keys(obj).forEach(key => {
    targetObj[key] = obj[key];
  });
  return targetObj;
};

const hasClass = (el, className) => {
  if (el.classList) return el.classList.contains(className);
  else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

export const addClass = (el, className) => {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
};

export const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className);
  }
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
};
