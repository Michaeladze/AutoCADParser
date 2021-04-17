import * as d3 from 'd3';

export function init(dxf: any) {
  console.log(dxf);
  
  const CONTAINER_ID = 'stage';
  
  /** Container */
  const container = document.getElementById(CONTAINER_ID);
  
  /** Remove previous chart */
  if (container?.firstElementChild) {
    container.firstElementChild.remove();
  }
  
  /** Size constants */
  const containerPadding = 30;
  const margin = {
    top: 0,
    right: 30,
    bottom: 30,
    left: 30
  };
  const width =
    window.innerWidth -
    margin.left -
    margin.right -
    containerPadding;
  const height = window.innerHeight - margin.top - margin.bottom;
  
  // -----------------------------------------------------------------------------------------------------------------
  
  // /** Axis ranges */
  const x = d3.scaleLinear().range([0, width / 1.2]);
  const y = d3.scaleLinear().range([height / 1.2, 0]);
  
  const array = dxf.entities.reduce((acc: any[], e: any) => {
    if (e.vertices) {
      acc = [...acc, ...e.vertices];
    }
    return acc;
  }, [])
  
  const xDomain: any = [
    d3.min(array, (d: any) => d.x),
    d3.max(array, (d: any) => d.y)
  ];
  x.domain(xDomain);
  
  const yDomain: any = [
    d3.min(array, (d: any) => d.x),
    d3.max(array, (d: any) => d.y)
  ];
  y.domain(yDomain);
  
  // -----------------------------------------------------------------------------------------------------------------
  
  const finalWidth = width + margin.left + margin.right + containerPadding;
  const finalHeight = height + margin.top + margin.bottom;
  
  /** Plot */
  const svg = d3
    .select(`#${ CONTAINER_ID }`)
    .append('svg')
    .attr('id', 'chart')
    .attr('viewBox', `0 0 ${ finalWidth } ${ finalHeight }`)
    .append('g')
    .attr('transform', `translate(${ 50 }, ${ 50 })`);
  
  /** Line generator */
  const line = d3
    .line()
    .x((d: any) => {
      return x(d.x);
    })
    .y((d: any) => {
      return y(d.y)
    });
  
  
  dxf.entities.forEach((entity: any) => {

      if (entity.type === 'INSERT') {
        const block = dxf.blocks[entity.name];
        if (block && block.entities) {
          block.entities.forEach((blockEntity: any) => {
            if (blockEntity.vertices) {
              drawLine(blockEntity.vertices, entity.position, svg, line);
            }
          })
        }
      }

      if (entity.type === 'LINE' || entity.type === 'LWPOLYLINE') {
        if (entity.layer !== 'Основные надписи' && entity.vertices) {
          drawLine(entity.vertices, { x: 0, y: 0 }, svg, line);
        }
      }
    }
  )
}

function drawLine(data: any, position: any, svg: any, line: any) {
  const result = data.map((v: any) => ({
    x: v.x + position.x,
    y: v.y + position.y,
  }))
  
  svg
    .append('path')
    .data([result])
    .attr('class', 'line')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')
    .attr('fill', 'transparent')
    .attr('d', line);
}
