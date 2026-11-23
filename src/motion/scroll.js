// Rolagem: Lenis no computador; no toque, a nativa do aparelho. Links de âncora rolam até a seção.
import Lenis from 'lenis'
import { reduz } from './foco.js'

export let lenis = null
const fino = matchMedia('(hover: hover) and (pointer: fine)').matches

export function rolarPara(alvo, imediato = false) {
  const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, immediate: imediato, duration: 1.2 })
  else el.scrollIntoView({ behavior: reduz || imediato ? 'auto' : 'smooth', block: 'start' })
}

export function iniciarScroll() {
  if (fino && !reduz) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false })
    const laco = (t) => { lenis.raf(t); requestAnimationFrame(laco) }
    requestAnimationFrame(laco)
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || a.hasAttribute('data-folha-fechar') || e.defaultPrevented) return
    const id = a.getAttribute('href')
    if (id.length < 2) return
    const alvo = document.querySelector(id)
    if (!alvo) return
    e.preventDefault()
    rolarPara(alvo)
    history.replaceState(null, '', id)
    if (fino && id === '#contato') setTimeout(() => document.getElementById('zap')?.focus({ preventScroll: true }), lenis ? 1200 : 600)
  })
}
