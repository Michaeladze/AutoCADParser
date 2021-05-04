import { usersMocks } from '../../molecules/Colleagues/users';

export const mockWorkplaces: any = {
  '4ccd-8f05-5186058b305f-00151fca': {
    type: 'Сдвоенный',
    employees: []
  },
  '4ccd-8f05-5186058b305f-00151fc4': {
    type: 'Сдвоенный',
    employees: [usersMocks[0]]
  },
  '4ccd-8f05-5186058b305f-00151fc6': {
    type: 'Стол стрима',
    employees: []
  },
  '4ccd-8f05-5186058b305f-00151fd8': {
    type: 'Стол стрима',
    employees: []
  },
  '4ccd-8f05-5186058b305f-00151fcc': {
    type: 'Сдвоенный',
    employees: [usersMocks[3], usersMocks[2]]
  },
  '4ccd-8f05-5186058b305f-00151fd2': {
    type: 'Стационарный',
    employees: [usersMocks[4]]
  }
};
