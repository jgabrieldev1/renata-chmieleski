import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Troca cada <!-- @secao nome --> do index.html por src/sections/nome.html.
function secoes() {
  const dir = resolve(import.meta.dirname, 'src/sections')
  return {
    name: 'secoes',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*@secao\s+([\w-]+)\s*-->/g, (_, nome) =>
          readFileSync(resolve(dir, `${nome}.html`), 'utf8'))
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(dir) && file.endsWith('.html')) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [secoes()],
})
