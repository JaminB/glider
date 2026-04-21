# glider

Conway's Game of Life rendered as a subtle canvas background animation. Live cells are connected by thin lines; the simulation evolves slowly, leaving fading trails.

**[Live demo →](https://jaminb.github.io/glider/)**

## Install

```bash
npm install glider
```

## Usage

```ts
import { init } from 'glider';

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
