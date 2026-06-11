<script setup>
import DraggableWindow from './DraggableWindow.vue';
</script>

<template>
  <DraggableWindow 
    windowId="mycomputer" 
    title="Meu Computador" 
    icon="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png"
    :initialWidth="500"
    :initialHeight="400"
  >
    <div class="pc-stats">
      <div class="header">
        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" width="48" />
        <div>
          <h2>Informações do Sistema</h2>
          <p>WinWeb XP Professional - Versão 2026</p>
        </div>
      </div>
      <hr />
      <div class="details">
        <p><strong>Processador:</strong> Vue 3 Engine @ 120 FPS</p>
        <p><strong>Memória RAM:</strong> 512 MB (Virtual)</p>
        <p><strong>Espaço em Disco:</strong> 40 GB M.2 NVMe</p>
      </div>
      
      <div class="disk-drives">
        <div class="disk-drive">
          <img src="https://win98icons.alexmeub.com/icons/png/drive_disk-4.png" width="32" />
          <span>Disco Local (C:)</span>
        </div>
        <div class="disk-drive">
          <img src="https://win98icons.alexmeub.com/icons/png/drive_cd-4.png" width="32" />
          <span>Unidade de CD-RW (D:)</span>
        </div>
      </div>
    </div>
  </DraggableWindow>
</template>

<style scoped>
.pc-stats {
  font-family: 'Tahoma', sans-serif;
  color: #333;
}
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.header h2 {
  margin: 0;
  font-size: 18px;
  color: #0055EA;
}
.header p {
  margin: 5px 0 0 0;
  color: #666;
}
.details {
  margin-top: 15px;
  line-height: 1.6;
}
.disk-drives {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}
.disk-drive {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  width: 180px;
  border-radius: 3px;
}
</style>
