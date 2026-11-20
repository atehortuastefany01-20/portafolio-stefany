# Portafolio de Stefany Atehortua Rivera

Portafolio personal con diseño editorial, fotografía en la sección de perfil, habilidades, formación, servicios y contacto. Incluye dos espacios de proyectos: el video de Amor y Paz y un espacio disponible.

## Vista local

Abre `dist/index.html` o ejecuta desde esta carpeta:

```sh
node scripts/serve.mjs
```

Visita http://127.0.0.1:4173. No requiere instalar dependencias ni compilar.

## Estructura

- `dist/index.html`: estructura y secciones.
- `dist/styles.css`: diseño, transiciones y adaptación a pantallas.
- `dist/app.js`: componentes e interacciones.
- `dist/content.js`: contenido personal editable.
- `dist/assets/`: fotografías, fuentes con sus licencias y video.
- `scripts/check.mjs`: comprobación de recursos y enlaces internos.
- `scripts/serve.mjs`: servidor local con soporte de reproducción de video por rangos.

## Fundamentos aplicados

La web tiene arquitectura estática con interacciones en JavaScript en el navegador. Utiliza HTML semántico, CSS con Grid y Flexbox, navegación por secciones, menú móvil y multimedia con controles nativos. Incluye textos alternativos, navegación por teclado, subtítulos descriptivos del video y respeto por la preferencia de movimiento reducido.

Las imágenes optimizadas, las fuentes locales, la carga diferida de imágenes y la precarga de metadatos del video reducen peticiones y descargas iniciales. El documento incluye título y descripción básicos.

No implementa backend, base de datos, CMS, analítica, CRM ni pagos. Su presencia como temas en la presentación de referencia no implica que estén implementados ni que se atribuyan como competencias a la autora. El video de Amor y Paz muestra estados reales del prototipo proporcionado, mediante capturas con transiciones.

## Verificación

```sh
node --check dist/app.js
node scripts/check.mjs
```

Las fuentes incluyen sus respectivas licencias en `dist/assets/`. La fotografía pertenece a la autora. No se incluyen el documento de identidad, la hoja de vida original ni referencias personales de terceros.
