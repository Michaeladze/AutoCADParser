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
    // if(paper.view.zoom <1.3){
    //     project.layers[3].visible= false
    //     project.layers[4].visible= true
    //
    // }else{
    //       project.layers[3].visible= true
    //        project.layers[4].visible= false
    // }
    
    
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

  // if (paper.view.zoom < 1.3) {
  //   paper.projects[0].layers[3].visible = false;
  //   paper.projects[0].layers[4].visible = true;
  //
  // } else {
  //   paper.projects[0].layers[3].visible = true;
  //   paper.projects[0].layers[4].visible = false;
  // }

  paper.view.zoom = newZoom;
};
