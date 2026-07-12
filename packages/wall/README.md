# wall.js

Core fullpage piling library. See the [repo README](../../README.md) and [docs/API.md](../../docs/API.md).

```bash
pnpm add wall.js
```

```js
import { Wall } from 'wall.js'

const wall = new Wall('#wall', { duration: 700 })
wall.on('change', ({ to }) => console.log(to))
```

For React, use [`@wall.js/react`](../wall-react).
