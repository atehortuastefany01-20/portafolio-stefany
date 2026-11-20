# Correspondencia con Digital Architecture Blueprint

La presentación contiene 13 láminas conceptuales. Se cubren mediante implementación y decisiones documentadas según su aplicabilidad a un portafolio personal. No todos sus ejemplos son funcionalidades obligatorias de este tipo de sitio.

| Lámina / tema | Aplicación o análisis | Evidencia |
| --- | --- | --- |
| 1. Sede digital central | Objetivo, público y estructura de la presencia personal | ARQUITECTURA.md; portada, perfil y contacto |
| 2. Anatomía web | HTML semántico, enlaces internos y entre páginas, foto y video con controles | templates/, dist/, scripts/check.mjs |
| 3. Estática y dinámica | Generación estática y mejora con JavaScript; comparación con backend dinámico | scripts/build.mjs, render.mjs; ARQUITECTURA.md |
| 4. Web personal y autoridad | Identidad propia, conocimientos verificables, proyectos y contacto; sin testimonios inventados | Portafolio y content.js |
| 5. Operación comercial | Se presenta prototipo real Amor y Paz en video. Se explica diferencia entre catálogo frontend, tienda con pagos, soporte y CRM | Proyectos; fundamentos.html; ARQUITECTURA.md |
| 6. Colaboración abierta | Git para versionado y revisión del código; se analiza por qué un sitio estilo Wikipedia requeriría permisos, backend y datos | Historial Git local; fundamentos.html |
| 7. Idea a lanzamiento | Objetivos, referencias, estructura, contenido, construcción, pruebas y publicación | Sección Proceso; plantillas, tests y workflow |
| 8. Superficie e infraestructura | Se separan presentación, generación, archivos, hosting; CMS y bases de datos se justifican como opciones | ARQUITECTURA.md; página de fundamentos |
| 9. Mobile-first y adaptabilidad | Se conserva el diseño responsive aprobado y se añade contenido técnico con reglas de base móvil y ampliación de columnas en escritorio | CSS, menú móvil, verificación en navegador |
| 10. Tipos de hosting | Tabla de estático, compartido, VPS y dedicado; selección de Pages para este alcance | ARQUITECTURA.md; PUBLICAR.md |
| 11. Inbound marketing | Descubrimiento mediante SEO, contenido de proyectos y contacto; analítica y CRM como plan futuro | Metadata generada, proceso, contacto y plan de medición |
| 12. Web y redes | Contenido propio versionado; conexión con GitHub, LinkedIn y correo | content.js; contacto; ARQUITECTURA.md |
| 13. Ecosistema integrado | Portafolio como centro, perfiles como canales y contacto como conversión; se distingue medición planificada de analítica operativa | Página de fundamentos y memoria |

## Alcance entregado

Implementados: sitio estático completo, interfaz responsive, multimedia, accesibilidad básica, HTML prerenderizado, generación SEO, servidor de pruebas, pruebas automatizadas y workflow de publicación preparado.

Analizados y justificados: CMS, base de datos, arquitectura dinámica, infraestructura alternativa, comercio con pagos, colaboración con cuentas, analítica, CRM y campañas. No se incorporan servicios ficticios para simular que estas funciones existen.

Pendiente externo: crear o seleccionar el repositorio de destino, subir este código y activar GitHub Pages. Hasta ejecutarse ese paso, el despliegue público no está verificado. El dominio propio y las cuentas de analítica son opcionales y no se han contratado ni configurado.
