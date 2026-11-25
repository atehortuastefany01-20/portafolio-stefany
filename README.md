# Portafolio Stefany · Versión con fundamentos técnicos

Código independiente del portafolio anterior. Conserva la portada sin fotografía, la misma identidad editorial, el perfil con foto real, habilidades, servicios, contactos y dos espacios de proyectos. Amor y Paz se presenta en video y tiene acceso a su página publicada. La formación incluye los cuatro estudios de la hoja de vida, con el tecnólogo identificado como «En curso».

## Banners de marketing

El segundo espacio de proyectos admite un carrusel de banners reales. Guarda las imágenes en `dist/assets/` y añádelas a `marketingBanners` en `dist/content.js`, con `image`, `alt` y un `title` opcional. Al construir, las imágenes se incluyen en HTML y el navegador añade transiciones automáticas cada 4,5 segundos, botones anterior y siguiente, pausa y navegación con las teclas de dirección. La rotación se detiene al pasar el cursor, enfocar el carrusel, cambiar de pestaña o dejar de verlo; respeta movimiento reducido. Sin JavaScript, las imágenes siguen disponibles mediante desplazamiento horizontal.

La lista permanece vacía hasta incorporar los archivos reales de la autora. No se utilizan diseños de muestra para representar sus trabajos.

## Abrir ahora

Abre el archivo `index.html` de esta carpeta con tu navegador. Redirige a `dist/index.html` y no requiere instalar nada. El contenido principal ya está incluido en el HTML, incluso si JavaScript está desactivado.

Para una vista completa con subtítulos y servidor local:

```powershell
node scripts/serve.mjs
```

Abre http://127.0.0.1:4174 y deja la terminal abierta. Usa este puerto, diferente al de la versión anterior.

## Editar y verificar

Requiere Node.js 22 o superior para las herramientas. No necesita paquetes externos.

```powershell
node scripts/build.mjs
node --check dist/app.js
node scripts/check.mjs
node --test tests/*.test.mjs
```

Edita los datos en `dist/content.js`, la estructura en `templates/`, el diseño en `dist/styles.css` y las interacciones en `dist/app.js`. Después de editar contenido o plantillas, ejecuta la construcción. `dist/index.html` y `dist/fundamentos.html` son archivos generados.

## Qué cubre

- HTML semántico, navegación, multimedia y contenido completo desde el servidor de archivos.
- Diseño responsive, teclado, foco visible, textos alternativos, subtítulos y movimiento reducido.
- Separación de contenido, presentación, interacción y generación de HTML.
- Página pública de fundamentos y sección visual del proceso de desarrollo.
- SEO básico y, al publicar, canonical, Open Graph, Person JSON-LD, robots y sitemap con la URL real.
- Pruebas automatizadas del contenido, SEO, rutas, respuestas HTTP y reproducción por rangos.
- Flujo de GitHub Actions que verifica y publica `dist/` en GitHub Pages.

## Documentación de la entrega

- [Correspondencia con la presentación](docs/COBERTURA_PRESENTACION.md).
- [Decisiones de arquitectura y hosting](docs/ARQUITECTURA.md).
- [Cómo subir y publicar](docs/PUBLICAR.md).
- [Verificación y límites](docs/VERIFICACION.md).

La cobertura diferencia los fundamentos aplicados, las alternativas analizadas y las ampliaciones fuera de alcance. No se simula una base de datos, un CMS, pagos ni analítica. Esas opciones se explican y justifican según el tipo de web. Los estudios se reproducen según la hoja de vida; no se incluyen el identificador personal, el documento original ni las referencias de terceros. Los idiomas siguen sin nivel.

Las fuentes Anton y DM Sans conservan sus licencias en `dist/assets/`. La fotografía de perfil es la proporcionada por Stefany. La imagen de escritorio es ambiental. El video de Amor y Paz se compone de capturas reales del prototipo aportado, con transiciones; no acredita ventas, clientes ni pagos reales.
