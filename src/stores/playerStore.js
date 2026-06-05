import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const volume = ref(100)

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  return { isPlaying, currentTime, volume, play, pause }
})
