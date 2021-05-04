import React from 'react';
import './Colleagues.scss';
import { usersMocks } from './users';
import { IUser } from 'root-front/dist/types/projects.types';
import { UserPhoto } from 'root-front';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {

}

const Colleagues: React.FC<IProps> = ({}: IProps) => {


  // -------------------------------------------------------------------------------------------------------------------

  const usersJSX = usersMocks.slice(0, 4).map((u: IUser) => (
    <div key={u.id} className='rm-colleagues__item'>
      <UserPhoto radius='58px' url={u.photo} fullName={u.fullName}/>
    </div>
  ) );

  return (
    <div className='rm-colleagues'>
      <h3 className='rm-colleagues__title'>Мои коллеги</h3>
      <div className='rm-colleagues__list'>
        {usersJSX}
      </div>
    </div>
  );
};

export default Colleagues;
