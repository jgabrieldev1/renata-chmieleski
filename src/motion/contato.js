// Campo de WhatsApp: máscara (00) 00000-0000; sem número válido, treme e avisa.
// Com número, abre o WhatsApp da Renata com a mensagem pronta (o site não guarda nada)
// e mostra a confirmação, com "Corrigir o número".
const NUMERO = '5565999098667'

function mascara(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function iniciarContato() {
  const form = document.querySelector('[data-contato]')
  if (!form) return
  const input = form.querySelector('input')
  const aviso = form.querySelector('.campo__aviso')
  const ok = document.querySelector('[data-contato-ok]')
  const numOk = ok.querySelector('[data-contato-num]')
  const link = ok.querySelector('[data-contato-link]')

  input.addEventListener('input', () => {
    input.value = mascara(input.value)
    if (aviso.textContent) { aviso.textContent = ''; input.removeAttribute('aria-invalid') }
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const d = input.value.replace(/\D/g, '')
    if (d.length < 10) {
      aviso.textContent = d.length ? 'Faltam números. Escreva o WhatsApp com DDD, como (65) 99999-9999.' : 'Escreva seu WhatsApp com DDD para eu poder responder.'
      input.setAttribute('aria-invalid', 'true')
      form.classList.remove('treme'); void form.offsetWidth; form.classList.add('treme')
      input.focus()
      return
    }
    const msg = `Olá, Renata! Vim pelo site e gostaria de agendar uma sessão. Meu WhatsApp é ${input.value}.`
    const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`
    link.href = url
    numOk.textContent = input.value
    window.open(url, '_blank', 'noopener')
    form.hidden = true
    ok.hidden = false
    ok.focus()
  })
  form.addEventListener('animationend', () => form.classList.remove('treme'))
  ok.querySelector('[data-contato-corrigir]').addEventListener('click', () => {
    ok.hidden = true
    form.hidden = false
    input.focus()
    input.select()
  })
}
