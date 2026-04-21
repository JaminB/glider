# glider

[![npm](https://img.shields.io/npm/v/@jaminb/glider)](https://www.npmjs.com/package/@jaminb/glider)
[![license](https://img.shields.io/npm/l/@jaminb/glider)](https://github.com/JaminB/glider/blob/master/LICENSE)

Conway's Game of Life rendered as a subtle canvas background animation. Live cells are connected by thin lines; the simulation evolves slowly, leaving fading trails.

**[Live demo →](https://jaminb.github.io/glider/)**

**[npm →](https://www.npmjs.com/package/@jaminb/glider)**

## About the simulation

John Conway invented the Game of Life in 1970, which sounds like a productivity tool and is the opposite. It's a zero-player game: you arrange some cells, hit go, and watch. Conway reportedly found it embarrassing that this became his most famous work. Understandable.

The rules fit on a napkin:

- Fewer than 2 live neighbors? The cell dies. *(Lonely.)*
- 2 or 3 live neighbors? It survives. *(Just right.)*
- More than 3 live neighbors? It dies. *(Too crowded.)*
- Dead cell with exactly 3 neighbors? It comes back. *(Democracy.)*

Four rules. No randomness after the seed, no exceptions. Applied to every cell simultaneously, forever.

From that you get stable structures, oscillators, things that move, things that build other things, and eventually full Turing-complete computation. People have built working CPUs in this thing. It's a lot.

The glider is the simplest pattern that moves: five cells that creep one step diagonally every four generations. Conway's group found it shortly after inventing the game. It's what this package is named after.

## Install

```bash
npm install @jaminb/glider
```

## Usage

```ts
import { init } from '@jaminb/glider';

const canvas = document.getElementById('bg') as HTMLCanvasElement;
const instance = init(canvas);

// stop later
instance.destroy();
```

Style the canvas to sit behind your content:

```css
canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.15;
}
```

## Configuration

All options are optional. Defaults shown.

| Option | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `16` | Pixel size of each GoL cell. Larger = fewer cells = calmer. |
| `generationInterval` | `number` | `8` | Frames between GoL steps. Higher = slower evolution. |
| `seedDensity` | `number` | `0.18` | Fraction of cells alive at seed. Range 0–1. |
| `reseedThreshold` | `number` | `0.04` | Population fraction below which the grid re-seeds. Range 0–1. |
| `fadeAlpha` | `number` | `0.22` | Alpha of the fade overlay each frame. Higher = shorter trails. |
| `lineAlpha` | `number` | `0.45` | Alpha of lines between live neighbors. |
| `dotAlpha` | `number` | `0.5` | Alpha of dots on isolated live cells. |
| `lineWidth` | `number` | `0.6` | Line width in px. |
| `dotRadius` | `number` | `0.8` | Dot radius in px. |
| `hueBase` | `number` | `210` | Base hue in degrees. |
| `hueRange` | `number` | `35` | How far hue drifts from `hueBase` in either direction. |
| `hueSpeed` | `number` | `0.004` | How fast the hue oscillates. |
| `backgroundColor` | `string` | `'#0a0a0a'` | Hex color used for the fade fill. Match your page background. |
| `saturation` | `number` | `60` | HSL saturation % of lines and dots. |
| `lightness` | `number` | `68` | HSL lightness % of lines and dots. |

```ts
init(canvas, {
  cellSize: 12,
  seedDensity: 0.25,
  hueBase: 160,      // green
  backgroundColor: '#000000',
});
```

## License

MIT
