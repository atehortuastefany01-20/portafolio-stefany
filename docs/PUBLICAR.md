# Abrir, subir y publicar

## Ver en el equipo

Abre el `index.html` de la carpeta principal. Para usar servidor local y subtítulos:

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Visita http://127.0.0.1:4174. La terminal debe permanecer abierta. Si el puerto está ocupado, el servidor muestra la dirección para abrirlo o puedes cambiarlo con `$env:PORT = '4175'` antes de iniciarlo.

## Subir esta versión independiente

Esta carpeta tiene su propio repositorio Git local y commit. No contiene el remoto ni la configuración de alojamiento de la versión anterior. Crea en tu cuenta un repositorio vacío, por ejemplo `portafolio-stefany-fundamentos`, sin README ni licencia adicionales. Desde esta carpeta:

```powershell
git remote add origin https://github.com/atehortuastefany01-20/portafolio-stefany-fundamentos.git
git push -u origin main
```

Si eliges otro nombre, cambia la URL por la que GitHub muestra al crear el repositorio. Inicia sesión cuando Git solicite autorización. No se incluyen contraseñas ni tokens en el proyecto.

## Activar la web pública

En el repositorio, abre **Settings > Pages > Build and deployment > Source > GitHub Actions**. En **Actions**, ejecuta **Verificar y publicar portafolio > Run workflow** si el primer intento ocurrió antes de activar Pages.

El flujo comprueba el código, genera el sitio usando la URL real que devuelve configure-pages y publica únicamente `dist/`. El paso deploy deja el enlace definitivo. Comprueba que termine correctamente antes de compartir ese enlace. Tener el repositorio subido no confirma por sí solo que el despliegue haya finalizado.

## Publicar en otro hosting

Configura `publicUrl` en `site.config.json` con la dirección HTTPS definitiva o utiliza la variable de entorno `SITE_URL`. Ejecuta `node scripts/build.mjs` y carga el contenido de `dist/` en el alojamiento estático. No subas templates, tests ni scripts como sitio público.

## Fuente

[GitHub Docs: publicación mediante workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
