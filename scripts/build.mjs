import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import { minify as minifyHtml } from 'html-minifier-terser';
import sharp from 'sharp';
import { minify as minifyJs } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const CSS_FILES = [
  'css/variables.css',
  'css/base.css',
  'css/components.css',
  'css/animations.css',
  'css/screens.css',
  'css/missions.css',
  'css/debrief.css'
];

const JS_FILES = [
  'js/data.js',
  'js/state.js',
  'js/audio.js',
  'js/badges.js',
  'js/ui.js',
  'js/mission1.js',
  'js/mission2.js',
  'js/mission3.js',
  'js/mission4.js',
  'js/mission5.js',
  'js/missions.js',
  'js/engine.js',
  'js/main.js'
];

const IMAGE_FILES = [
  'assets/images/plaza-background.png',
  'assets/images/club-background.png'
];

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function sumSize(files) {
  return files.reduce((total, relPath) => {
    return total + fs.statSync(path.join(ROOT, relPath)).size;
  }, 0);
}

async function buildCss() {
  const source = CSS_FILES.map(read).join('\n');
  const result = new CleanCSS({ level: 2 }).minify(source);

  if (result.errors.length) {
    throw new Error('CSS minify failed: ' + result.errors.join('; '));
  }

  const outPath = path.join(DOCS, 'css', 'app.min.css');
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, result.styles);
  return fs.statSync(outPath).size;
}

async function buildJs() {
  const source = JS_FILES.map(read).join('\n');
  const result = await minifyJs(source, {
    compress: true,
    mangle: true,
    format: { comments: false }
  });

  if (!result.code) {
    throw new Error('JS minify failed');
  }

  const outPath = path.join(DOCS, 'js', 'app.min.js');
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, result.code);
  return fs.statSync(outPath).size;
}

async function buildHtml() {
  const html = read('index.html')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(
      /<link rel="stylesheet" href="css\/[^"]+">\s*/g,
      ''
    )
    .replace(
      /<script src="js\/[^"]+"><\/script>\s*/g,
      ''
    )
    .replace(
      '</head>',
      '    <link rel="stylesheet" href="css/app.min.css">\n</head>'
    )
    .replace(
      '</body>',
      '    <script src="js/app.min.js"></script>\n</body>'
    );

  const minified = await minifyHtml(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    sortAttributes: true,
    sortClassName: true
  });

  const outPath = path.join(DOCS, 'index.html');
  fs.writeFileSync(outPath, minified);
  return fs.statSync(outPath).size;
}

async function buildImages() {
  let total = 0;

  for (const relPath of IMAGE_FILES) {
    const inputPath = path.join(ROOT, relPath);
    const outPath = path.join(DIST, relPath);
    ensureDir(path.dirname(outPath));

    await sharp(inputPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .png({ quality: 72, compressionLevel: 9, palette: true })
      .toFile(outPath);

    total += fs.statSync(outPath).size;
  }

  return total;
}

function writeDeployReadme() {
  const content = `# Decisiones que cuidan — Build de producción

Esta carpeta se genera con \`npm run build\`. Es la versión optimizada para publicar en GitHub Pages o embeber en Moodle.

## GitHub Pages

1. Subí el contenido de \`dist/\` a la raíz del repo (o configurá Pages desde la carpeta \`/dist\`).
2. Activá GitHub Pages en el branch correspondiente.

## Embeber en Moodle

\`\`\`html
<iframe src="https://TU-USUARIO.github.io/TU-REPO/"
        width="100%" height="720"
        style="border:0;border-radius:12px;"
        title="Decisiones que cuidan"></iframe>
\`\`\`

## Regenerar build

Desde la carpeta del proyecto fuente:

\`\`\`bash
npm install
npm run build
\`\`\`
`;

  fs.writeFileSync(path.join(DIST, 'README.md'), content);
}

async function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  const sourceCss = sumSize(CSS_FILES);
  const sourceJs = sumSize(JS_FILES);
  const sourceHtml = fs.statSync(path.join(ROOT, 'index.html')).size;
  const sourceImages = sumSize(IMAGE_FILES);

  const cssSize = await buildCss();
  const jsSize = await buildJs();
  const htmlSize = await buildHtml();
  const imageSize = await buildImages();
  writeDeployReadme();

  const sourceTotal = sourceCss + sourceJs + sourceHtml + sourceImages;
  const distTotal = cssSize + jsSize + htmlSize + imageSize;

  console.log('Build completado → dist/');
  console.log('');
  console.log('CSS :', formatBytes(sourceCss), '→', formatBytes(cssSize));
  console.log('JS  :', formatBytes(sourceJs), '→', formatBytes(jsSize));
  console.log('HTML:', formatBytes(sourceHtml), '→', formatBytes(htmlSize));
  console.log('IMG :', formatBytes(sourceImages), '→', formatBytes(imageSize));
  console.log('');
  console.log('Total consumible:', formatBytes(distTotal), '(antes:', formatBytes(sourceTotal) + ')');
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
