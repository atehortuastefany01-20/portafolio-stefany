# Verificación

## Comprobaciones automatizadas

- Construcción de las dos páginas y comprobación de recursos, fuentes, enlaces internos y enlaces entre páginas.
- Contenido completo en HTML sin depender de JavaScript; cuatro estudios con estado real; portada sin foto y ausencia de nivel de inglés e identificador personal.
- Escape de contenido y rechazo de rutas de medios externas o con recorrido de directorios.
- Canonical, sitemap y metadatos sociales para URL pública; noindex y ausencia de canonical para desarrollo local.
- HTTP de ambas páginas, MIME de video y subtítulos, reproducción parcial de video, rangos inválidos, archivo inexistente, método no permitido, URL malformada y bloqueo de rutas externas.

Comandos reproducibles:

```sh
node scripts/build.mjs
node --check dist/app.js
node scripts/check.mjs
node --test tests/*.test.mjs
```

## Revisión en navegador

Se revisan composición en escritorio y móvil, ausencia de desbordamiento horizontal, menú, video y acceso a fundamentos. El resultado de la revisión final acompaña la entrega.

## Límites

No se ha ejecutado una auditoría completa WCAG ni una medición Lighthouse. Las pruebas locales no certifican todos los navegadores o dispositivos. GitHub Actions y el dominio público solo pueden verificarse después de subir y activar Pages en la cuenta de la autora. La construcción usa la URL real del alojamiento para evitar enlaces canónicos inventados. No se afirma una posición SEO, una cantidad de visitas ni resultados comerciales.
