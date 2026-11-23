// Card de abertura: uma foto por atendimento. 6,5 s por foto; a nova entra por cima em 0,75 s
// (hero.css) e a antiga espera mais 0,3 s para sair, então o card nunca escurece no meio.
// Pílulas, Anterior/Próximo e as setas do teclado trocam a foto. Não para no hover.
// Com o hero fora da tela ou a aba escondida, o relógio dorme.
import { reduz } from './foco.js'

const TEMPO = 6500, ENTRA = 750, ESPERA = 300
const BASE = import.meta.env.BASE_URL
export const SLIDES = [
  { id: 'adultos', frase: 'Ansiedade, autocobrança, decisões difíceis, perdas e recomeços. Um processo para olhar para dentro com clareza.' },
  { id: 'criancas', frase: 'A terapia ajuda a criança a nomear o que sente e lidar com mudanças, com a família por perto. A partir de 6 anos.' },
  { id: 'adolescentes', frase: 'Uma fase cheia de perguntas. Espaço, sem julgamento, para falar de escola, amizades, identidade e do que pesa.' },
  { id: 'familias', frase: 'Terapia de relacionamento e orientação familiar, para se comunicar melhor e atravessar fases difíceis juntos.' },
  { id: 'online', frase: 'Por videochamada, com o mesmo cuidado e sigilo do presencial, de onde você estiver.' },
]
const url = (id, m) => `${BASE}img/hero-${id}${m ? '-m' : ''}.webp`

export function iniciarHero() {
  const hero = document.querySelector('.hero')
  if (!hero) return
  const caixa = hero.querySelector('.hero__fotos')
  const pilulas = [...hero.querySelectorAll('.pilula')]
  const frase = hero.querySelector('.hero__frase-txt')
  const num = hero.querySelector('[data-hero-num]')
  const tempo = hero.querySelector('.hero__tempo')
  let atual = 0, decorrido = 0, ultimo = performance.now(), visivel = true, fotoAtual = caixa.querySelector('.hero__foto')
  let trocaFrase

  // Pré-carrega as outras fotos depois da abertura.
  setTimeout(() => {
    const m = matchMedia('(max-width: 760px)').matches
    SLIDES.slice(1).forEach((s) => { const i = new Image(); i.decoding = 'async'; i.src = url(s.id, m) })
  }, 2500)

  function novaFoto(id) {
    const p = document.createElement('picture')
    p.className = 'hero__foto'
    p.innerHTML = `<source media="(max-width: 760px)" srcset="${url(id, true)}"><img src="${url(id)}" alt="" width="1600" height="900" decoding="async">`
    return p
  }

  function ir(n, foco = false) {
    n = (n + SLIDES.length) % SLIDES.length
    decorrido = 0
    if (n === atual) return
    atual = n
    const s = SLIDES[n]

    pilulas.forEach((b, i) => {
      const sim = i === n
      b.classList.toggle('is-ativa', sim)
      b.setAttribute('aria-selected', sim)
      b.tabIndex = sim ? 0 : -1
    })
    if (foco) pilulas[n].focus()
    if (matchMedia('(max-width: 760px)').matches) pilulas[n].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduz ? 'auto' : 'smooth' })
    num.textContent = String(n + 1).padStart(2, '0')

    clearTimeout(trocaFrase)
    frase.classList.add('troca')
    trocaFrase = setTimeout(() => { frase.textContent = s.frase; frase.classList.remove('troca') }, 350)

    const p = novaFoto(s.id)
    caixa.appendChild(p)
    fotoAtual = p
    const img = p.querySelector('img')
    const pronta = Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 1500))])
    pronta.then(() => {
      if (fotoAtual !== p) { p.remove(); return }
      requestAnimationFrame(() => {
        p.classList.add('is-ativa')
        setTimeout(() => {
          if (fotoAtual !== p) return
          ;[...caixa.children].forEach((c) => { if (c !== p) c.remove() })
        }, ENTRA + ESPERA)
      })
    })
  }

  pilulas.forEach((b, i) => {
    b.addEventListener('click', () => ir(i))
    b.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
      if (d) { e.preventDefault(); ir(atual + d, true) }
      else if (e.key === 'Home') { e.preventDefault(); ir(0, true) }
      else if (e.key === 'End') { e.preventDefault(); ir(SLIDES.length - 1, true) }
    })
  })
  hero.querySelector('[data-hero="anterior"]').addEventListener('click', () => ir(atual - 1))
  hero.querySelector('[data-hero="proximo"]').addEventListener('click', () => ir(atual + 1))
  document.addEventListener('hero:ir', (e) => ir(e.detail))
  document.querySelectorAll('[data-ir-slide]').forEach((a) => a.addEventListener('click', () => ir(+a.dataset.irSlide)))

  if (reduz) { tempo.style.transform = 'scaleX(0)'; return }

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting }, { threshold: 0.15 }).observe(hero)
  function laco(agora) {
    const dt = Math.min(agora - ultimo, 100)
    ultimo = agora
    if (visivel && !document.hidden) {
      decorrido += dt
      if (decorrido >= TEMPO) ir(atual + 1)
    }
    tempo.style.transform = `scaleX(${Math.min(decorrido / TEMPO, 1)})`
    requestAnimationFrame(laco)
  }
  requestAnimationFrame(laco)
}
