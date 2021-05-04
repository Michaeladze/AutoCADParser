import React from 'react';
import './History.scss';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {

}

const History: React.FC<IProps> = ({}: IProps) => {


  // -------------------------------------------------------------------------------------------------------------------

  return (
    <div className='rm-history'>
      <h3 className='rm-history__title'>История бронирований</h3>
      <p className='rm-history__empty'>У вас нет пока истории бронирования</p>
    </div>
  );
};

export default History;
