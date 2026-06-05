import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const volume = ref(100)
  // ID de um vídeo normal do YouTube para não dar erro de restrição de domínio
  const videoId = ref('jNQXAC9IVRw') 

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function loadYoutubeUrl(url) {
    if (!url) return;
    // Regex simples para capturar ID de vídeos do youtube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId.value = match[2];
      play(); // Auto-play após carregar
    }
  }

  return { isPlaying, currentTime, volume, videoId, play, pause, loadYoutubeUrl }
})
