/**
 * glider — Conway's Game of Life canvas background animation
 *
 * Renders a Conway's Game of Life simulation as thin connecting lines between
 * live neighboring cells on a fullscreen canvas. Designed as a subtle,
 * configurable background effect for dark-mode web pages.
 *
 * ─── Configuration ───────────────────────────────────────────────────────────
 *
 * cellSize            {number}   Pixel size of each GoL cell. Larger = fewer
 *                                cells = calmer animation. Default: 16
 *
 * generationInterval  {number}   Frames between each Game of Life generation
 *                                step. Higher = slower evolution. Default: 8
 *
 * seedDensity         {number}   Fraction of cells alive at initial seed and
 *                                after population collapse. Range 0–1.
 *                                Default: 0.18
 *
 * reseedThreshold     {number}   Population fraction below which the grid
 *                                automatically re-seeds itself. Range 0–1.
 *                                Default: 0.04
 *
 * fadeAlpha           {number}   Alpha of the background fill applied each
 *                                frame to fade old trails. Higher = faster
 *                                fade, shorter trails. Range 0–1. Default: 0.22
 *
 * lineAlpha           {number}   Alpha of lines drawn between live neighboring
 *                                cells. Range 0–1. Default: 0.45
 *
 * dotAlpha            {number}   Alpha of dots drawn on isolated live cells
 *                                (cells with no live neighbors). Range 0–1.
 *                                Default: 0.5
 *
 * lineWidth           {number}   Stroke width of neighbor connection lines
 *                                in pixels. Default: 0.6
 *
 * dotRadius           {number}   Radius of isolated live cell dots in pixels.
 *                                Default: 0.8
 *
 * hueBase             {number}   Base hue in degrees around which color
 *                                oscillates. Default: 210 (blue)
 *
 * hueRange            {number}   How far the hue drifts from hueBase in
 *                                either direction. Default: 35
 *
 * hueSpeed            {number}   How fast the hue oscillates. Higher = faster
 *                                color shift. Default: 0.004
 *
 * backgroundColor     {string}   CSS hex color used for the fade fill.
 *                                Should match your page background.
 *                                Default: '#0a0a0a'
 *
 * saturation          {number}   HSL saturation % applied to lines and dots.
 *                                Default: 60
 *
 * lightness           {number}   HSL lightness % applied to lines and dots.
 *                                Default: 68
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface GliderConfig {
  cellSize?: number;
  generationInterval?: number;
  seedDensity?: number;
  reseedThreshold?: number;
  fadeAlpha?: number;
  lineAlpha?: number;
  dotAlpha?: number;
  lineWidth?: number;
  dotRadius?: number;
  hueBase?: number;
  hueRange?: number;
  hueSpeed?: number;
  backgroundColor?: string;
  saturation?: number;
  lightness?: number;
}

const DEFAULTS: Required<GliderConfig> = {
  cellSize:           16,
  generationInterval: 8,
  seedDensity:        0.18,
  reseedThreshold:    0.04,
  fadeAlpha:          0.22,
  lineAlpha:          0.45,
  dotAlpha:           0.5,
  lineWidth:          0.6,
  dotRadius:          0.8,
  hueBase:            210,
  hueRange:           35,
  hueSpeed:           0.004,
  backgroundColor:    '#0a0a0a',
  saturation:         60,
  lightness:          68,
};

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const DRAW_OFFSETS: [number, number][] = [[1, 0], [0, 1], [1, 1], [1, -1]];

export class Glider {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cfg: Required<GliderConfig>;
  private cols = 0;
  private rows = 0;
  private grid: Uint8Array = new Uint8Array(0);
  private next: Uint8Array = new Uint8Array(0);
  private frame = 0;
  private hue: number;
  private t = 0;
  private raf = 0;
  private bgRgb: string;

  constructor(canvas: HTMLCanvasElement, config: GliderConfig = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cfg = { ...DEFAULTS, ...config };
    this.hue = this.cfg.hueBase;
    this.bgRgb = hexToRgb(this.cfg.backgroundColor);
    this.resize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  private onResize = () => this.resize();

  private resize() {
    const { cfg, canvas, ctx } = this;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.cols = Math.floor(canvas.width / cfg.cellSize);
    this.rows = Math.floor(canvas.height / cfg.cellSize);
    this.grid = new Uint8Array(this.cols * this.rows);
    this.next = new Uint8Array(this.cols * this.rows);
    this.seed();
    ctx.fillStyle = cfg.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private seed() {
    const { seedDensity } = this.cfg;
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.random() < seedDensity ? 1 : 0;
    }
  }

  private idx(col: number, row: number): number {
    return ((row + this.rows) % this.rows) * this.cols + ((col + this.cols) % this.cols);
  }

  private step() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let n = 0;
        for (const [dc, dr] of NEIGHBOR_OFFSETS) n += this.grid[this.idx(c + dc, r + dr)];
        const alive = this.grid[this.idx(c, r)];
        this.next[this.idx(c, r)] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }
    [this.grid, this.next] = [this.next, this.grid];

    const pop = this.grid.reduce((s, v) => s + v, 0);
    if (pop < this.cols * this.rows * this.cfg.reseedThreshold) this.seed();
  }

  private draw() {
    const { ctx, canvas, cfg } = this;
    const half = cfg.cellSize / 2;

    ctx.fillStyle = `rgba(${this.bgRgb},${cfg.fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.hue = cfg.hueBase + Math.sin(this.t) * cfg.hueRange;
    this.t += cfg.hueSpeed;

    const color = `hsla(${this.hue},${cfg.saturation}%,${cfg.lightness}%,`;
    ctx.lineWidth = cfg.lineWidth;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[this.idx(c, r)]) continue;

        const cx = c * cfg.cellSize + half;
        const cy = r * cfg.cellSize + half;

        for (const [dc, dr] of DRAW_OFFSETS) {
          if (this.grid[this.idx(c + dc, r + dr)]) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo((c + dc) * cfg.cellSize + half, (r + dr) * cfg.cellSize + half);
            ctx.strokeStyle = `${color}${cfg.lineAlpha})`;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(cx, cy, cfg.dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${cfg.dotAlpha})`;
        ctx.fill();
      }
    }
  }

  private loop() {
    this.frame++;
    if (this.frame % this.cfg.generationInterval === 0) this.step();
    this.draw();
    this.raf = requestAnimationFrame(() => this.loop());
  }

  /** Stop the animation and remove the resize listener. */
  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
  }
}

/**
 * Attach a Glider animation to a canvas element.
 *
 * @param canvas  The HTMLCanvasElement to render into.
 * @param config  Optional configuration. All fields have defaults.
 * @returns       The Glider instance. Call .destroy() to stop the animation.
 *
 * @example
 * const canvas = document.getElementById('bg') as HTMLCanvasElement;
 * const glider = init(canvas, { cellSize: 12, hueBase: 160 });
 * // later: glider.destroy();
 */
export function init(canvas: HTMLCanvasElement, config?: GliderConfig): Glider {
  return new Glider(canvas, config);
}

function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
