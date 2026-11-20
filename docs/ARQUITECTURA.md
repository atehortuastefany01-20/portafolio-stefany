# Memoria de arquitectura

## Objetivo y personas

Presentar a Stefany Atehortua Rivera ante empresas, clientes y aliados. La visita debe permitir identificar su perfil, conocimientos, formación, proyectos y medios de contacto. La información procede de la hoja de vida y del prototipo Amor y Paz. Las referencias visuales aportadas determinan la dirección editorial: crema, rosado, tipografía condensada y fotografía únicamente en el perfil.

## Arquitectura elegida

```text
content.js + templates/
          |
     build.mjs (Node.js)
          |
     HTML completo + CSS + JS + multimedia (dist/)
          |
   GitHub Actions: comprobar y publicar
          |
    GitHub Pages / HTTPS
          |
       Navegador
```

`render.mjs` escapa texto y valida rutas de medios. La construcción publica contenido completo en HTML para lectura sin JavaScript y rastreo. `app.js` mejora la experiencia mediante menú, transiciones y diálogo. El modelo de datos está separado del estilo. El sitio funciona desde archivos locales; el servidor de desarrollo permite probar tipos MIME, subtítulos y peticiones de video parciales.

## Estática frente a dinámica

Una web estática distribuye archivos construidos previamente. Puede incorporar interacciones en JavaScript. Una aplicación dinámica con cuentas, pedidos persistentes o edición en línea necesitaría backend, almacenamiento y controles adicionales. El portafolio tiene un único perfil y actualizaciones editoriales; la generación estática reduce las dependencias y facilita mantenimiento. Node.js se usa en la construcción y desarrollo; no es un backend en producción.

## Infraestructura y alternativas

| Opción | Características | Decisión en este proyecto |
| --- | --- | --- |
| Hosting estático (GitHub Pages) | Distribuye HTML, CSS, JS y medios; integrado con Git y Actions | Elegido por el alcance estático y la publicación versionada |
| Compartido | Recursos del servidor compartidos; habitual para CMS y sitios pequeños | Alternativa si se adopta un CMS compatible |
| VPS | Entorno virtual administrable, con mayor responsabilidad operativa | Justificable con una aplicación backend y necesidades específicas |
| Dedicado | Servidor completo y mayor administración | No justificado para este portafolio |

Un dominio propio es opcional. Su registro, DNS y certificados no se han configurado. GitHub Pages proporcionará la URL real al activar la publicación; el workflow la utiliza para generar SEO. La carpeta entregada no afirma estar publicada ni incluye una URL de producción inventada.

## CMS y base de datos

El contenido editable en archivo no es un CMS con panel. Git permite revisión, historial y recuperación. Un CMS tendría sentido si se necesitara edición por personas sin acceso al código; una base de datos, si hubiera usuarios, pedidos, contenido colaborativo o datos persistentes. SQL y MongoDB figuran en el perfil por la hoja de vida, no como dependencias de este sitio.

## Usabilidad, recursos y SEO

La navegación une las secciones del portafolio y la página técnica. El video tiene controles y subtítulos; no se inicia automáticamente. La fotografía dispone de descripción y dimensiones. CSS reorganiza las columnas en móvil y reconoce movimiento reducido. Las fuentes son locales y los medios se cargan de forma contenida.

Al construir con `SITE_URL` HTTPS se generan canonical, metadatos sociales, datos estructurados Person, sitemap y robots. Sin URL pública se emite noindex para la copia de desarrollo. El sitemap incluye las dos páginas, no los fragmentos de sección. No se prometen resultados de búsqueda ni certificaciones WCAG o puntuaciones Lighthouse.

## Crecimiento, medición y mantenimiento

La web actúa como centro de información y conecta correo y perfiles profesionales. El plan de difusión puede enlazar proyectos y conocimientos desde redes hacia el portafolio. La llamada a contacto es el punto de conversión. La analítica, las campañas y un CRM se analizan como ampliaciones; no se cargan rastreadores ni se muestran cifras inventadas. Se plantea medir contactos iniciados y consultas a proyectos con una herramienta futura, después de configurar cuenta, finalidad y tratamiento de datos.

Las actualizaciones pasan por contenido, construcción, pruebas y publicación. Git conserva el historial. Los cambios se pueden revertir mediante commits y una nueva publicación; las fuentes originales y medios incluidos permiten reconstruir el sitio.

## Fuentes técnicas

- [Flujos personalizados de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Metadatos de configure-pages](https://github.com/actions/configure-pages/blob/main/action.yml).
- [Sitemaps en Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

El documento de referencia conceptual es Digital_Architecture_Blueprint.pdf. Sus ejemplos de comercio, Wikipedia, CMS y analítica se analizan como alternativas, sin atribuir su implementación a este portafolio.
