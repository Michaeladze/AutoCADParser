import React from 'react';
import './WorkPlace.scss';
import InfoTable from '../../atoms/InfoTable';
import { Button } from 'root-front';
import { IUser } from 'root-front/dist/types/projects.types';
import { usersMocks } from '../../molecules/Colleagues/users';
import { BiChevronLeft } from 'react-icons/bi';
import { IOption } from 'root-front/dist/types';
import WorkPlaceUser from '../../atoms/WorkPlaceUser';
import { NavLink } from 'react-router-dom';

const WorkPlace: React.FC = () => {

  const employeesJSX = usersMocks.slice(0, 1).map((u: IUser) => <WorkPlaceUser key={u.id} user={u} />);

  const options: IOption[] = [
    {
      label: 'Тип рабочего места',
      value: 'Стационарное'
    },
    {
      label: 'Дни бронирования',
      value: 'Вторник, Пятница'
    }
  ];

  return (
    <div className='rm-workplace'>
      <div className='rm-workplace__block'>
        <NavLink to={window.location.pathname} className='rm-workplace__back'>
          <BiChevronLeft size={24} className='rm-workplace__back-icon'/>
        </NavLink>
      </div>
      <div className='rm-workplace__block'>
        <h3 className='rm-workplace__label'>Номер рабочего места</h3>
        <p className='rm-workplace__value'>31.31.10</p>
      </div>

      <div className='rm-workplace__block'>
        <InfoTable options={options}/>
      </div>

      <div className='rm-workplace__block'>
        <Button style={{ width: '100%' }}>Забронировать</Button>
      </div>

      {
        employeesJSX.length > 0 && (
          <div className='rm-workplace__block'>
            <h3 className='rm-workplace__label'>Закреплено за сотрудником</h3>
            <div className='rm-workplace__employees'>
              {employeesJSX}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default WorkPlace;
