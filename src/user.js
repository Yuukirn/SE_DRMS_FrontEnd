import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        id: '',
        token:''
      }
    }
    }, 
    actions: {   //此方法设置用户的各种信息
      setUser(user) {
        this.user = user  
      }
    }
  }
)
