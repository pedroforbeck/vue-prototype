<script setup>
import { onMounted } from 'vue';
import WinampPlayer from './components/player/WinampPlayer.vue';
import Taskbar from './components/desktop/Taskbar.vue';
import MyComputerWindow from './components/desktop/MyComputerWindow.vue';
import MyFilesWindow from './components/desktop/MyFilesWindow.vue';
import MilkdropWindow from './components/player/MilkdropWindow.vue';
import { useDesktopStore } from './stores/desktopStore';

const desktopStore = useDesktopStore();

onMounted(() => {
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
});

const handleTouchOpen = (id, e) => {
  if (e.pointerType === 'touch') {
    const win = desktopStore.windows.find(w => w.id === id);
    if (!win.isOpen) {
      desktopStore.toggleWindow(id);
    }
  }
};
</script>

<template>
  <main class="xp-desktop">
    <!-- Ícones da Área de Trabalho -->
    <div class="desktop-icons">
      <div class="desktop-icon" @dblclick.stop="desktopStore.toggleWindow('mycomputer')" @pointerup="handleTouchOpen('mycomputer', $event)">
        <div class="icon-img"><img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" width="40" /></div>
        <div class="icon-text">Meu Computador</div>
      </div>
      <div class="desktop-icon" @dblclick.stop="desktopStore.toggleWindow('myfiles')" @pointerup="handleTouchOpen('myfiles', $event)">
        <div class="icon-img"><img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" width="40" /></div>
        <div class="icon-text">Meus Arquivos</div>
      </div>
      <div class="desktop-icon" @dblclick.stop="desktopStore.toggleWindow('winamp')" @pointerup="handleTouchOpen('winamp', $event)">
        <div class="icon-img"><img src="/winamp-logo.png" width="40" /></div>
        <div class="icon-text">VueNamp</div>
      </div>
    </div>
    
    <!-- Janelas -->
    <MyComputerWindow />
    <MyFilesWindow />
    <WinampPlayer />
    <MilkdropWindow />
    
    <!-- Barra de Tarefas -->
    <Taskbar />
  </main>
</template>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

<style scoped>
.xp-desktop {
  position: relative;
  width: 100vw;
  height: 100vh;
  /* Local Windows XP Wallpaper */
  background-image: url('/winxp.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Tahoma', sans-serif;
}

.desktop-icons {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  align-items: flex-start;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 74px;
  cursor: pointer;
  user-select: none;
}

.desktop-icon:hover .icon-img {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.desktop-icon:active .icon-img {
  background-color: rgba(0, 0, 255, 0.4);
}

.icon-img {
  font-size: 38px;
  padding: 5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  line-height: 1;
}

.icon-text {
  color: white;
  font-size: 11px;
  text-align: center;
  text-shadow: 1px 1px 2px black, 0px 0px 2px black;
  margin-top: 2px;
}
</style>
