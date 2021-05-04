import React from 'react';
import './Calendar.scss';
import { NewDatepicker } from 'root-front';

const Calendar: React.FC = () => {

  return (
    <div className='rm-calendar'>
      <h3 className='rm-calendar__title'>Выберите дни бронирования</h3>
      <NewDatepicker min={new Date()}/>
    </div>
  );
};

export default Calendar;
