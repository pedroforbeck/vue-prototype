<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';

const playerStore = usePlayerStore();

const eqStyle = computed(() => {
  const s = playerStore.skin;
  return {
    '--skin-eqmain': s.eqmain ? `url(${s.eqmain})` : 'none',
    '--skin-border': s.eqmain ? 'none' : '1px solid var(--winamp-border-light)'
  };
});

const frequencies = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];
</script>

<template>
  <div class="eq-window" :style="eqStyle" v-if="playerStore.isEqVisible">
    <!-- Barra de Título do EQ -->
    <div class="eq-title-bar">
      <div class="title-text">WINWEB EQUALIZER</div>
      <button class="btn-close" @click="playerStore.isEqVisible = false"></button>
    </div>
    
    <div class="eq-sliders">
      <div class="slider-wrapper" v-for="(val, index) in playerStore.eqBands" :key="index">
        <input 
          type="range" 
          min="-12" 
          max="12" 
          v-model.number="playerStore.eqBands[index]"
          class="eq-slider"
        />
        <div class="freq-label">{{ frequencies[index] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eq-window {
  width: 275px;
  height: 116px;
  background-color: var(--winamp-bg);
  background-image: var(--skin-eqmain);
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
  /* Gruda imediatamente abaixo da janela principal */
  margin-top: 0px; 
  box-sizing: border-box;
}

.eq-title-bar {
  height: 14px;
  background: linear-gradient(to right, #000080, #1084d0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
}

.title-text {
  font-family: sans-serif;
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.btn-close {
  width: 9px;
  height: 9px;
  background: #ccc;
  border: 1px outset #fff;
  cursor: pointer;
}

.eq-sliders {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: auto;
  margin-bottom: 5px;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
}

.eq-slider {
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  appearance: slider-vertical;
  width: 14px;
  height: 60px;
  background: transparent;
}

/* Custom thumb to look vaguely like Winamp sliders */
.eq-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 8px;
  width: 14px;
  background: #ccc;
  border: 1px outset #eee;
  cursor: pointer;
}

.freq-label {
  font-size: 10px;
  color: var(--winamp-text);
  margin-top: 2px;
}
</style>
