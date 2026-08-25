import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Serve the Pagefind index from dist/ during `astro dev`, so search works
// in dev after at least one `npm run build`.
function pagefindDev() {
  const mimeTypes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.wasm': 'application/wasm',
  };
  return {
    name: 'pagefind-dev',
    hooks: {
      'astro:server:setup': ({ server }) => {
        const pagefindDir = fileURLToPath(new URL('./dist/pagefind', import.meta.url));
        server.middlewares.use('/pagefind', async (req, res, next) => {
          const requestPath = (req.url ?? '/').split('?')[0];
          const filePath = path.join(pagefindDir, requestPath);
          if (!filePath.startsWith(pagefindDir + path.sep)) return next();
          try {
            const data = await readFile(filePath);
            const type = mimeTypes[path.extname(filePath)] ?? 'application/octet-stream';
            res.setHeader('Content-Type', type);
            res.end(data);
          } catch {
            next();
          }
        });
      },
    },
  };
}

export default defineConfig({
  site: 'https://nicolascb.github.io',
  // v7 default ('jsx') strips spaces between inline elements, which corrupts
  // Pagefind's text extraction of adjacent spans (e.g. job titles + dates).
  compressHTML: true,
  markdown: {
    // Use a fixed light theme for code blocks, independent of the site palette.
    shikiConfig: { theme: 'one-light' },
  },
  integrations: [sitemap(), pagefindDev()],
});
