<script setup>
import { ref, computed } from 'vue';
import { useDraggable } from '@vueuse/core';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();

const playerRef = ref(null);
const dragHandleRef = ref(null);

const { x, y } = useDraggable(playerRef, {
  initialValue: { x: window.innerWidth / 2 - 137, y: window.innerHeight / 2 - 58 },
  handle: dragHandleRef
});

// Usando transform (GPU-accelerated) no lugar de left/top para acabar com a lentidão
const playerStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  left: '0px',
  top: '0px'
}));
</script>

<template>
  <div class="winamp-window" ref="playerRef" :style="playerStyle">
    <!-- Title Bar -->
    <div class="title-bar" ref="dragHandleRef">
      <div class="title-text">WINWEB</div>
      <div class="window-controls">
        <button class="btn-min"></button>
        <button class="btn-close"></button>
      </div>
    </div>
    
    <!-- URL Input -->
    <div class="url-input-container">
      <input 
        type="text" 
        placeholder="Cole o link do YouTube aqui..." 
        @change="e => playerStore.loadYoutubeUrl(e.target.value)"
      />
    </div>

    <!-- Main Display Area -->
    <div class="main-display">
      <div class="time-display">00:00</div>
      <div class="track-info">1. Welcome to WinWeb</div>
    </div>
    
    <!-- Controls Area -->
    <div class="controls">
      <button class="btn prev">|&lt;</button>
      <button class="btn play" @click="playerStore.play()">&gt;</button>
      <button class="btn pause" @click="playerStore.pause()">||</button>
      <button class="btn stop" @click="playerStore.pause()">[]</button>
      <button class="btn next">&gt;|</button>
    </div>
  </div>
</template>

<style scoped>
.winamp-window {
  position: absolute;
  width: 275px;
  height: 116px;
  background-color: var(--winamp-bg);
  border: 1px solid var(--winamp-border-light);
  box-shadow: 2px 2px 0 var(--winamp-border-dark), 
              inset 1px 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  padding: 2px;
  user-select: none;
  font-family: 'VT323', monospace;
  image-rendering: pixelated;
}

.title-bar {
  height: 14px;
  background: linear-gradient(to right, #000080, #1084d0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  cursor: grab;
}

.title-bar:active {
  cursor: grabbing;
}

.title-text {
  font-family: sans-serif;
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.window-controls {
  display: flex;
  gap: 2px;
}

.window-controls button {
  width: 9px;
  height: 9px;
  background: #ccc;
  border: 1px outset #fff;
  cursor: pointer;
}

.main-display {
  background-color: #000;
  border: 2px inset #555;
  margin: 5px 10px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
}

.time-display {
  color: var(--winamp-text);
  font-size: 24px;
  line-height: 1;
}

.track-info {
  color: var(--winamp-text);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: auto;
  margin-bottom: 5px;
}

.btn {
  background: #ccc;
  border: 2px outset #eee;
  color: black;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 6px;
  font-family: monospace;
}

.btn:active {
  border-style: inset;
}

.url-input-container {
  padding: 2px 5px;
}

.url-input-container input {
  width: 100%;
  background: #000;
  border: 1px inset #555;
  color: #0f0;
  font-family: 'VT323', monospace;
  font-size: 14px;
  padding: 2px;
  outline: none;
}

.url-input-container input::placeholder {
  color: #050;
}
</style>
