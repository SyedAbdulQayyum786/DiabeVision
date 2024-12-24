
import { atom } from 'recoil';


export const usernameState = atom({
  key: 'usernameState',  
  default: '',           
});

export const fullnameState = atom({
    key:'fullnameState',
    default: '',
})

export const dobstate = atom ({
  key:'dobstate',
  default: '',
})

export const emailstate = atom ({
  key:'emailstate',
  default: '',
})

export const phoneState = atom({
  key:'phoneState',
  default: '',
})

export const uidState = atom({
  key:'uidState',
  default: '',
})