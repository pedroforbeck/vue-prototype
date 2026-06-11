import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const volume = ref(100)
  const localAudioEl = ref(null)
  const initWebAudio = ref(null)
  
  const playlist = ref([
    { type: 'youtube', id: 'jNQXAC9IVRw', title: 'Welcome to WinWeb' }
  ])
  const currentIndex = ref(0)
  
  const currentTrack = computed(() => playlist.value[currentIndex.value] || null)

  const skin = ref({
    main: null,
    titlebar: null,
    cbuttons: null,
    eqmain: null,
    volume: null
  })

  const isEqVisible = ref(true)
  const isMilkdropVisible = ref(true)
  const audioCtx = ref(null)
  const sourceNode = ref(null)
  const audioData = ref(new Uint8Array(128))
  const eqBands = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // 10 bandas de -12 a 12 db

  function play() {
    isPlaying.value = true
    if (initWebAudio.value) {
      initWebAudio.value();
    }
    if (currentTrack.value?.type === 'local' && localAudioEl.value) {
      // Se a música mudou, atualiza o src de forma síncrona antes de tocar!
      if (!localAudioEl.value.src.endsWith(currentTrack.value.url)) {
        localAudioEl.value.src = currentTrack.value.url;
        localAudioEl.value.load();
      }
      localAudioEl.value.play().catch(e => console.error(e));
    } else if (localAudioEl.value) {
      localAudioEl.value.pause();
    }
  }

  function pause() {
    isPlaying.value = false
    if (localAudioEl.value) {
      localAudioEl.value.pause();
    }
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
    playlist.value.push({ type: 'local', url, title: file.name, fileRef: file });
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
    isEqVisible, isMilkdropVisible, audioData, eqBands,
    play, pause, nextTrack, prevTrack, 
    addYoutubeUrl, addLocalAudio, 
    setSkin,
    audioCtx,
    sourceNode,
    localAudioEl,
    initWebAudio
  }
})
