import React from 'react';
import './CanvasLegend.scss';


const CanvasLegend: React.FC = () => {

  const legendData = [
    {
      style: { background: '#3A85FF' },
      text: 'Стол вашего стрима'
    },
    {
      style: { background: '#00B7A9' },
      text: 'Ограниченный доступ'
    },
    {
      style: { background: '#B1B5BB' },
      text: 'Стол недоступен'
    }
  ];

  const legendJSX = legendData.map((item, i: number) => (
    <div className='canvas-legend__item' key={i}>
      <div className='canvas-legend__item-circle' style={item.style}/>
      <div className='canvas-legend__item-text'>{item.text}</div>
    </div>
  ));

  return (
    <div className='canvas-legend'>
      {legendJSX}
    </div>
  );
};

export default CanvasLegend;
