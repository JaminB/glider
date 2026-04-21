# glider

[![npm](https://img.shields.io/npm/v/@jaminb/glider)](https://www.npmjs.com/package/@jaminb/glider)
[![license](https://img.shields.io/npm/l/@jaminb/glider)](https://github.com/JaminB/glider/blob/master/LICENSE)

Conway's Game of Life rendered as a subtle canvas background animation. Live cells are connected by thin lines; the simulation evolves slowly, leaving fading trails.

**[Live demo →](https://jaminb.github.io/glider/)** · **[npm →](https://www.npmjs.com/package/@jaminb/glider)**

## About the simulation

John Conway invented the Game of Life in 1970. It's a zero-player game — you set the initial state, then step back and watch. Conway reportedly found it mildly irritating that this became his most famous contribution to mathematics. That says something about what it is.

The rules are four sentences:

- A live cell with fewer than 2 neighbors dies. *(Loneliness.)*
- A live cell with 2 or 3 neighbors survives.
- A live cell with more than 3 neighbors dies. *(Overcrowding.)*
- A dead cell with exactly 3 neighbors becomes alive. *(Critical mass.)*

That's it. No hidden mechanics, no randomness after the seed. Those four rules applied simultaneously to every cell on an infinite grid, repeated forever.

What comes out the other side is unreasonable: stable structures, oscillators that pulse indefinitely, patterns that travel across the grid, patterns that generate *other* patterns, and eventually — with enough patience — Turing-complete computation. All of it from four if-statements.

The glider (what this package is named after) is the simplest moving pattern: five cells that slide one step diagonally every four generations. It was the first structure Conway's group found that could travel indefinitely, which is why it became the unofficial emblem of hacker culture.

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
