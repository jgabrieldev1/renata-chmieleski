// Ordem: espera a fonte e a primeira foto (ou 1,2 s), liga `assentou` (as transições)
// e só no quadro seguinte começa a entrada. Sem essa trava as peças piscam na primeira pintura.
import { iniciarScroll } from './motion/scroll.js'
import { iniciarScrollbar } from './motion/scrollbar.js'
import { iniciarFoco } from './motion/foco.js'
import { iniciarVarredura } from './motion/varredura.js'
import { iniciarHero } from './motion/hero.js'
import { iniciarBarra } from './motion/barra.js'
import { iniciarBarras } from './motion/barras.js'
import { iniciarTrilho } from './motion/trilho.js'
import { iniciarAbordagens } from './motion/abordagens.js'
import { iniciarFolha } from './motion/folha.js'
import { iniciarContato } from './motion/contato.js'

const html = document.documentElement
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
const quadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

function imagemPronta(img) {
  if (!img) return Promise.resolve()
  if (img.complete && img.naturalWidth) return img.decode?.().catch(() => {}) ?? Promise.resolve()
  return new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }) })
}

const primeira = document.querySelector('.hero__foto img')
const fontes = document.fonts ? document.fonts.ready : Promise.resolve()

iniciarScroll()
iniciarScrollbar()
iniciarBarra()
iniciarContato()
iniciarFolha()
iniciarTrilho()

Promise.race([Promise.all([fontes, imagemPronta(primeira)]), espera(1200)]).then(async () => {
  html.classList.add('assentou')
  await quadro()
  html.classList.add('foto-pronta')
  await espera(180)
  iniciarVarredura()
  iniciarFoco()
  iniciarHero()
  iniciarBarras()
  iniciarAbordagens()
})
