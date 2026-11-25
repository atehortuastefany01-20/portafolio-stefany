/* Edita únicamente los valores de este archivo para personalizar el portafolio.
   Las cadenas vacías se muestran como espacios pendientes; no generan datos ficticios.
   Las rutas de fotos son relativas a index.html.
   La fotografía se utiliza únicamente en el perfil personal. */
window.PORTFOLIO = {
  name: 'Stefany',
  fullName: 'Stefany Atehortua Rivera',
  discipline: 'Desarrolladora de software',
  tagline: 'Interfaces funcionales. Datos organizados. Soluciones prácticas.',
  bio: 'Mi enfoque combina desarrollo web, gestión de datos y soporte técnico para crear soluciones claras y funcionales. Como técnica en Sistemas Teleinformáticos, aporto pensamiento lógico, atención al detalle y una forma de trabajo organizada y colaborativa.',
  personalNote: 'Pensamiento lógico. Atención al detalle.',
  education: 'Formación en Sistemas Teleinformáticos · SENA.',
  educationHistory: [
    { year: '2026', title: 'Tecnología en Análisis y Desarrollo de Software', institution: 'Servicio Nacional de Aprendizaje (SENA)', status: 'En curso' },
    { year: '2025', title: 'Técnico en Sistemas Teleinformáticos', institution: 'Servicio Nacional de Aprendizaje (SENA)' },
    { year: '2025', title: 'Curso en Marketing Digital', institution: 'Servicio Nacional de Aprendizaje (SENA)' },
    { year: '2025', title: 'Bachiller académico', institution: 'IED Manuel Cepeda Vargas' },
  ],
  languages: [
    { name: 'Español' },
    { name: 'Inglés' },
  ],
  portrait: 'assets/stefany-retrato.webp',
  portraitAlt: 'Stefany Atehortua Rivera, de cabello oscuro y gafas de montura clara.',
  email: 'atehortuastefany01@gmail.com',
  phone: '+573114457236',
  phoneDisplay: '311 445 7236',
  location: 'Bogotá, Colombia',
  github: 'https://github.com/atehortuastefany01-20',
  linkedin: 'https://www.linkedin.com/in/stefany-atehortua-rivera-431aa43ab/',
  skills: [
    { name: 'Lenguajes', items: ['JavaScript', 'Python'] },
    { name: 'Desarrollo web', items: ['HTML', 'CSS', 'React'] },
    { name: 'Datos relacionales', items: ['SQL', 'MySQL'] },
    { name: 'Datos NoSQL', items: ['MongoDB'] },
    { name: 'Productividad', items: ['Word', 'Excel', 'PowerPoint', 'Google Docs', 'Google Drive'] },
  ],
  /* Ejemplo de estructura, sin datos atribuidos:
     { title: '', kind: '', summary: '', challenge: '', contribution: '',
       result: '', technologies: [], image: '', url: '', repository: '' } */
  projects: [
    {
      title: 'Amor y Paz',
      url: 'https://atehortuastefany01-20.github.io/amor-y-paz-landing/',
      kind: 'E-commerce · Prototipo frontend',
      summary: 'Recorrido por el catálogo, la búsqueda, las opciones de producto y el carrito de una tienda de moda.',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      video: 'assets/amor-y-paz.mp4',
      image: 'assets/amor-y-paz-poster.jpg',
      captions: 'assets/amor-y-paz.vtt',
    },
  ],
  /* Banners reales de marketing. Añade image, alt y, opcionalmente, title.
     El segundo espacio de proyectos se convierte en carrusel al añadir imágenes. */
  marketingBanners: [],
  services: [
    'Desarrollo web con HTML, CSS y React',
    'Bases de datos SQL, MySQL y MongoDB',
    'Mantenimiento preventivo y atención a usuarios',
    'Creación y seguimiento de tickets de soporte',
    'Instalación y organización de cableado estructurado',
  ],
};
