import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDesktopStore = defineStore('desktop', () => {
  const windows = ref([
    {
      id: 'winamp',
      title: 'WinWeb',
      icon: '/winamp-logo.png',
      isOpen: false,
      isMinimized: false,
      zIndex: 10
    },
    {
      id: 'mycomputer',
      title: 'Meu Computador',
      icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png',
      isOpen: false,
      isMinimized: false,
      zIndex: 10
    },
    {
      id: 'myfiles',
      title: 'Meus Arquivos',
      icon: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png',
      isOpen: false,
      isMinimized: false,
      zIndex: 10
    },
    {
      id: 'milkdrop',
      title: 'Milkdrop',
      icon: 'https://win98icons.alexmeub.com/icons/png/video_x_generic-0.png',
      isOpen: false,
      isMinimized: false,
      zIndex: 10
    }
  ])

  let nextZIndex = 11

  const activeWindowId = computed(() => {
    const openWindows = windows.value.filter(w => w.isOpen && !w.isMinimized);
    if (openWindows.length === 0) return null;
    return openWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current).id;
  });

  function focusWindow(id) {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      win.zIndex = nextZIndex++
      win.isMinimized = false
    }
  }

  function toggleMinimize(id) {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      if (win.isMinimized) {
        focusWindow(id)
      } else {
        win.isMinimized = true
      }
    }
  }

  function toggleWindow(id) {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      if (!win.isOpen) {
        win.isOpen = true
        focusWindow(id)
        
        if (id === 'winamp') {
          const milk = windows.value.find(w => w.id === 'milkdrop')
          if (milk) milk.isOpen = true;
        }
      } else if (win.isMinimized) {
        focusWindow(id)
      } else if (activeWindowId.value === id) {
        win.isMinimized = true
      } else {
        focusWindow(id)
      }
    }
  }

  return { windows, activeWindowId, focusWindow, toggleMinimize, toggleWindow }
})
