<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import DraggableWindow from '../desktop/DraggableWindow.vue';
import { usePlayerStore } from '../../stores/playerStore';
import { useDesktopStore } from '../../stores/desktopStore';

const playerStore = usePlayerStore();
const desktopStore = useDesktopStore();
const milkState = computed(() => desktopStore.windows.find(w => w.id === 'milkdrop'));

const canvasRef = ref(null);
let animationFrameId = null;

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Efeito de escurecimento gradual em vez de apagar tudo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  
  const data = playerStore.audioData;
  if (!data || data.length === 0 || !playerStore.isPlaying) {
    animationFrameId = requestAnimationFrame(draw);
    return;
  }
  
  const barWidth = Math.max(1, (width / (data.length / 2)));
  let cx = 0;
  
  for (let i = 0; i < data.length / 2; i++) {
    const barHeight = (data[i] / 255) * height;
    
    const r = Math.min(255, barHeight * 2.5);
    const g = 255 - (barHeight * 0.5);
    const b = 150 + (Math.sin(Date.now() / 1000) * 100); 
    
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(cx, height - barHeight, barWidth - 1, barHeight);
    
    // Desenhar o topo espelhado
    ctx.fillRect(cx, 0, barWidth - 1, barHeight * 0.3);
    
    cx += barWidth;
  }
  
  animationFrameId = requestAnimationFrame(draw);
};

onMounted(() => {
  draw();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <DraggableWindow windowId="milkdrop" title="Milkdrop Visualizer" icon="" :initialWidth="400" :initialHeight="300">
    <div class="milkdrop-container">
      <canvas ref="canvasRef" class="milkdrop-canvas" width="400" height="300"></canvas>
      <div v-if="!playerStore.isPlaying" class="milkdrop-overlay"></div>
    </div>
  </DraggableWindow>
</template>

<style scoped>
.milkdrop-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.milkdrop-canvas {
  width: 100%;
  height: 100%;
}

.milkdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
</style>
