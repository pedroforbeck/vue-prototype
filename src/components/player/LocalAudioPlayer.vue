<script setup>
import { ref, watch, computed } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';

const playerStore = usePlayerStore();
const audioRef = ref(null);

const isLocalTrack = computed(() => playerStore.currentTrack?.type === 'local');

watch(() => playerStore.isPlaying, (playing) => {
  if (!audioRef.value) return;
  if (playing && isLocalTrack.value) {
    audioRef.value.play();
  } else {
    audioRef.value.pause();
  }
});

watch(() => playerStore.currentTrack, (newTrack) => {
  if (!audioRef.value) return;
  if (newTrack && newTrack.type === 'local') {
    audioRef.value.src = newTrack.url;
    audioRef.value.load();
    if (playerStore.isPlaying) {
      audioRef.value.play();
    }
  } else {
    audioRef.value.pause();
  }
});

const onEnded = () => {
  playerStore.isPlaying = false;
  playerStore.nextTrack();
};

const onPlay = () => {
  if (isLocalTrack.value) playerStore.isPlaying = true;
};
const onPause = () => {
  if (isLocalTrack.value) playerStore.isPlaying = false;
};
</script>

<template>
  <audio 
    ref="audioRef" 
    @ended="onEnded"
    @play="onPlay"
    @pause="onPause"
    style="display: none;"
  ></audio>
</template>
