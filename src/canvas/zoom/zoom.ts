import paper from 'paper';
import { mainDraw } from '../render';


export const globalZoom = () => paper.PaperScript.execute(`

      function onMouseUp() {
        window.isDragging = false;
      }
      function onMouseDrag(event) {
        window.isDragging = true;
        // ...update view center.
        paper.view.center = event.downPoint.subtract(event.point).add(paper.view.center);
      };
  
    canvas.addEventListener('wheel', (event) => {
     const oldZoom = paper.view.zoom;
     paper.mainDraw.zoom(event.deltaY/-Math.abs(event.deltaY))
     const newZoom = paper.view.zoom;
   

    const oldCenter = paper.view.center;
    // Update view position.
    //  const mousePosition = paper.view.viewToProject(new paper.Point(event.offsetX, event.offsetY));
    //  paper.view.center += (mousePosition - oldCenter) * (1 - (oldZoom / newZoom));
   

  }); 
 `, paper);

export const zoom = (factor: number) => {


  const ZOOM_FACTOR = 1.14;
  const oldZoom = paper.view.zoom;
  let newZoom;

  if (factor > 0) {
    newZoom = oldZoom * (ZOOM_FACTOR * factor);
  } else if (factor < 0) {
    newZoom = oldZoom / (ZOOM_FACTOR * Math.abs(factor));
  } else {
    newZoom = 1;
  }

  paper.view.zoom = newZoom;

  mainDraw.checkLayers(newZoom);
};
// const size = mainDraw.scale.scale(460);
