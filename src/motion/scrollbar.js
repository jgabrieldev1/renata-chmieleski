// Barra de rolagem própria (só com mouse): a nativa fica escondida (base.css) porque ocupa
// largura e deixaria a margem direita do card do hero maior que a esquerda.
// Um fio na borda direita: aparece ao rolar, some parado, engrossa com o cursor e arrasta.
import { lenis } from './scroll.js'

export function iniciarScrollbar() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const trilho = document.createElement('div')
  trilho.className = 'rolagem'
  trilho.setAttribute('aria-hidden', 'true')
  trilho.innerHTML = '<div class="rolagem__fio"></div>'
  document.body.appendChild(trilho)
  const fio = trilho.firstChild
  let some, arrasto = null

  function medir() {
    const vh = innerHeight, doc = document.documentElement.scrollHeight
    const h = Math.max(40, (vh / doc) * vh)
    const y = (scrollY / Math.max(1, doc - vh)) * (vh - h)
    fio.style.height = h + 'px'
    fio.style.transform = `translateY(${y}px)`
    trilho.hidden = doc <= vh + 2
    return { vh, doc, h }
  }
  function mostra() {
    trilho.classList.add('ativa')
    clearTimeout(some)
    some = setTimeout(() => { if (!arrasto && !trilho.matches(':hover')) trilho.classList.remove('ativa') }, 900)
  }
  addEventListener('scroll', () => { medir(); mostra() }, { passive: true })
  addEventListener('resize', medir)
  trilho.addEventListener('pointerleave', mostra)
  fio.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    fio.setPointerCapture(e.pointerId)
    arrasto = { y: e.clientY, s: scrollY }
    trilho.classList.add('arrasta', 'ativa')
  })
  fio.addEventListener('pointermove', (e) => {
    if (!arrasto) return
    const { vh, doc, h } = medir()
    const alvo = arrasto.s + ((e.clientY - arrasto.y) / (vh - h)) * (doc - vh)
    if (lenis) lenis.scrollTo(alvo, { immediate: true }); else scrollTo(0, alvo)
  })
  const solta = () => { arrasto = null; trilho.classList.remove('arrasta'); mostra() }
  fio.addEventListener('pointerup', solta)
  fio.addEventListener('pointercancel', solta)
  medir()
}
