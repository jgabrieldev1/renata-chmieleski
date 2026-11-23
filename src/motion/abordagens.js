// Como eu trabalho (no lugar dos depoimentos): uma abordagem por vez. A seta troca a fala:
// a que sai perde o foco, a que entra ganha, e a frase é lida de novo.
// Clicar depressa só muda o destino; nada reinicia no meio.
import { reler } from './varredura.js'
import { reduz } from './foco.js'

const DADOS = [
  { sigla: 'TCC', nome: 'Terapia Cognitivo-Comportamental', pe: 'Ciência com acolhimento', texto: 'Entender como pensamentos, emoções e atitudes se conectam, e construir novas formas de lidar com eles.' },
  { sigla: 'ACT', nome: 'Terapia de Aceitação e Compromisso', pe: 'No seu tempo, com cuidado', texto: 'Acolher o que não está sob seu controle e se comprometer com o que realmente importa para você.' },
  { sigla: 'OF', nome: 'Orientação familiar', pe: 'Para mães, pais e famílias', texto: 'Para quem tem dúvidas na educação dos filhos: um espaço para se comunicar melhor e fortalecer os laços de confiança.' },
]

export function iniciarAbordagens() {
  const raiz = document.querySelector('[data-abordagens]')
  if (!raiz) return
  const $ = (s) => raiz.querySelector(s)
  const texto = $('[data-ab-texto]'), sigla = $('[data-ab-sigla]'), nome = $('[data-ab-nome]'), pe = $('[data-ab-pe]'), num = $('[data-ab-num]')
  const fotos = [...raiz.querySelectorAll('.abordagens__foto img')]
  const trocam = [texto, nome, sigla, pe]
  let atual = 0, destino = 0, ocupado = false
  const espera = (ms) => new Promise((r) => setTimeout(r, reduz ? 0 : ms))

  async function anda() {
    if (ocupado) return
    ocupado = true
    while (destino !== atual) {
      const n = destino
      trocam.forEach((el) => { el.classList.remove('troca-entra'); el.classList.add('troca-sai') })
      fotos.forEach((f, i) => f.classList.toggle('is-ativa', i === n))
      await espera(350)
      const d = DADOS[n]
      sigla.textContent = d.sigla; nome.textContent = d.nome; pe.textContent = d.pe
      num.textContent = String(n + 1).padStart(2, '0')
      reler(texto, d.texto)
      trocam.forEach((el) => { el.classList.add('troca-entra'); el.classList.remove('troca-sai') })
      atual = n
      await espera(400)
    }
    ocupado = false
  }
  const ir = (d) => { destino = (destino + d + DADOS.length) % DADOS.length; anda() }
  $('[data-ab="anterior"]').addEventListener('click', () => ir(-1))
  $('[data-ab="proximo"]').addEventListener('click', () => ir(1))
}
