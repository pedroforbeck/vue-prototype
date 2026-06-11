<script setup>
import DraggableWindow from './DraggableWindow.vue';
</script>

<template>
  <DraggableWindow 
    windowId="myfiles" 
    title="Meus Arquivos" 
    icon="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png"
    :initialWidth="600"
    :initialHeight="350"
  >
    <div class="file-explorer">
      <div class="toolbar">
        <button><img src="https://win98icons.alexmeub.com/icons/png/back-0.png" width="16" /> Voltar</button>
        <button><img src="https://win98icons.alexmeub.com/icons/png/forward-0.png" width="16" /> Avançar</button>
        <button><img src="https://win98icons.alexmeub.com/icons/png/search_file-2.png" width="16" /> Pesquisar</button>
      </div>
      <div class="address-bar">
        <span>Endereço:</span>
        <input type="text" value="C:\Documents and Settings\Pedro\Meus Arquivos" readonly />
      </div>
      <div class="file-list">
        <div class="file-item">
          <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" width="32" />
          <span>Músicas do Winamp</span>
        </div>
        <div class="file-item">
          <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" width="32" />
          <span>Skins do Winamp</span>
        </div>
        <div class="file-item">
          <img src="https://win98icons.alexmeub.com/icons/png/file_lines-4.png" width="32" />
          <span>LEIAME.txt</span>
        </div>
      </div>
    </div>
  </DraggableWindow>
</template>

<style scoped>
.file-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.toolbar {
  display: flex;
  gap: 5px;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}
.toolbar button {
  background: none;
  border: 1px solid transparent;
  padding: 2px 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.toolbar button:hover {
  border: 1px solid #0055EA;
  background: #E3EFFF;
}
.address-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.address-bar input {
  flex-grow: 1;
  padding: 2px 5px;
  border: 1px solid #7F9DB9;
}
.file-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  text-align: center;
  font-size: 11px;
  cursor: pointer;
}
.file-item:hover {
  background: #E3EFFF;
}
</style>
