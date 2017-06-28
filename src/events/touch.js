const start = { X: 0, Y: 0 };
let touched = false;

export const handleTouchStart = e => {
  touched = true;

  e.preventDefault();
  const touch = e.touches[0];
  start.X = +touch.pageX;
  start.Y = +touch.pageY;
};

export const handleTouchMove = e => {

};

export const handleTouchEnd = e => {
  e.preventDefault();
  touched = false;
};
