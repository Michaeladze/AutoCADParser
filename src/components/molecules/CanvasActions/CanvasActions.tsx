import React from 'react';
import './CanvasActions.scss';
import { Button } from 'root-front';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { ISchema } from '../../../types/types';


interface IProps {
  schema: ISchema;
}

const CanvasActions: React.FC<IProps> = ({ schema }: IProps) => {

  return (
    <div className='canvas-actions'>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiPlus size={24} onClick={() => schema.zoom(1)}/>
        </Button>
      </div>
      <div className='canvas-actions__button'>
        <Button buttonType='round'>
          <BiMinus size={24} onClick={() => schema.zoom(-1)}/>
        </Button>
      </div>
    </div>
  );
};

export default CanvasActions;
