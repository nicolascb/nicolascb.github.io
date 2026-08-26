# nicolascb.github.io

Blog pessoal construído com [Astro](https://astro.build) e o tema [AstroPaper](https://github.com/satnaing/astro-paper).

## Comandos

```bash
npm install
npm run dev     # servidor de desenvolvimento
npm run build   # type-check, build estático e índice Pagefind
npm run preview # preview do build de produção
```

A busca usa o índice do Pagefind gerado em `dist/pagefind`. Rode `npm run build` uma vez antes de testar a busca em desenvolvimento.

Posts ficam em `src/content/posts/`. A identidade do site está em `astro-paper.config.ts`.
