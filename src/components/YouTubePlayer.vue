<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();
const ytContainer = ref(null);
let player = null;

onMounted(() => {
  if (!window.YT || !window.YT.Player) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0] || document.head.appendChild(document.createElement('script'));
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  } else {
    initPlayer();
  }
});

function initPlayer() {
  player = new window.YT.Player(ytContainer.value, {
    height: '155',  // Proporção ~16:9 ajustada para a largura do Winamp
    width: '275',   // Mesma largura do Winamp (275px)
    videoId: playerStore.videoId,
    playerVars: {
      autoplay: 0,
      controls: 1, 
      disablekb: 0,
      fs: 0,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  if (playerStore.isPlaying) {
    player.playVideo();
  }
}

function onPlayerStateChange(event) {
  if (event.data === window.YT.PlayerState.PLAYING) {
    playerStore.isPlaying = true;
  } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
    playerStore.isPlaying = false;
  }
}

watch(() => playerStore.isPlaying, (playing) => {
  if (!player || !player.playVideo) return;
  if (playing) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
});

watch(() => playerStore.videoId, (newId) => {
  if (!player || !player.loadVideoById) return;
  if (newId) {
    player.loadVideoById(newId);
    if (playerStore.isPlaying) {
      player.playVideo();
    }
  }
});
</script>

<template>
  <div class="youtube-visible-container">
    <div class="window-title">Vídeo YouTube</div>
    <div ref="ytContainer"></div>
  </div>
</template>

<style scoped>
.youtube-visible-container {
  background: #1e1e24;
  border: 1px solid #52525d;
  box-shadow: 2px 2px 0 #000, inset 1px 1px 0 rgba(255, 255, 255, 0.2);
  padding: 2px;
  width: 275px;
  box-sizing: border-box;
}

.window-title {
  font-family: sans-serif;
  font-size: 10px;
  color: white;
  font-weight: bold;
  background: linear-gradient(to right, #000080, #1084d0);
  margin-bottom: 2px;
  padding: 2px;
}
</style>
