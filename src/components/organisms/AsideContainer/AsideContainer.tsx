import React from 'react';
import './AsideContainer.scss';
import { useLocation } from 'root-front';
import Home from '../../pages/Home';
import WorkPlace from '../../pages/WorkPlace';

const AsideContainer: React.FC = () => {
  const { query } = useLocation();

  return (
    <div className='aside-container'>
      {query.table ? <WorkPlace/> : <Home/> }
    </div>
  );
};

export default AsideContainer;
