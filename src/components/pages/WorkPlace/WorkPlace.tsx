import React from 'react';
import './WorkPlace.scss';
import InfoTable from '../../atoms/InfoTable';
import { Button, useLocation } from 'root-front';
import { IUser } from 'root-front/dist/types/projects.types';
import { BiChevronLeft } from 'react-icons/bi';
import { IOption } from 'root-front/dist/types';
import WorkPlaceUser from '../../atoms/WorkPlaceUser';
import { NavLink } from 'react-router-dom';
import { mockWorkplaces } from './mocks';

const WorkPlace: React.FC = () => {
  const { query } = useLocation();


  const users: IUser[] = mockWorkplaces[query.table]?.employees || [];
  const employeesJSX = users.map((u: IUser) => <WorkPlaceUser key={u.id} user={u} />);

  const options: IOption[] = [
    {
      label: 'Тип рабочего места',
      value: mockWorkplaces[query.table]?.type || ''
    },
    {
      label: 'Дни бронирования',
      value: 'Вторник, Пятница'
    }
  ];

  const disabled = mockWorkplaces[query.table]?.type === 'Стационарный' || (mockWorkplaces[query.table]?.type === 'Сдвоенный' && mockWorkplaces[query.table]?.employees.length === 2);

  return (
    <div className='rm-workplace'>
      <div className='rm-workplace__block'>
        <NavLink to={window.location.pathname} className='rm-workplace__back'>
          <BiChevronLeft size={24} className='rm-workplace__back-icon'/>
        </NavLink>
      </div>
      <div className='rm-workplace__block'>
        <h3 className='rm-workplace__label'>Номер рабочего места</h3>
        <p className='rm-workplace__value'>{query.number}</p>
      </div>

      <div className='rm-workplace__block'>
        <InfoTable options={options}/>
      </div>

      {
        !disabled && (
          <div className='rm-workplace__block'>
            <Button style={{ width: '100%' }}>Забронировать</Button>
          </div>
        )
      }

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
