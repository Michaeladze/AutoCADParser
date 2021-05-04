import React from 'react';
import './Home.scss';
import { Input } from 'root-front';
import Calendar from '../../molecules/Calendar';
import Colleagues from '../../molecules/Colleagues';
import History from '../../molecules/History';

const Home: React.FC = () => {

  return (
    <div className='rm-home'>
      <h2 className='rm-home__title'>Бронирование рабочих мест</h2>
      <Input placeholder='Искать коллег, номер места' search/>
      <div className='rm-home__block'>
        <Calendar/>
      </div>
      <div className='rm-home__block'>
        <Colleagues/>
      </div>
      <div className='rm-home__block'>
        <History/>
      </div>
    </div>
  );
};

export default Home;
