<script setup>
import { ref, computed } from 'vue';
import { useDraggable } from '@vueuse/core';
import { usePlayerStore } from '../../stores/playerStore';
import { useSkinLoader } from '../../composables/useSkinLoader';
import YouTubePlayer from './YouTubePlayer.vue';
import LocalAudioPlayer from './LocalAudioPlayer.vue';

const playerStore = usePlayerStore();
const { parseSkin } = useSkinLoader();

const playerRef = ref(null);
const dragHandleRef = ref(null);

const { x, y } = useDraggable(playerRef, {
  initialValue: { 
    x: Math.max(0, (window.innerWidth - 275) / 2), 
    y: Math.max(20, (window.innerHeight - 271) / 2) // 155 (YT) + 116 (Winamp) = 271px
  },
  handle: dragHandleRef
});

// Usando transform (GPU-accelerated) no lugar de left/top para acabar com a lentidão
const playerStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  left: '0px',
  top: '0px'
}));

const handleDrop = async (e) => {
  const file = e.dataTransfer.files[0];
  if (!file) return;

  if (file.name.endsWith('.wsz') || file.name.endsWith('.zip')) {
    const skinData = await parseSkin(file);
    if (skinData) {
      playerStore.setSkin(skinData);
    }
  } else if (file.name.endsWith('.mp3') || file.type.startsWith('audio/')) {
    playerStore.addLocalAudio(file);
  }
};

const trackDisplay = computed(() => {
  if (!playerStore.currentTrack) return 'WinWeb v1.0';
  const idx = playerStore.currentIndex + 1;
  const total = playerStore.playlist.length;
  return `[${idx}/${total}] ${playerStore.currentTrack.title}`;
});

const skinVars = computed(() => {
  const s = playerStore.skin;
  return {
    '--skin-main': s.main ? `url(${s.main})` : 'none',
    '--skin-titlebar': s.titlebar ? `url(${s.titlebar})` : 'none',
    '--skin-cbuttons': s.cbuttons ? `url(${s.cbuttons})` : 'none',
    '--skin-border': s.main ? 'none' : '1px solid var(--winamp-border-light)'
  };
});
</script>

<template>
  <div class="draggable-wrapper" ref="playerRef" :style="playerStyle">
    <div class="player-scaler">
      <!-- YouTube Player em cima -->
      <YouTubePlayer />
      <LocalAudioPlayer />

      <!-- Interface Principal do Winamp na parte inferior -->
    <div 
      class="winamp-window" 
      :style="skinVars"
      @dragover.prevent 
      @drop.prevent="handleDrop"
    >
      <!-- Barra de Título -->
      <div class="title-bar" ref="dragHandleRef">
        <div class="title-text">WINWEB</div>
        <div class="window-controls">
          <button class="btn-min"></button>
          <button class="btn-close"></button>
        </div>
      </div>
    
    <!-- Entrada de URL -->
    <div class="url-input-container">
      <input 
        type="text" 
        placeholder="Cole o link do YouTube aqui..." 
        @change="e => playerStore.loadYoutubeUrl(e.target.value)"
      />
    </div>

    <!-- Área Principal do Display -->
    <div class="main-display">
      <div class="time-display">00:00</div>
      <div class="track-info">{{ trackDisplay }}</div>
    </div>
    
    <!-- Área de Controles -->
    <div class="controls">
      <button class="btn prev" @click="playerStore.prevTrack()">|&lt;</button>
      <button class="btn play" @click="playerStore.play()">&gt;</button>
      <button class="btn pause" @click="playerStore.pause()">||</button>
      <button class="btn stop" @click="playerStore.pause()">[]</button>
      <button class="btn next" @click="playerStore.nextTrack()">&gt;|</button>
    </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.draggable-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0; /* Grudados um no outro */
}

.player-scaler {
  transform: scale(1.4);
  transform-origin: top left;
  display: flex;
  flex-direction: column;
}

.winamp-window {
  width: 275px;
  height: 116px;
  background-color: var(--winamp-bg);
  background-image: var(--skin-main);
  background-position: top left;
  border: var(--skin-border);
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
  background-image: var(--skin-titlebar);
  background-position: 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  cursor: grab;
  touch-action: none; /* Previne scroll da página ao arrastar no celular */
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
  gap: 0px;
  margin-top: auto;
  margin-bottom: 9px;
  margin-left: 10px;
}

.btn {
  background: #ccc;
  background-image: var(--skin-cbuttons);
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  width: 23px;
  height: 18px;
  text-indent: -9999px; /* Esconde o texto quando usa imagem */
  color: transparent;
}

.btn:active {
  transform: translateY(1px);
}

.btn.prev { background-position: 0px 0px; }
.btn.prev:active { background-position: 0px -18px; }

.btn.play { background-position: -23px 0px; }
.btn.play:active { background-position: -23px -18px; }

.btn.pause { background-position: -46px 0px; }
.btn.pause:active { background-position: -46px -18px; }

.btn.stop { background-position: -69px 0px; }
.btn.stop:active { background-position: -69px -18px; }

.btn.next { width: 22px; background-position: -92px 0px; }
.btn.next:active { background-position: -92px -18px; }

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
