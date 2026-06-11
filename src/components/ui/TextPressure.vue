<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, default: 'Compressa' },
  fontFamily: { type: String, default: 'Compressa VF' },
  fontUrl: { type: String, default: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2' },
  width: { type: Boolean, default: true },
  weight: { type: Boolean, default: true },
  italic: { type: Boolean, default: true },
  alpha: { type: Boolean, default: false },
  flex: { type: Boolean, default: true },
  stroke: { type: Boolean, default: false },
  scale: { type: Boolean, default: false },
  textColor: { type: String, default: '#FFFFFF' },
  strokeColor: { type: String, default: '#FF0000' },
  strokeWidth: { type: Number, default: 2 },
  minFontSize: { type: Number, default: 24 }
})

const spansRef = ref([])
const weights = ref([])
const widths = ref([])
const slants = ref([])

const cursor = { x: 0, y: 0 }
let rafId = null
let isHovering = false

const handleMouseMove = (e) => {
  cursor.x = e.clientX
  cursor.y = e.clientY
  if (!isHovering) {
    isHovering = true
    loop()
  }
}

const handleTouchMove = (e) => {
  cursor.x = e.touches[0].clientX
  cursor.y = e.touches[0].clientY
  if (!isHovering) {
    isHovering = true
    loop()
  }
}

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

const maxDist = 300 // distância para o efeito

const loop = () => {
  if (!spansRef.value || spansRef.value.length === 0) return

  let anyActive = false

  spansRef.value.forEach((span, i) => {
    if (!span) return
    const rect = span.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const dx = centerX - cursor.x
    const dy = centerY - cursor.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < maxDist) {
      anyActive = true
    }

    if (props.weight) weights.value[i] = getAttr(dist, maxDist, 100, 900)
    else weights.value[i] = 100
    
    if (props.width) widths.value[i] = getAttr(dist, maxDist, 50, 200)
    else widths.value[i] = 100

    if (props.italic) slants.value[i] = getAttr(dist, maxDist, 0, 15) // ou negativo
    else slants.value[i] = 0
  })

  if (anyActive) {
    rafId = requestAnimationFrame(loop)
  } else {
    // Reseta para o mínimo quando fora de alcance
    spansRef.value.forEach((_, i) => {
      weights.value[i] = 100
      widths.value[i] = 100
      slants.value[i] = 0
    })
    isHovering = false
  }
}

onMounted(() => {
  weights.value = new Array(props.text.length).fill(100)
  widths.value = new Array(props.text.length).fill(100)
  slants.value = new Array(props.text.length).fill(0)
  
  // Injeta a fonte se for a Compressa VF padrão
  if (props.fontFamily === 'Compressa VF') {
    const styleId = 'text-pressure-font'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @font-face {
          font-family: '${props.fontFamily}';
          src: url('${props.fontUrl}') format('woff2');
          font-weight: 100 900;
          font-stretch: 50% 200%;
          font-style: normal;
        }
      `
      document.head.appendChild(style)
    }
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="text-pressure-container" :style="{ fontFamily: props.fontFamily }">
    <span
      v-for="(char, i) in text.split('')"
      :key="i"
      ref="spansRef"
      class="text-pressure-char"
      :class="{ flex: props.flex }"
      :style="{
        fontVariationSettings: `'wght' ${weights[i] || 100}, 'wdth' ${widths[i] || 100}, 'slnt' ${slants[i] || 0}`,
        color: props.textColor,
        WebkitTextStroke: props.stroke ? `${props.strokeWidth}px ${props.strokeColor}` : 'none',
        transform: props.scale ? `scaleY(${1 + (weights[i] || 100) / 1000})` : 'none',
        opacity: props.alpha ? ((weights[i] || 100) / 900) : 1
      }"
    >
      <template v-if="char === ' '">&nbsp;</template>
      <template v-else>{{ char }}</template>
    </span>
  </div>
</template>

<style scoped>
.text-pressure-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  line-height: 0.9;
}

.text-pressure-char {
  display: inline-block;
  /* Adiciona transição suave para quando o mouse sair */
  transition: font-variation-settings 0.2s ease-out, transform 0.2s ease-out, opacity 0.2s ease-out;
}
</style>
