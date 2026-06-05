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
    height: '180',
    width: '320',
    videoId: playerStore.videoId,
    playerVars: {
      autoplay: 0,
      controls: 1, // Vamos deixar os controles visíveis por enquanto para testes
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
    <div class="window-title">YouTube Player</div>
    <div ref="ytContainer"></div>
  </div>
</template>

<style scoped>
.youtube-visible-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #1e1e24;
  border: 1px solid #52525d;
  box-shadow: 2px 2px 0 #000, inset 1px 1px 0 rgba(255, 255, 255, 0.2);
  padding: 5px;
}

.window-title {
  font-family: sans-serif;
  font-size: 10px;
  color: white;
  font-weight: bold;
  background: linear-gradient(to right, #000080, #1084d0);
  margin-bottom: 5px;
  padding: 2px;
}
</style>
