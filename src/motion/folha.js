// Folha de leitura: o cartão inteiro abre o texto num <dialog>. A página de trás desfoca e
// escurece, a folha sobe em foco. Fecha no X, no Esc, clicando fora ou no botão do fim
// (que leva ao contato). Com a folha aberta, a página de trás não rola.
import { lenis, rolarPara } from './scroll.js'
import { reduz } from './foco.js'

export function iniciarFolha() {
  const html = document.documentElement
  let aberta = null

  function abrir(d) {
    if (!d || d.open) return
    aberta = d
    lenis?.stop()
    html.classList.add('folha-aberta')
    d.showModal()
    d.scrollTop = 0
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('aberta')))
  }
  function fechar(d = aberta) {
    if (!d || !d.open) return Promise.resolve()
    d.classList.remove('aberta')
    return new Promise((r) => setTimeout(() => {
      d.close()
      html.classList.remove('folha-aberta')
      lenis?.start()
      aberta = null
      r()
    }, reduz ? 0 : 420))
  }

  document.querySelectorAll('[data-folha]').forEach((b) => b.addEventListener('click', () => abrir(document.getElementById(b.dataset.folha))))
  document.querySelectorAll('dialog.folha').forEach((d) => {
    d.addEventListener('cancel', (e) => { e.preventDefault(); fechar(d) })
    d.addEventListener('click', (e) => { if (e.target === d) fechar(d) })
    d.querySelectorAll('[data-folha-fechar]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault()
      const href = b.getAttribute('href')
      fechar(d).then(() => { if (href) rolarPara(href) })
    }))
  })
}
