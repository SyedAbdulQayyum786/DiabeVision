
import { atom } from 'recoil';


export const usernameState = atom({
  key: 'usernameState',  
  default: '',           
});

export const fullnameState = atom({
    key:'fullnameState',
    default: '',
})
