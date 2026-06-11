<script setup>
import WinampPlayer from './components/player/WinampPlayer.vue';
import TextPressure from './components/ui/TextPressure.vue';
</script>

<template>
  <main class="app-container">
    <section class="hero">
      <div class="hero-text-wrapper">
        <TextPressure text="WIN WEB" textColor="var(--accent-color, #a855f7)" />
      </div>
      <p class="hero-subtitle">Player Reimagined</p>
    </section>
    
    <WinampPlayer />
  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #120F17;
  color: white;
  padding: 40px 20px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  text-align: center;
}

.hero-text-wrapper {
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  line-height: 1;
}

.hero-subtitle {
  font-family: monospace;
  letter-spacing: 4px;
  opacity: 0.6;
  margin-top: 10px;
  font-size: 14px;
}
</style>
