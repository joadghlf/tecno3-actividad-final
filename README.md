# Decisiones que cuidan — Juego de repaso

Juego interactivo HTML/CSS/JS para el curso **Nociones básicas de primeros auxilios**.

## Desarrollo

Abrí `index.html` en el navegador. Los archivos en `css/` y `js/` están sin minificar para facilitar cambios.

## Build de producción (para publicar)

**No necesitás Node para jugar ni para subir a GitHub.** El juego sigue siendo HTML/CSS/JS puro.

La carpeta **`dist/`** ya contiene la versión minificada lista para publicar (~960 KB vs ~4,6 MB del código fuente). Eso es lo que consume el usuario final.

| Archivo | Qué es |
|---------|--------|
| `dist/css/app.min.css` | Todos los estilos en uno |
| `dist/js/app.min.js` | Todo el JavaScript en uno |
| `dist/index.html` | HTML minificado |
| `dist/assets/images/` | Imágenes optimizadas |

### Si editás el código fuente más adelante

Solo en ese caso haría falta Node (una sola vez, en tu PC):

```bash
npm install
npm run build
```

Eso regenera `dist/`. Podés borrar `node_modules/` después; no se sube a GitHub.

## GitHub Pages

Subí el repo completo y configurá Pages para servir desde la carpeta **`/dist`** (branch `main`).

Alternativa: copiá el contenido de `dist/` a la raíz del repo si preferís Pages desde `/`.

```html
<iframe src="https://TU-USUARIO.github.io/TU-REPO/"
        width="100%" height="720"
        style="border:0;border-radius:12px;"
        title="Decisiones que cuidan"></iframe>
```

## Estructura

```
juego-decisiones-que-cuidan/
├── index.html          ← desarrollo
├── css/  js/  assets/  ← fuente
├── scripts/build.mjs   ← pipeline de minificación
├── package.json
└── dist/               ← producción (subir / servir esto)
```

## 5 misiones

1. Clasificador urgencia/emergencia
2. Botiquín + radar de riesgos
3. Cadena PAS + clasificador de acciones
4. Escena del club + activación de ayuda
5. Simulador integrador de decisiones

## Debriefing final

Al completar las 5 misiones: puntaje total, insignias, ideas clave, reflexión y opción de copiar texto para el foro.
