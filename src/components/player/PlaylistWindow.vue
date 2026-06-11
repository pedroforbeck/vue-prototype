<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';
import { useDesktopStore } from '../../stores/desktopStore';

const playerStore = usePlayerStore();
const desktopStore = useDesktopStore();

const playTrack = (index) => {
  playerStore.currentIndex = index;
  playerStore.play();
};

const handleTouchPlay = (index, e) => {
  if (e.pointerType === 'touch') {
    playTrack(index);
  }
};

const playlistStyle = computed(() => {
  const s = playerStore.skin;
  return {
    '--skin-pledit': s.pledit ? `url(${s.pledit})` : (s.main ? `url(${s.main})` : 'none'),
  };
});

const promptAddYoutube = () => {
  const url = window.prompt("Cole o link do YouTube para adicionar à fila:");
  if (url) {
    playerStore.addYoutubeUrl(url);
  }
};
</script>

<template>
  <div class="playlist-window" :style="playlistStyle">
    <div class="pl-title-bar-area" @mousedown="desktopStore.focusWindow('winamp')">
      <!-- Texto do título -->
      <div class="pl-title-text">WINAMP PLAYLIST</div>
    </div>
    
    <div class="pl-content">
      <div 
        v-for="(track, index) in playerStore.playlist" 
        :key="index"
        class="pl-track"
        :class="{ active: playerStore.currentIndex === index }"
        @click="playerStore.currentIndex = index"
        @dblclick="playTrack(index)"
        @pointerup="handleTouchPlay(index, $event)"
      >
        {{ index + 1 }}. {{ track.title }}
      </div>
    </div>
    
    <div class="pl-bottom-bar">
      <button class="pl-btn" @click="promptAddYoutube">ADD</button>
      <button class="pl-btn">REM</button>
      <button class="pl-btn">SEL</button>
      <button class="pl-btn">MISC</button>
    </div>
  </div>
</template>

<style scoped>
.playlist-window {
  width: 275px;
  height: 116px; /* Can be taller, but let's keep it compact like EQ */
  background-color: #000;
  background-image: var(--skin-pledit);
  background-size: cover;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  image-rendering: pixelated;
  box-sizing: border-box;
}

.pl-title-bar-area {
  height: 14px;
  background: linear-gradient(to right, #000080, #1084d0);
  cursor: grab;
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.pl-title-bar-area:active {
  cursor: grabbing;
}

.pl-title-text {
  font-family: sans-serif;
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.pl-content {
  flex-grow: 1;
  background-color: #000;
  padding: 4px;
  overflow-y: auto;
  border: 2px inset #333;
  margin: 2px;
}

.pl-content::-webkit-scrollbar {
  width: 8px;
}

.pl-content::-webkit-scrollbar-track {
  background: #111;
  border-left: 1px solid #333;
}

.pl-content::-webkit-scrollbar-thumb {
  background: #333;
  border: 1px outset #555;
}

.pl-track {
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: #00ff00;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pl-track:hover {
  background-color: #111;
}

.pl-track.active {
  background-color: #000080;
  color: #fff;
}

.pl-bottom-bar {
  display: flex;
  gap: 2px;
  padding: 2px;
  background-color: #111;
}

.pl-btn {
  background: #333;
  border: 1px outset #555;
  color: #ccc;
  font-family: sans-serif;
  font-size: 9px;
  cursor: pointer;
  padding: 1px 4px;
}

.pl-btn:active {
  border: 1px inset #555;
}
</style>
