import paper from 'paper';

export class SimplePanAndZoom {
  changeZoom(oldZoom: number, delta: number) {
    const factor = 1.05;

    if (delta < 0) {
      return oldZoom * factor;
    }

    if (delta > 0) {
      return oldZoom / factor;
    }

    return oldZoom;
  }

  changeCenter(oldCenter: any, deltaX:number, deltaY:number, factor: number) {
    let offset = new paper.Point(deltaX, -deltaY);
    offset = offset.multiply(factor);
    oldCenter.add(offset);
  }
}

// export class StableZoom  {
//   changeZoom(oldZoom: number, delta: number, c: any, p: any) {
//     const newZoom: number = super.changeZoom(oldZoom, delta);
//     const beta = oldZoom / newZoom
//     const pc = p.subtract(c);
//     const a = p.subtract(pc.multiply(beta)).subtract(c);
//     return [newZoom, a];
//   }
// }
