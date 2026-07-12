# `@wall.js/vue`

Vue 3 bindings for [wall.js](https://github.com/nichenqin/wall.js).

## Install

```bash
pnpm add wall.js @wall.js/vue
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Wall, WallSection, WallSlide, useWall } from '@wall.js/vue'

const wallRef = ref<InstanceType<typeof Wall> | null>(null)

function onChange(payload: { from: number; to: number; direction: string }) {
  console.log(payload)
}
</script>

<template>
  <div style="height: 100dvh">
    <Wall
      ref="wallRef"
      :duration="700"
      @change="onChange"
    >
      <WallSection>
        <h1>Hello</h1>
        <button type="button" @click="wallRef?.next()">Next</button>
      </WallSection>

      <WallSection>
        <Badge />
      </WallSection>

      <WallSection>
        <WallSlide>A</WallSlide>
        <WallSlide>B</WallSlide>
      </WallSection>
    </Wall>
  </div>
</template>
```

```vue
<script setup lang="ts">
import { useWall } from '@wall.js/vue'
const { wall, index } = useWall()
</script>

<template>
  <p>Section {{ index + 1 }}</p>
  <button type="button" @click="wall?.goTo(0)">Top</button>
</template>
```

## API

- Props: all core `WallOptions` + `remountKey`
- Events: `change`, `slideChange`, `destroy`
- Expose / ref: `next`, `prev`, `goTo`, `instance`, …
- `useWall()` / `useWallOptional()`
