import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const volume = ref(100)
  
  const playlist = ref([
    { type: 'youtube', id: 'jNQXAC9IVRw', title: 'Welcome to WinWeb' }
  ])
  const currentIndex = ref(0)
  
  const currentTrack = computed(() => playlist.value[currentIndex.value] || null)

  const skin = ref({
    main: null,
    titlebar: null,
    cbuttons: null
  })

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function nextTrack() {
    if (currentIndex.value < playlist.value.length - 1) {
      currentIndex.value++;
      play();
    } else {
      pause();
    }
  }

  function prevTrack() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      play();
    }
  }

  function addYoutubeUrl(url) {
    if (!url) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      playlist.value.push({ type: 'youtube', id: match[2], title: `YouTube Video (${match[2]})` });
      if (!isPlaying.value) {
        currentIndex.value = playlist.value.length - 1;
        play();
      }
    }
  }

  function addLocalAudio(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    playlist.value.push({ type: 'local', url, title: file.name });
    if (!isPlaying.value) {
      currentIndex.value = playlist.value.length - 1;
      play();
    }
  }

  function setSkin(skinData) {
    if (skinData) {
      skin.value = { ...skin.value, ...skinData }
    }
  }

  return { 
    isPlaying, currentTime, volume, skin, 
    playlist, currentIndex, currentTrack,
    play, pause, nextTrack, prevTrack, 
    addYoutubeUrl, addLocalAudio, setSkin 
  }
})
