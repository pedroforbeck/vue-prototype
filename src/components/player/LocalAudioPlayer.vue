<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';

const playerStore = usePlayerStore();
const audioRef = ref(null);

let audioContext = null;
let sourceNode = null;
let gainNode = null;
const eqNodes = [];

const isLocalTrack = computed(() => playerStore.currentTrack?.type === 'local');

onMounted(() => {
  playerStore.localAudioEl = audioRef.value;
  playerStore.initWebAudio = () => {
    if (!audioContext) initWebAudio();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };
});

watch(() => playerStore.volume, (newVol) => {
  if (gainNode) {
    gainNode.gain.value = newVol / 100;
  }
});

watch(() => playerStore.eqBands, (newBands) => {
  newBands.forEach((val, i) => {
    if (eqNodes[i]) eqNodes[i].gain.value = val;
  });
}, { deep: true });

function initWebAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  sourceNode = audioContext.createMediaElementSource(audioRef.value);
  playerStore.audioCtx = audioContext;
  playerStore.sourceNode = sourceNode;
  
  gainNode = audioContext.createGain();
  gainNode.gain.value = playerStore.volume / 100;

  const freqs = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
  
  let prevNode = sourceNode;
  
  freqs.forEach((freq, i) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1.41;
    filter.gain.value = playerStore.eqBands[i];
    
    prevNode.connect(filter);
    prevNode = filter;
    eqNodes.push(filter);
  });

  prevNode.connect(gainNode);
  
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  gainNode.connect(analyser);
  analyser.connect(audioContext.destination);

  const updateVisualizer = () => {
    if (playerStore.isPlaying && isLocalTrack.value) {
      analyser.getByteFrequencyData(playerStore.audioData);
    } else {
      playerStore.audioData.fill(0);
    }
    requestAnimationFrame(updateVisualizer);
  };
  updateVisualizer();
}

const onEnded = () => {
  playerStore.isPlaying = false;
  playerStore.nextTrack();
};

const onPlay = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  if (isLocalTrack.value) playerStore.isPlaying = true;
};
const onPause = () => {
  if (isLocalTrack.value) playerStore.isPlaying = false;
};
</script>

<template>
  <audio 
    ref="audioRef" 
    @timeupdate="playerStore.currentTime = audioRef.currentTime"
    @ended="playerStore.nextTrack()"
  ></audio>
</template>
