import { scrollTouchBottom, scrollTouchTop, touchEvent } from '../dom';

const handleTouch = (el, context) => {

  const start = { X: 0, Y: 0 };
  const end = { X: 0, Y: 0 };

  const handleTouchStart = e => {
    const touch = e.touches ? e.touches[0] : e;
    start.X = touch.pageX;
    start.Y = touch.pageY;
  };

  const handleTouchMove = e => {
    if (context.isAnimating) return;

    const touch = e.touches ? e.touches[0] : e;
    end.X = touch.pageX;
    end.Y = touch.pageY;
    const diffX = start.X - end.X;
    const diffY = start.Y - end.Y;

    const isVertical = Math.abs(diffY) - Math.abs(diffX) > 0;

    if (isVertical) {
      if (diffY > 200 && scrollTouchBottom(el)) return context.nextSection();
      if (diffY > -200 && diffY < 0 && scrollTouchTop(el)) return context.prevSection();
    } else {
      if (context.currentSlide) {
        if (diffX > 200) return context.nextSlide();
        if (diffX > -200 && diffX < 0) return context.prevSlide();
      }
    }
  };

  el.addEventListener(touchEvent.touchStart, handleTouchStart, false);
  el.addEventListener(touchEvent.touchMove, handleTouchMove, false);
};

export default handleTouch;
