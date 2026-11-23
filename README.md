# Renata Chmieleski · Psicóloga · CRP 18/10242

Site pessoal, em primeira pessoa. Vite sem framework (HTML, CSS e JS puros), Lenis na rolagem.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

O `dist/` sobe em qualquer hospedagem estática, inclusive numa subpasta (`base: './'`).

## Estrutura
- `index.html`: o esqueleto. Cada `<!-- @secao nome -->` vira `src/sections/nome.html` (plugin em `vite.config.js`).
- `src/styles/`: `tokens.css` (cores em papéis, curvas, medidas), `base.css` (entrada em foco, frase que se lê), `site.css` (junta tudo).
- `src/sections/`: o HTML e o CSS de cada seção.
- `src/motion/`: um módulo por movimento. O cabeçalho de cada arquivo diz o que ele faz.
- `public/img/`: as fotos em WebP, tiradas do site atual.
- `?tema=terracota`, `?tema=azul` e `?tema=grafite` trocam a cor de acento.

## Publicidade (Código de Ética do Psicólogo / CFP)
Nome, "psicóloga" e CRP à vista; nenhum paciente aparece; avaliações do Google só sem nome, foto ou estrelas e sem falar de resultado (confirmar com o CRP 18); sem preço, desconto ou forma de pagamento; sem promessa de resultado.

## Pendências
- Fotos deitadas (16:9) para o topo, sobretudo Crianças, Adolescentes e Casais e famílias (hoje são montagens das fotos em pé).
- Horário de atendimento.
- Revisar os textos das três dúvidas (folhas de leitura) e as frases das pílulas.
- O campo de WhatsApp não guarda nada: ele abre o WhatsApp da Renata com a mensagem pronta.
