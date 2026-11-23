// Fila de cartões: no computador, uma janela da largura do conteúdo que anda com as setas,
// arrastando com o mouse (com embalo ao soltar), com o trackpad e com as setas do teclado.
// No toque, a rolagem lateral nativa (sem encaixe); a fila nunca rola na vertical.
import { reduz } from './foco.js'

export function iniciarTrilho() {
  const janela = document.querySelector('[data-trilho-janela]')
  if (!janela) return
  const ant = document.querySelector('[data-trilho="anterior"]')
  const prox = document.querySelector('[data-trilho="proximo"]')
  let anima = 0

  const max = () => janela.scrollWidth - janela.clientWidth
  function setas() {
    ant.disabled = janela.scrollLeft <= 2
    prox.disabled = janela.scrollLeft >= max() - 2
  }
  function passo() {
    const c = janela.querySelector('.cartao')
    return c ? c.offsetWidth + 14 : 320
  }
  function vaiPara(x) {
    cancelAnimationFrame(anima)
    x = Math.max(0, Math.min(max(), x))
    if (reduz) { janela.scrollLeft = x; return }
    const de = janela.scrollLeft, t0 = performance.now(), dur = 700
    const ease = (t) => 1 - Math.pow(1 - t, 4)
    const laco = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      janela.scrollLeft = de + (x - de) * ease(p)
      if (p < 1) anima = requestAnimationFrame(laco)
    }
    anima = requestAnimationFrame(laco)
  }
  ant.addEventListener('click', () => vaiPara(janela.scrollLeft - passo()))
  prox.addEventListener('click', () => vaiPara(janela.scrollLeft + passo()))
  janela.addEventListener('scroll', setas, { passive: true })
  addEventListener('resize', setas)
  janela.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); vaiPara(janela.scrollLeft + passo()) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); vaiPara(janela.scrollLeft - passo()) }
  })

  // Arrastar com o mouse, com embalo.
  let arr = null
  janela.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    cancelAnimationFrame(anima)
    arr = { x: e.clientX, s: janela.scrollLeft, v: 0, t: performance.now(), ultimoX: e.clientX, moveu: false }
  })
  addEventListener('pointermove', (e) => {
    if (!arr) return
    const dx = e.clientX - arr.x
    if (!arr.moveu && Math.abs(dx) > 4) { arr.moveu = true; janela.classList.add('arrastando') }
    if (!arr.moveu) return
    const agora = performance.now(), dt = Math.max(1, agora - arr.t)
    arr.v = 0.8 * ((e.clientX - arr.ultimoX) / dt) + 0.2 * arr.v
    arr.t = agora; arr.ultimoX = e.clientX
    janela.scrollLeft = arr.s - dx
  })
  addEventListener('pointerup', () => {
    if (!arr) return
    const { moveu } = arr
    let v = arr.v * 16
    arr = null
    janela.classList.remove('arrastando')
    if (!moveu || reduz) return
    const laco = () => {
      v *= 0.94
      janela.scrollLeft -= v
      if (Math.abs(v) > 0.4) anima = requestAnimationFrame(laco)
    }
    anima = requestAnimationFrame(laco)
  })
  janela.addEventListener('dragstart', (e) => e.preventDefault())
  setas()
}
