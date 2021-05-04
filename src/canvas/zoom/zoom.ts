import paper from 'paper';


/** Масштабирование */
export const globalZoom = () => paper.PaperScript.execute(`
      function onMouseUp() {
        window.isDragging = false;
      }
      function onMouseDrag(event) {
        window.isDragging = true;
        // ...update view center.
        paper.view.center = event.downPoint.subtract(event.point).add(paper.view.center);
      };
    const ZOOM_FACTOR = 1.14;
    canvas.addEventListener('wheel', (event) => {
    const oldZoom = paper.view.zoom;
    const oldCenter = paper.view.center;
    // Get mouse position.
    // It needs to be converted into project coordinates system.
    const mousePosition = paper.view.viewToProject(new paper.Point(event.offsetX, event.offsetY));
    // Update view zoom.
    const newZoom = event.deltaY > 0 ?
      oldZoom / ZOOM_FACTOR :
      oldZoom * ZOOM_FACTOR;
    paper.view.zoom = newZoom;

    // Update view position.
    paper.view.center += (mousePosition - oldCenter) * (1 - (oldZoom / newZoom));
  });
  `, paper);

export const zoom = (factor: number) => {
  const oldZoom = paper.view.zoom;
  const ZOOM_FACTOR = 1.14;
  let newZoom = oldZoom;

  if (factor > 0) {
    newZoom = oldZoom * (ZOOM_FACTOR * factor);
  } else if (factor < 0) {
    newZoom = oldZoom / (ZOOM_FACTOR * Math.abs(factor));
  } else {
    newZoom = 1;
  }

  paper.view.zoom = newZoom;
};
