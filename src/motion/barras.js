// Ficha da primeira sessão: 24 barras em pé enchem de baixo para cima, uma depois da outra,
// enquanto o número conta até o alvo.
import { reduz } from './foco.js'

export function iniciarBarras() {
  document.querySelectorAll('[data-barras]').forEach((caixa) => {
    const col = caixa.querySelector('.ficha__colunas')
    const cont = caixa.querySelector('[data-contador]')
    const alvo = +caixa.dataset.alvo || 0
    const N = 24
    for (let i = 0; i < N; i++) {
      const b = document.createElement('i')
      const h = 38 + Math.round(62 * (0.5 + 0.5 * Math.sin(i * 0.9 + 1)) * (0.55 + i / N * 0.45))
      b.style.setProperty('--h', Math.min(100, h) + '%')
      b.style.setProperty('--n', i)
      col.appendChild(b)
    }
    if (reduz) { col.classList.add('enche'); cont.textContent = alvo; return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      col.classList.add('enche')
      const dur = N * 45 + 600, t0 = performance.now()
      const passo = (t) => {
        const p = Math.min((t - t0) / dur, 1)
        cont.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(passo)
      }
      requestAnimationFrame(passo)
    }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(caixa)
  })
}
