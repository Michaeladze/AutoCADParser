import React from 'react';
import './InfoTable.scss';
import { IOption } from 'root-front/dist/types';


interface IProps {
  options: IOption[];
}

const InfoTable: React.FC<IProps> = ({ options }: IProps) => {

  const items = options.map((o: IOption, i: number) => {
    return (
      <div className='info-table__row' key={i}>
        <p className='info-table__label'>{o.label}</p>
        <p className='info-table__value'>{o.value}</p>
      </div>
    );
  });

  return (
    <div className='info-table'>
      {items}
    </div>
  );
};

export default InfoTable;
