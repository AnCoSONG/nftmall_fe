import { defineStore } from 'pinia'

export const useStore = defineStore('app', {
    state: () => {
        return {
            title: '晋元数藏',
        }
    }
  })