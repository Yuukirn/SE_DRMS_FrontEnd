import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => {
    return {
        project:{
          id: '',
          name: '',
          description: ''
        }
    }
    }, 
    actions: {
      setProject(project) {
        this.project = project
      }
    }
  }
)
