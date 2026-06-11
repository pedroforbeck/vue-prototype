import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSkinStore = defineStore('skin', () => {
  const currentSkin = ref(null)
  
  function setSkin(skinInfo) {
    currentSkin.value = skinInfo
  }

  return { currentSkin, setSkin }
})
