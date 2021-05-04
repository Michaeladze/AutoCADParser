import React, { useState } from 'react';
import './WorkPlaceUser.scss';
import { UserPhoto } from 'root-front';
import { BiInfoCircle } from 'react-icons/bi';
import { IUser } from 'root-front/dist/types/projects.types';
import { IOption } from 'root-front/dist/types';
import InfoTable from '../InfoTable';


interface IProps {
  user: IUser;
}

const WorkPlaceUser: React.FC<IProps> = ({ user }: IProps) => {

  const [show, setShow] = useState(false);

  const options: IOption[] = [
    {
      label: 'Командная роль',
      value: 'Дизайнер'
    },
    {
      label: 'Название стрима',
      value: 'HR-Платформа'
    },
    {
      label: 'Команда',
      value: 'Департамент технологического развития общебанковских системе'
    }
  ];

  const activeClass = show ? 'rm-workplace__employee-info--active' : '';

  return (
    <div key={user.id} className='rm-workplace__employee'>
      <div className='rm-workplace__employee-main'>
        <UserPhoto fullName={user.fullName} url={user.photo} radius='42px'/>
        <div className='rm-workplace__employee-details'>
          <p className='rm-workplace__employee-name'>{user.fullName}</p>
          <p className='rm-workplace__employee-dates'>Понедельник, Среда, Пятница</p>
        </div>
        <BiInfoCircle className={`rm-workplace__employee-info ${activeClass}`} size={24} onClick={() => setShow(!show)}/>
      </div>

      {
        show && (
          <div className='rm-workplace__employee-position'>
            <InfoTable options={options}/>
          </div>
        )
      }
    </div>
  );
};

export default WorkPlaceUser;
