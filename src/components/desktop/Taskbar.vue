<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useDesktopStore } from '../../stores/desktopStore';

const desktopStore = useDesktopStore();

const time = ref('');

const updateTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  time.value = hours + ':' + minutes + ' ' + ampm;
};

let timer;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="xp-taskbar">
    <div class="start-button">
      <div class="start-logo">
        <svg viewBox="0 0 100 100" class="windows-logo">
          <path d="M0 15 L45 9 L45 47 L0 47 Z" fill="#E65E24"/>
          <path d="M50 8 L100 0 L100 46 L50 47 Z" fill="#81A827"/>
          <path d="M0 52 L45 52 L45 90 L0 84 Z" fill="#0E80B4"/>
          <path d="M50 52 L100 53 L100 99 L50 91 Z" fill="#F1C000"/>
        </svg>
      </div>
      <span class="start-text">start</span>
    </div>
    
    <div class="taskbar-items">
      <div 
        v-for="win in desktopStore.windows" 
        :key="win.id"
        v-show="win.isOpen"
        class="taskbar-item"
        :class="{ active: desktopStore.activeWindowId === win.id && !win.isMinimized }"
        @click="desktopStore.toggleWindow(win.id)"
      >
        <span class="icon">
          <img v-if="win.icon.startsWith('http') || win.icon.startsWith('/')" :src="win.icon" width="14" />
          <template v-else>{{ win.icon }}</template>
        </span>
        <span class="title">{{ win.title }}</span>
      </div>
    </div>
    
    <div class="system-tray">
      <div class="time-container" style="display: flex; gap: 6px;">
        <span class="time">{{ time }}</span>
        <span class="year">2004</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xp-taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #333 100%);
  display: flex;
  align-items: center;
  z-index: 9999;
  user-select: none;
  font-family: 'Tahoma', sans-serif;
  overflow: hidden;
}

.start-button {
  background: linear-gradient(to bottom, #3E9A31 0%, #44A936 9%, #348427 18%, #348427 92%, #1A4113 100%);
  height: 100%;
  padding: 0 15px 0 10px;
  display: flex;
  align-items: center;
  border-radius: 0 10px 10px 0;
  box-shadow: 2px 0 3px rgba(0,0,0,0.3);
  cursor: pointer;
}

.start-button:active {
  background: linear-gradient(to bottom, #2A6A21 0%, #348427 100%);
}

.start-logo {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.windows-logo {
  width: 100%;
  height: 100%;
}

.start-text {
  color: white;
  font-style: italic;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

.taskbar-items {
  flex-grow: 1;
  display: flex;
  padding: 0 10px;
  gap: 2px;
}

.taskbar-item {
  display: flex;
  align-items: center;
  background: #3A83D7;
  border-radius: 3px;
  padding: 0 10px;
  height: 24px;
  min-width: 120px;
  max-width: 160px;
  cursor: pointer;
  color: white;
  font-size: 11px;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-item:hover {
  background: #4a94e8;
}

.taskbar-item.active {
  background: #1C51A3;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.6);
  color: #fff;
}

.taskbar-item .icon {
  margin-right: 5px;
  font-size: 12px;
}

.system-tray {
  height: 100%;
  background: linear-gradient(to bottom, #0F8AEB 0%, #17A9F7 9%, #0F8AEB 18%, #0F8AEB 92%, #09599A 100%);
  border-left: 1px solid #1042AF;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: white;
  font-size: 11px;
  box-shadow: inset 1px 0 0 rgba(255,255,255,0.2);
}

.time {
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}

@media (max-width: 600px) {
  .start-text {
    display: none;
  }
  .taskbar-item {
    min-width: 0;
    flex: 1;
    padding: 0 5px;
  }
  .system-tray .year {
    display: none;
  }
}
</style>
