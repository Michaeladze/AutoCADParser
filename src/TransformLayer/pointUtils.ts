export type Point = { x: number; y: number }

export type ScaleOpts = {
  direction: 'up' | 'down'
  interval: number
}

export const ORIGIN = Object.freeze({ x: 0, y: 0 })
export const MIN_SCALE = 0.5
export const MAX_SCALE = 3

const sum = (a: Point, b: Point): Point => {
  if (!b) {
    return a;
  }
  return { x: a.x + b.x, y: a.y + b.y }
}

const diff = (a: Point, b: Point): Point => {
  if (!b) {
    return a;
  }
  return { x: a.x - b.x, y: a.y - b.y }
}

const scale = (p: Point, scale: number): Point => {
  return { x: p.x / scale, y: p.y / scale };
}

export default {
  sum, diff, scale
}
