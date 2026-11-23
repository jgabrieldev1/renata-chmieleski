// Frase que se lê: as linhas são medidas na tela; cada uma leva 0,9 s, 150 ms atrás da de cima
// (base.css: .vl / --p). A leitura corre por tempo quando a frase entra na tela, nunca presa à rolagem.
import { reduz } from './foco.js'

const LINHA = 900, PASSO = 150

function dividir(el) {
  const texto = el.dataset.texto ?? (el.dataset.texto = el.textContent.trim().replace(/\s+/g, ' '))
  const palavras = texto.split(' ')
  el.textContent = ''
  const spans = palavras.map((p, i) => {
    const s = document.createElement('span')
    s.textContent = p + (i < palavras.length - 1 ? ' ' : '')
    el.appendChild(s)
    return s
  })
  const linhas = []
  let topo = null
  for (const s of spans) {
    const t = s.offsetTop
    if (topo === null || Math.abs(t - topo) > 4) { linhas.push([]); topo = t }
    linhas[linhas.length - 1].push(s.textContent)
  }
  el.textContent = ''
  linhas.forEach((ps, i) => {
    const l = document.createElement('span')
    l.className = 'vl'
    l.style.setProperty('--l', i)
    l.textContent = ps.join('').trimEnd()
    el.appendChild(l)
    el.appendChild(document.createTextNode(' '))
  })
  return linhas.length
}

export function ler(el) {
  const linhas = el.querySelectorAll('.vl')
  linhas.forEach((l) => l.classList.add('lida'))
  el._lida = true
  const ultima = (linhas.length - 1) * PASSO
  el.dispatchEvent(new CustomEvent('leitura', { detail: { ultima, total: ultima + LINHA } }))
  clearTimeout(el._fim)
  el._fim = setTimeout(() => el.classList.add('vl-ok'), ultima + LINHA + 50)
}

/** Troca o texto e lê de novo (depoimentos/abordagens). */
export function reler(el, texto) {
  el.dataset.texto = texto
  el.classList.remove('vl-ok')
  el._lida = false
  dividir(el)
  if (reduz) { el.classList.add('vl-ok'); return }
  void el.offsetWidth
  requestAnimationFrame(() => ler(el))
}

export function iniciarVarredura() {
  const frases = [...document.querySelectorAll('[data-varredura]')]
  frases.forEach((el) => { dividir(el); el._largura = el.clientWidth })
  if (reduz) { frases.forEach((el) => { el.classList.add('vl-ok'); ler(el) }); return }

  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); ler(e.target) }
  }, { rootMargin: '0px 0px -18% 0px' })
  frases.forEach((el) => io.observe(el))

  let t
  addEventListener('resize', () => {
    clearTimeout(t)
    t = setTimeout(() => frases.forEach((el) => {
      if (el.clientWidth === el._largura) return
      el._largura = el.clientWidth
      dividir(el)
      if (el._lida) el.classList.add('vl-ok'), el.querySelectorAll('.vl').forEach((l) => l.classList.add('lida'))
    }), 150)
  })

  // Assinatura do "Sobre": começa quando a última linha começa a ser lida.
  const assinatura = document.querySelector('[data-assinatura]')
  const frase = assinatura?.previousElementSibling
  frase?.addEventListener('leitura', (e) => {
    setTimeout(() => assinatura.classList.add('escreve'), e.detail.ultima)
  }, { once: true })
}
