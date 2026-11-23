// Entrada em foco: a peça com data-foco nasce desfocada e 26 px abaixo (base.css) e assenta
// quando entra na tela. Atraso = --i × 85 ms. Terminada a entrada, a marca sai da peça
// e fica a classe `focado` (para o que depende de "já entrou", como as colunas).
export const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches

export function iniciarFoco() {
  const pecas = [...document.querySelectorAll('[data-foco]')]
  const assenta = (el) => { el.removeAttribute('data-foco'); el.classList.remove('em-foco'); el.classList.add('focado') }
  if (reduz || !('IntersectionObserver' in window)) { pecas.forEach(assenta); return }

  const entra = (el) => {
    el.classList.add('em-foco', 'focado')
    const i = parseFloat(el.style.getPropertyValue('--i')) || 0
    setTimeout(() => assenta(el), 1050 + i * 85 + 80)
  }
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) { io.unobserve(e.target); entra(e.target) }
  }, { rootMargin: '0px 0px -6% 0px' })
  // As peças do hero entram na abertura, em sequência, sem esperar a rolagem.
  const hero = document.querySelector('.hero')
  const topoVisivel = hero && hero.getBoundingClientRect().top < innerHeight * 0.5
  pecas.forEach((el) => (topoVisivel && hero.contains(el) ? entra(el) : io.observe(el)))
}
