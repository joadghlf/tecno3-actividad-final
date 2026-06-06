# Decisiones que cuidan — Juego interactivo de repaso

> **Entrega académica — Parcial 2**  
> **Materia:** Tecnología Educativa III (2026)  
> **Carrera:** Licenciatura en Tecnología Educativa  
> **Grupo:** 21 — Consultora **Formación Consciente**  
> **Integrantes:** María Cecilia Durán · Joaquín Giuliano

---

## Contexto de la entrega

Este repositorio público contiene el **material multimedial interactivo** desarrollado para la **Parte 3** del Parcial 2: un juego de repaso en HTML/CSS/JS vanilla, pensado para embeberse en el aula virtual Moodle del curso *Nociones básicas de primeros auxilios* (Bomberos Voluntarios de Villa General León).

El recurso complementa los módulos M0–M2 del curso con una evaluación **formativa**: el puntaje funciona como incentivo, no como resultado único de aprendizaje.

**Licencia de uso educativo:** repositorio abierto para revisión docente y consulta. El juego no reemplaza servicios de emergencia ni formación presencial certificada.

---

## Jugar en línea

Una vez publicado en GitHub Pages, el juego estará disponible en:

`https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

*(Reemplazá con la URL real de tu repo.)*

---

## Qué contiene este repo

| Carpeta / archivo | Propósito |
|-------------------|-----------|
| `index.html`, `css/`, `js/`, `assets/` | Código fuente (desarrollo) |
| `docs/` | **Versión minificada** que consume el usuario (GitHub Pages) |
| `scripts/build.mjs` | Script para regenerar `docs/` si editás el código |

La carpeta `docs/` (~1 MB) es la versión optimizada: CSS y JS unificados, HTML minificado e imágenes comprimidas.

---

## Publicar en GitHub (pasos)

### 1. Subir el código

Desde la carpeta del proyecto, en la terminal:

```bash
git add .
git commit -m "Entrega Parcial 2 — juego interactivo Decisiones que cuidan"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
git push -u origin main
```

> Si el remote ya existe, omití la línea `git remote add`.

### 2. Activar GitHub Pages

1. Entrá al repo en GitHub → **Settings** → **Pages**
2. En **Build and deployment** → **Source**: elegí **Deploy from a branch**
3. **Branch:** `main` · **Folder:** `/docs`
4. Guardá. En 1–2 minutos la URL quedará activa.

### 3. Embeber en Moodle

```html
<iframe src="https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/"
        width="100%" height="720"
        style="border:0;border-radius:12px;"
        title="Decisiones que cuidan"></iframe>
```

Incluí esa URL en el PDF de entrega y en la actividad correspondiente del LMS.

---

## Desarrollo local

Abrí `index.html` en el navegador. Los archivos en `css/` y `js/` están sin minificar para facilitar cambios.

### Regenerar la versión publicada

Solo si editás el código fuente:

```bash
npm install
npm run build
git add docs/
git commit -m "Actualizar build de producción"
git push
```

Node **no** es necesario para jugar ni para la primera publicación: `docs/` ya viene generada.

---

## Las 5 misiones

1. Clasificador urgencia / emergencia  
2. Botiquín express + radar de riesgos en la plaza  
3. Cadena PAS + clasificador de acciones  
4. Escena del club + activación de ayuda  
5. Simulador integrador de decisiones  

Al completarlas: debriefing con puntaje, insignias, ideas clave y reflexión para el foro.

---

## Consultora

**Formación Consciente** — mediación tecnopedagógica para entornos formativos comunitarios.
