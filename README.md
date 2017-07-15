# wall.js

![wall.js](https://raw.githubusercontent.com/nichenqin1001/wall.js/master/asserts/wall.png)

## Demo And Documentation

[Live Demo & Documentation](http://nichenqin.com/wall.js)

## Installation

```bash
npm install wall.js --save
yarn add wall.js
```

or

```html
<script src="https://unpkg.com/wall.js@0.10.1/dist/wall.min.js"></script>
```

## Get Start

```html
<body>
  <div id="wall">
    <section><!--content--></section>
    <section><!--content--></section>
    <section><!--content--></section>
    <section><!--content--></section>
    <section><!--content--></section>
    <section><!--content--></section>
  </div>
</body>

<script src="path/to/wall.min.js"></script>

<script>
  var wall = new Wall('#wall');
</script>
```

## API

```javascript
var wall = new Wall('#wall');

wall.prevSection(); // go to prev section;
wall.nextSection(); // go to next section;
wall.goToSection(1); // go to paticular section, param type is number

wall.prevSlide(); // go to prev slide if slides exists in current section
wall.nextSlide(); // go to next slide if slides exists in current section
```

## Custom Navigation

### Add data-wall-section-nav attribute to your own nav element

wall.js will add event listener and toggle active class of the navs.

```html
< !-- DON'T ADD THE NAV ELEMENT INSIDE THE WRAPPER -- >
<ul class="nav" data-wall-section-nav>
  <li>First</li>
  <li>Second</li>
</ul>
<div id="wall"> <!-- wrapper -->
  <section>First Section</section>
  <section>Second Section</section>
</div>
<ul class="dot" data-wall-section-nav>
  <li></li>
  <li></li>
</ul>
```

### style your nav elment in html and css file

Here is an example:

```css
.dot {
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
}

.dot>li {
  width: 16px;
  height: 16px;
  margin-bottom: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  box-sizing: border-box;
  list-style: none;
  cursor: pointer;
}

.dot>li.active,
.dot>li:hover {
  background-color: #fff;
}
```

### custom activc class

```javascript
var config = {
  sectionNavItemActiveClass: 'my-active-class'
}

var wall = new Wall('#wall',config);
```

## Slides

### Add data-wall-slide attribute to your HTMLElement

```html
<div id="wall">
  <!--other sections-->
  <section>
    <div data-wall-slide><!--slide content--></div> <!-- wall.js will create horizontal move slides -->
    <div data-wall-slide><!--slide content--></div>
  </section>
  <!--other sections-->
</div>
```

### add data-wall-slide-arrow attribute to your arrows

```html
<section>
  <div data-wall-slide><!--slide content--></div> <!-- wall.js will create horizontal move slides -->
  <div data-wall-slide><!--slide content--></div>
  <div data-wall-slide-arrow class="prev-slide"></div>
  <div data-wall-slide-arrow class="next-slide"></div>
</section>
```

Your should create and style the arrow yourself, wall.js helps arraw show above the slides

## lazyload

wall.js support lazy load images.

Just set the true image source to `data-wall-origin` attribute of the `<img>` tag.

```javascript
<section>
  <img src="./blank.png" alt="awesome" data-wall-origin="./awesome.png" />
</section>
```

The picture will be replaced with the true picture.

## Custom Animation Duration

### Add data-wall-animate-duration attribute to section

You can change animation duration to all secitons like this:

```javascript
var config = {
  sectionAnimateDuration: 3 // every section now move 3 seconds
}

var wall = new Wall('#wall',config);
```

or just change one of them like this:

```html
<div id="wall">
  <section><!--section content--></section>
  <section><!--section content--></section>
  <section><!--section content--></section>
  <section data-wall-animate-duration=3><!--section content--></section> <!--this seciton will move 3 seconds-->
  <section><!--section content--></section>
  <section><!--section content--></section>
</div>
```

of cause it works for slides

```html
<div id="wall">
  <!--other sections-->
  <section>
    <!--other slides-->
    <div data-wall-slide><!--slide content--></div>
    <div data-wall-slide data-wall-animate-duration=3><!--slide content--></div>
    <!--other slides-->
  </section>
  <!--other sections-->
</div>
```

## Class of Current Section/Slide

current section will be added current class

```html
<section class="section-1"><!--content--></section>
<section class="section-2"><!--content--></section>
<section class="section-3"><!--content--></section>
<section class="section-4"><!--content--></section>
<section class="section-5 current"><!--content--></section><!--current section-->
```

animating section will be added animating class

```html
<section class="section-1"><!--content--></section>
<section class="section-2"><!--content--></section>
<section class="section-3"><!--content--></section>
<section class="section-4"><!--content--></section>
<section class="section-5 animating current"><!--content--></section><!--if you animate this section-->
```

You can control animation like this:

```css
h1 {
  opacity: 0;
  transition: opacity .3s ease;
}

.current h1 {
  opacity: 1;
}
```

## Custom Configs

option | default | type | description
------ | ------- | ---- | -----------
wrapperZIndex | 1 | `number` | z-index style of wrapper
sectionAnimateDuration | 1 | `number` | duration of animation
easeFunction | 'easeIn' | `string` or `function` | ease function of animation
loopToBottom | false | `boolean` | whether loop from top to bottom
loopToTop | false | `boolean` | whether loop from  bottom to top
sectionNavItemActiveClass | 'active' | `string` | active class of custom nav item
currentClass | 'current' | `string` | class of current section or slide
animatingClass | 'animating' | `string` | class of current section or slide while animating

## LICENSE

MIT License

Copyright (c) 2017 倪晨钦

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
