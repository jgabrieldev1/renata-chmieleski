// Barra fixa: só depois do hero e quando a pessoa rola para cima; some ao rolar para baixo.
// Marca a seção em que a página está.
export function iniciarBarra() {
  const barra = document.querySelector('[data-barra]')
  const hero = document.querySelector('.hero')
  if (!barra || !hero) return
  const links = [...barra.querySelectorAll('[data-secao]')]
  const secoes = links.map((a) => document.getElementById(a.dataset.secao))
  let antes = scrollY, acc = 0

  function atualiza() {
    const y = scrollY, d = y - antes
    antes = y
    const passou = y > hero.offsetHeight - 40
    acc = Math.sign(d) === Math.sign(acc) ? acc + d : d
    if (!passou) barra.classList.remove('is-visivel')
    else if (acc < -6) barra.classList.add('is-visivel')
    else if (acc > 6 && !barra.contains(document.activeElement)) barra.classList.remove('is-visivel')

    const meio = innerHeight * 0.4
    let atual = -1
    secoes.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= meio) atual = i })
    links.forEach((a, i) => a.classList.toggle('is-atual', i === atual))
  }
  addEventListener('scroll', atualiza, { passive: true })
  barra.addEventListener('focusin', () => barra.classList.add('is-visivel'))
  atualiza()
}
