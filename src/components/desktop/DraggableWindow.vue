<script setup>
import { ref, computed } from 'vue';
import { useDraggable, useWindowSize } from '@vueuse/core';
import { useDesktopStore } from '../../stores/desktopStore';

const props = defineProps({
  windowId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Window'
  },
  icon: {
    type: String,
    default: ''
  },
  initialWidth: {
    type: Number,
    default: 400
  },
  initialHeight: {
    type: Number,
    default: 300
  }
});

const desktopStore = useDesktopStore();
const winState = computed(() => desktopStore.windows.find(w => w.id === props.windowId));

const windowRef = ref(null);
const dragHandleRef = ref(null);
const { width: winWidth, height: winHeight } = useWindowSize();

const { x, y } = useDraggable(windowRef, {
  initialValue: { 
    x: Math.max(0, (window.innerWidth - props.initialWidth) / 2 + Math.random() * 50), 
    y: Math.max(0, (window.innerHeight - props.initialHeight) / 2 + Math.random() * 50)
  },
  handle: dragHandleRef
});

const style = computed(() => {
  const currentWidth = Math.min(props.initialWidth, winWidth.value);
  const currentHeight = Math.min(props.initialHeight, winHeight.value - 30);
  const clampedX = Math.max(0, Math.min(x.value, winWidth.value - currentWidth));
  const clampedY = Math.max(0, Math.min(y.value, winHeight.value - currentHeight - 30));
  
  return {
    left: `${clampedX}px`,
    top: `${clampedY}px`,
    zIndex: winState.value?.zIndex || 10,
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    maxWidth: '100vw',
    maxHeight: 'calc(100dvh - 30px)'
  };
});
</script>

<template>
  <div 
    class="xp-window" 
    ref="windowRef" 
    :style="style"
    v-show="winState?.isOpen && !winState?.isMinimized"
    @mousedown="desktopStore.focusWindow(windowId)"
  >
    <div class="xp-titlebar" ref="dragHandleRef">
      <div class="xp-title">
        <span class="xp-icon" v-if="icon"><img :src="icon" /></span>
        {{ title }}
      </div>
      <div class="xp-controls">
        <button class="xp-btn min" @click.stop="desktopStore.toggleMinimize(windowId)"></button>
        <button class="xp-btn max"></button>
        <button class="xp-btn close" @click.stop="desktopStore.toggleWindow(windowId)"></button>
      </div>
    </div>
    
    <div class="xp-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.xp-window {
  position: absolute;
  background: #ECE9D8;
  border: 3px solid #0055EA;
  border-radius: 8px 8px 0 0;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Tahoma', sans-serif;
}

.xp-titlebar {
  background: linear-gradient(to bottom, #0058EE 0%, #3593FF 8%, #288EFF 40%, #127DFF 88%, #0366F0 100%);
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  cursor: default;
  user-select: none;
}

.xp-title {
  color: white;
  font-weight: bold;
  font-size: 13px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
}

.xp-icon {
  margin-right: 5px;
  display: flex;
  align-items: center;
}

.xp-icon img {
  width: 16px;
  height: 16px;
}

.xp-controls {
  display: flex;
  gap: 2px;
}

.xp-btn {
  width: 21px;
  height: 21px;
  border: 1px solid white;
  border-radius: 3px;
  background-color: #0055EA;
  cursor: pointer;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2);
}

.xp-btn:active {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
}

.xp-btn.close {
  background-color: #E36449;
}

.xp-btn.close::before, .xp-btn.close::after {
  content: '';
  position: absolute;
  top: 4px; left: 9px;
  width: 2px; height: 10px;
  background: white;
}
.xp-btn.close::before { transform: rotate(45deg); }
.xp-btn.close::after { transform: rotate(-45deg); }

.xp-btn.min::before {
  content: '';
  position: absolute;
  bottom: 5px; left: 5px;
  width: 8px; height: 2px;
  background: white;
}

.xp-btn.max::before {
  content: '';
  position: absolute;
  top: 4px; left: 4px;
  width: 10px; height: 10px;
  border: 2px solid white;
  border-top-width: 3px;
  box-sizing: border-box;
}

.xp-content {
  flex-grow: 1;
  background: white;
  border: 1px solid #7F9DB9;
  margin: 0;
  padding: 10px;
  overflow: auto;
}
</style>
