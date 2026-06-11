<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';
import { useDesktopStore } from '../../stores/desktopStore';

const playerStore = usePlayerStore();
const desktopStore = useDesktopStore();

const eqStyle = computed(() => {
  const s = playerStore.skin;
  return {
    '--skin-eqmain': s.eqmain ? `url(${s.eqmain})` : 'none',
  };
});

const getThumbStyle = (val, maxVal) => {
  const percentage = Math.max(0, Math.min(1, val / maxVal));
  const bottom = percentage * 52; // 63px (trilha) - 11px (pino) = 52px de curso
  const s = playerStore.skin;
  return {
    bottom: `${bottom}px`,
    backgroundImage: s.eqmain ? `url(${s.eqmain})` : 'none',
    backgroundPosition: '0 -164px'
  };
};
</script>

<template>
  <div class="eq-window" :style="eqStyle" v-if="playerStore.isEqVisible">
    <!-- Area clicavel do titulo para focar -->
    <div class="eq-title-bar-area" @mousedown="desktopStore.focusWindow('winamp')"></div>
    <div class="btn-close-area" @click.stop="playerStore.isEqVisible = false"></div>
    
    <!-- PREAMP (Volume) -->
    <div class="preamp-container">
      <div class="slider-wrapper">
        <div class="eq-thumb-visual" :style="getThumbStyle(playerStore.volume, 100)"></div>
        <input 
          type="range" min="0" max="100" 
          v-model.number="playerStore.volume"
          class="eq-slider-invisible"
        />
      </div>
    </div>

    <!-- BANDAS DE FREQUÊNCIA -->
    <div class="eq-sliders">
      <div class="slider-wrapper" v-for="(val, index) in playerStore.eqBands" :key="index">
        <div class="eq-thumb-visual" :style="getThumbStyle(val + 12, 24)"></div>
        <input 
          type="range" 
          min="-12" 
          max="12" 
          v-model.number="playerStore.eqBands[index]"
          class="eq-slider-invisible"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.eq-window {
  width: 275px;
  height: 116px;
  background-color: #000;
  background-image: var(--skin-eqmain);
  background-position: top left;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  image-rendering: pixelated;
  margin-top: 0px; 
  box-sizing: border-box;
}

.eq-title-bar-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 14px;
  cursor: grab;
}

.eq-title-bar-area:active {
  cursor: grabbing;
}

.btn-close-area {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 9px;
  height: 9px;
  cursor: pointer;
}

.preamp-container {
  position: absolute;
  top: 38px;
  left: 21px;
}

.eq-sliders {
  display: flex;
  justify-content: flex-start;
  gap: 0;
  position: absolute;
  top: 38px;
  left: 78px;
}

.slider-wrapper {
  position: relative;
  width: 18px; 
  height: 63px;
  display: flex;
  justify-content: center;
}

.eq-slider-invisible {
  writing-mode: bt-lr; 
  -webkit-appearance: slider-vertical; 
  appearance: slider-vertical;
  width: 14px;
  height: 63px;
  cursor: pointer;
  background-color: transparent;
}

.eq-slider:active::-moz-range-thumb {
  background-position: 0 -176px;
}
</style>
