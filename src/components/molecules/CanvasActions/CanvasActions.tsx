import React from 'react';
import './CanvasActions.scss';
import { Button } from 'root-front';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { ISchema } from '../../../types/types';


interface IProps {
  schema: ISchema;
}

const CanvasActions: React.FC<IProps> = ({ schema }: IProps) => {

  const onClick = () => {

  };

  return (
    <div className='canvas-actions'>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiPlus size={24} onClick={() => schema.zoom(true)}/>
        </Button>
      </div>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiMinus size={24} onClick={() => schema.zoom(false)}/>
        </Button>
      </div>
    </div>
  );
};

export default CanvasActions;
