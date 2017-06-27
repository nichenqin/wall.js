(function () {

  var wall = new Wall('#wall');
  console.log(wall);

  document.getElementById('prev').addEventListener('click', function () { wall.prevSection(); });
  document.getElementById('next').addEventListener('click', function () { wall.nextSection(); });
  document.querySelector('.prev-slide').addEventListener('click', function () { wall.prevSlide(); });
  document.querySelector('.next-slide').addEventListener('click', function () { wall.nextSlide(); });
}());
