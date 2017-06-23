const testElement = document.createElement('div');

export const hasTransform3d =
  'WebkitPerspective' in testElement.style ||
  'MozPerspective' in testElement.style ||
  'msPerspective' in testElement.style ||
  'OPerspective' in testElement.style ||
  'perspective' in testElement.style;
