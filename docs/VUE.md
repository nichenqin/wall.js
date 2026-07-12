# `@wall.js/vue`

Vue 3 bindings for wall.js.

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
</script>

<template>
  <div style="height: 100dvh">
    <Wall
      ref="wallRef"
      :duration="700"
      @change="({ to }) => console.log(to)"
    >
      <WallSection>
        <h1>Hello</h1>
        <button type="button" @click="wallRef?.next()">Next</button>
      </WallSection>
      <WallSection>
        <WallSlide>A</WallSlide>
        <WallSlide>B</WallSlide>
      </WallSection>
    </Wall>
  </div>
</template>
```

## API

| | |
| --- | --- |
| Components | `Wall`, `WallSection`, `WallSlide` |
| Props | All core `WallOptions` + `remountKey` |
| Events | `change`, `slideChange`, `destroy` |
| Ref | `next`, `prev`, `goTo`, `instance`, … |
| Composables | `useWall()`, `useWallOptional()` |
