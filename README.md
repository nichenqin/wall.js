# wall.js

![wall.js](https://raw.githubusercontent.com/nichenqin1001/wall.js/master/asserts/wall.png)

## Demo And Documentation

[Live Demo & Documentation](http://nichenqin.com/wall.js)

## Installation

```bash
npm install wall.js --save
yarn add wall.js
```

## Get Start

```html
<body>
  <div class="wrapper">
    <section class="section-1"><h1>Section One</h1></section>
    <section class="section-2"><h1>Section Two</h1></section>
    <section class="section-3"><h1>Section Three</h1></section>
    <section class="section-4"><h1>Section Four</h1></section>
    <section class="section-5"><h1>Section Five</h1></section>
    <section class="section-6"><h1>Section Six</h1></section>
  </div>
</body>

<script src="path/to/Wall.min.js"></script>

<script>
  var wall = new Wall('.wrapper');
</script>
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
