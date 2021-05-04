import React from 'react';
import './CanvasActions.scss';
import { Button } from 'root-front';
import { BiMinus, BiPlus } from 'react-icons/bi';


interface IProps {
  children?: any;
}

const CanvasActions: React.FC<IProps> = ({}: IProps) => {

  return (
    <div className='canvas-actions'>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiPlus size={24}/>
        </Button>
      </div>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiMinus size={24}/>
        </Button>
      </div>
    </div>
  );
};

export default CanvasActions;
