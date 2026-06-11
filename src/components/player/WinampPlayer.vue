<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDraggable, useWindowSize } from '@vueuse/core';
import { usePlayerStore } from '../../stores/playerStore';
import { useDesktopStore } from '../../stores/desktopStore';
import { useSkinLoader } from '../../composables/useSkinLoader';
import YouTubePlayer from './YouTubePlayer.vue';
import LocalAudioPlayer from './LocalAudioPlayer.vue';
import EqualizerWindow from './EqualizerWindow.vue';
import PlaylistWindow from './PlaylistWindow.vue';

const playerStore = usePlayerStore();
const desktopStore = useDesktopStore();
const { parseSkin } = useSkinLoader();

const winampState = computed(() => desktopStore.windows.find(w => w.id === 'winamp'));

onMounted(async () => {
  if (!playerStore.skin.main) {
    try {
      const response = await fetch('/base-2.91.wsz');
      const blob = await response.blob();
      const skinData = await parseSkin(blob);
      if (skinData) {
        playerStore.setSkin(skinData);
      }
    } catch (err) {
      console.error('Falha ao carregar skin padrão:', err);
    }
  }
});

const playerRef = ref(null);
const dragHandleRef = ref(null);
const { width: winWidth, height: winHeight } = useWindowSize();

const { x, y } = useDraggable(playerRef, {
  initialValue: { 
    x: Math.max(0, (window.innerWidth - 275) / 2), 
    y: Math.max(20, (window.innerHeight - 271) / 2) 
  },
  handle: dragHandleRef
});

const playerStyle = computed(() => {
  const clampedX = Math.max(0, Math.min(x.value, winWidth.value - 275));
  const clampedY = Math.max(0, Math.min(y.value, winHeight.value - 116 - 30));
  return {
    left: `${clampedX}px`,
    top: `${clampedY}px`,
  };
});

const handleDrop = async (e) => {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  
  if (file.name.endsWith('.wsz') || file.name.endsWith('.zip')) {
    const skinData = await parseSkin(file);
    if (skinData) {
      playerStore.setSkin(skinData);
    }
    return;
  }
  
  if (file.type.startsWith('audio/')) {
    playerStore.addLocalAudio(file);
    playerStore.play();
  }
};

const trackDisplay = computed(() => {
  const track = playerStore.currentTrack;
  return track ? track.title : 'WINAMP - ARRASTE UMA MÚSICA OU TEMA';
});

const skinVars = computed(() => {
  const s = playerStore.skin;
  return {
    '--skin-main': s.main ? `url(${s.main})` : 'none',
    '--skin-cbuttons': s.cbuttons ? `url(${s.cbuttons})` : 'none',
  };
});
</script>

<template>
  <div 
    class="draggable-wrapper" 
    ref="playerRef" 
    :style="[playerStyle, { zIndex: winampState?.zIndex || 10 }]"
    v-show="winampState?.isOpen && !winampState?.isMinimized"
    @mousedown="desktopStore.focusWindow('winamp')"
  >
    <div class="player-scaler">
      <!-- Motores de Áudio -->
      <YouTubePlayer />
      <LocalAudioPlayer />

      <!-- Janela Principal do Winamp -->
      <div 
        class="winamp-main-window" 
        :style="skinVars"
        @dragover.prevent 
        @drop.prevent="handleDrop"
      >
        <!-- Barra de Título (Para arrastar) -->
        <div class="title-bar-area" ref="dragHandleRef"></div>
        
        <!-- Controles de janela invisíveis sobre a arte gráfica -->
        <div class="btn-min-area" @click.stop="desktopStore.toggleMinimize('winamp')"></div>
        <div class="btn-close-area" @click.stop="desktopStore.toggleWindow('winamp')"></div>
        
        <!-- Controles de reprodução usando Sprite -->
        <div class="transport-controls">
          <button class="sprite-btn btn-prev" @click="playerStore.prevTrack()"></button>
          <button class="sprite-btn btn-play" @click="playerStore.play()"></button>
          <button class="sprite-btn btn-pause" @click="playerStore.pause()"></button>
          <button class="sprite-btn btn-stop" @click="playerStore.pause()"></button>
          <button class="sprite-btn btn-next" @click="playerStore.nextTrack()"></button>
        </div>

        <!-- Sobreposição de Info da Faixa -->
        <div class="track-info-overlay">
          <div class="scrolling-text">{{ trackDisplay }}</div>
        </div>
      </div>
      
      <!-- Equalizador grudado logo abaixo -->
      <EqualizerWindow />
      <!-- Playlist grudada abaixo do EQ -->
      <PlaylistWindow />
    </div>
  </div>
</template>

<style scoped>
.draggable-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.player-scaler {
  transform: scale(1.4);
  transform-origin: top left;
  display: flex;
  flex-direction: column;
}

/* Strict 275x116 window */
.winamp-main-window {
  width: 275px;
  height: 116px;
  background-image: var(--skin-main);
  background-position: top left;
  background-repeat: no-repeat;
  position: relative;
  image-rendering: pixelated;
  /* Se não tiver skin, pinta de preto pra debug */
  background-color: #000;
}

/* Titlebar grabbable area */
.title-bar-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 14px;
  cursor: grab;
}

.title-bar-area:active {
  cursor: grabbing;
}

/* Window controls (invisible over the main.bmp graphics) */
.btn-min-area {
  position: absolute;
  top: 3px;
  right: 18px;
  width: 9px;
  height: 9px;
  cursor: pointer;
}

.btn-close-area {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 9px;
  height: 9px;
  cursor: pointer;
}

/* Transport Controls positioning */
.transport-controls {
  position: absolute;
  top: 88px;
  left: 16px;
  display: flex;
  gap: 0;
}

.sprite-btn {
  background-image: var(--skin-cbuttons);
  background-repeat: no-repeat;
  height: 18px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
  outline: none;
}

.btn-prev { width: 23px; background-position: 0 0; }
.btn-prev:active { background-position: 0 -18px; }

.btn-play { width: 23px; background-position: -23px 0; }
.btn-play:active { background-position: -23px -18px; }

.btn-pause { width: 23px; background-position: -46px 0; }
.btn-pause:active { background-position: -46px -18px; }

.btn-stop { width: 23px; background-position: -69px 0; }
.btn-stop:active { background-position: -69px -18px; }

.btn-next { width: 22px; background-position: -92px 0; }
.btn-next:active { background-position: -92px -18px; }

/* Track Info Text */
.track-info-overlay {
  position: absolute;
  top: 25px;
  left: 112px;
  width: 153px;
  height: 14px;
  background-color: transparent;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.scrolling-text {
  font-family: 'VT323', monospace;
  font-size: 13px; /* Smaller font as requested */
  color: #00ff00;
  white-space: nowrap;
  letter-spacing: 0px;
  text-transform: uppercase;
  display: inline-block;
  padding-left: 100%;
  animation: marquee 8s linear infinite;
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
</style>
