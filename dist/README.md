# Decisiones que cuidan — Build de producción

Esta carpeta se genera con `npm run build`. Es la versión optimizada para publicar en GitHub Pages o embeber en Moodle.

## GitHub Pages

1. Subí el contenido de `dist/` a la raíz del repo (o configurá Pages desde la carpeta `/dist`).
2. Activá GitHub Pages en el branch correspondiente.

## Embeber en Moodle

```html
<iframe src="https://TU-USUARIO.github.io/TU-REPO/"
        width="100%" height="720"
        style="border:0;border-radius:12px;"
        title="Decisiones que cuidan"></iframe>
```

## Regenerar build

Desde la carpeta del proyecto fuente:

```bash
npm install
npm run build
```
