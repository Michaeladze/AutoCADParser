import React, { ReactNode } from 'react';
import './AsideContainer.scss';
import { Input } from 'root-front';


interface IProps {
    children?: ReactNode | ReactNode[];
}

const AsideContainer: React.FC<IProps> = ({ children }: IProps) => {

  return (
    <div className='aside-container'>
      <h2 className='aside-container__title'>Бронирование рабочих мест</h2>
      <Input placeholder='Искать коллег, номер места' search/>
    </div>
  );
};

export default AsideContainer;
