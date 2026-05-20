<script setup>
/**
 * NavBar — Top navigation bar for WinampVue.
 * Displays the app branding and links to all three routes.
 * Highlights the active route via router-link-active class.
 */
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar" id="main-nav">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-icon">&#9835;</span>
        <span class="brand-text">WinampVue</span>
      </RouterLink>

      <div class="navbar-links">
        <RouterLink to="/" class="nav-link" id="nav-home">Home</RouterLink>
        <RouterLink to="/player" class="nav-link" id="nav-player">Player</RouterLink>
        <RouterLink to="/skins" class="nav-link" id="nav-skins">Skins</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--skin-border);
  z-index: 1000;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--skin-font);
  font-size: 1.1rem;
  color: var(--skin-accent);
  text-shadow: 0 0 10px var(--skin-accent);
  transition: text-shadow var(--transition-speed) ease;
}

.navbar-brand:hover {
  text-shadow: 0 0 20px var(--skin-accent);
  color: var(--skin-accent);
}

.brand-icon {
  font-size: 1.4rem;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--skin-text-dim);
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) ease;
  letter-spacing: 0.02em;
}

.nav-link:hover {
  color: var(--skin-text);
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.router-link-exact-active {
  color: var(--skin-accent);
  background: rgba(0, 229, 255, 0.08);
  text-shadow: 0 0 6px var(--skin-accent);
}

/* Mobile */
@media (max-width: 480px) {
  .brand-text {
    display: none;
  }
  .nav-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>
