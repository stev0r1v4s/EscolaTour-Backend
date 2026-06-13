import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado de datos (seed) en PostgreSQL...');

  // 1. Limpiar base de datos
  await prisma.reservation.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('Limpieza completada.');

  // 2. Crear usuarios
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Administrador Scolatour',
      username: 'admin',
      email: 'admin@scolatour.com',
      password: hashedAdminPassword,
      role: 'Administrador',
      status: 'Activo'
    }
  });

  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const teacher = await prisma.user.create({
    data: {
      fullName: 'Docente Carlos Gómez',
      username: 'carlos.gomez',
      email: 'carlos@colegio.edu.co',
      password: hashedUserPassword,
      role: 'Usuario',
      status: 'Activo'
    }
  });

  console.log('Usuarios creados: admin (admin123) y carlos.gomez (user123)');

  // 3. Crear destinos
  const destinationsData = [
    {
      title: 'Parque Explora',
      location: 'Medellín, Colombia',
      price: 32000,
      category: 'Ciencia',
      description: 'Centro interactivo para la apropiación científica y tecnológica con más de 300 experiencias interactivas, planetario y el acuario de agua dulce más grande de Sudamérica.',
      imageUrl: '/uploads/images/seed-explora.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-explora-guia.pdf',
      benefits: [
        'Fichas didácticas de física y biología interactiva.',
        'Talleres guiados por divulgadores científicos.',
        'Cuestionarios alineados a las ciencias naturales.'
      ],
      latitude: 6.2708,
      longitude: -75.5644,
      rating: 4.8
    },
    {
      title: 'Museo del Oro',
      location: 'Bogotá, Colombia',
      price: 5000,
      category: 'Historia',
      description: 'Resguarda la colección de orfebrería prehispánica más grande del mundo. Un viaje extraordinario por las culturas, cosmologías y saberes metalúrgicos de las sociedades indígenas.',
      imageUrl: '/uploads/images/seed-museo-oro.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-museo-oro-guia.pdf',
      benefits: [
        'Guía interactiva sobre culturas indígenas prehispánicas.',
        'Evaluación formativa de historia precolombina.',
        'Material gráfico para recreación en el aula.'
      ],
      latitude: 4.6016,
      longitude: -74.0722,
      rating: 4.9
    },
    {
      title: 'Parque Nacional Natural Tayrona',
      location: 'Magdalena, Colombia',
      price: 45000,
      category: 'Biología',
      description: 'Santuario de biodiversidad que conecta la selva tropical húmeda con el mar Caribe. Hábitat de cientos de especies terrestres y marinas y lugar sagrado de las comunidades de la Sierra Nevada.',
      imageUrl: '/uploads/images/seed-tayrona.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-tayrona-guia.pdf',
      benefits: [
        'Identificación botánica in-situ.',
        'Módulo sobre ecosistemas litorales y conservación.',
        'Actividad didáctica de avistamiento de aves.'
      ],
      latitude: 11.3005,
      longitude: -74.0322,
      rating: 5.0
    },
    {
      title: 'Santuario de Las Lajas',
      location: 'Ipiales, Nariño',
      price: 15000,
      category: 'Arte',
      description: 'Considerado una joya arquitectónica de estilo neogótico, construido sobre un cañón en la cordillera de los Andes. Representa un hito de la ingeniería y de la historia artística del país.',
      imageUrl: '/uploads/images/seed-las-lajas.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-las-lajas-guia.pdf',
      benefits: [
        'Análisis de la arquitectura neogótica y técnicas de construcción.',
        'Taller de dibujo y perspectiva artística.',
        'Guía de contextualización histórico-religiosa.'
      ],
      latitude: 0.8053,
      longitude: -77.5858,
      rating: 4.7
    },
    {
      title: 'Casa Museo Gabriel García Márquez',
      location: 'Aracataca, Magdalena',
      price: 8000,
      category: 'Literatura',
      description: 'Reconstrucción de la casa natal del Premio Nobel de Literatura. Permite a los estudiantes sumergirse en los rincones cotidianos que inspiraron el realismo mágico y Macondo.',
      imageUrl: '/uploads/images/seed-gabo.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-gabo-guia.pdf',
      benefits: [
        'Taller de redacción y apreciación del realismo mágico.',
        'Lecturas guiadas sobre fragmentos de Cien Años de Soledad.',
        'Cronograma interactivo de la vida del autor.'
      ],
      latitude: 10.5919,
      longitude: -74.1869,
      rating: 4.6
    },
    {
      title: 'Desierto de la Tatacoa',
      location: 'Villavieja, Huila',
      price: 25000,
      category: 'Geografía',
      description: 'Segunda zona árida más grande del país. Destino idóneo para observar el relieve sedimentario y para realizar astronomía de nivel escolar debido a su baja contaminación lumínica.',
      imageUrl: '/uploads/images/seed-tatacoa.jpg',
      pedagogicalGuideUrl: '/uploads/documents/seed-tatacoa-guia.pdf',
      benefits: [
        'Clase práctica de geología de zonas semiáridas.',
        'Taller astronómico nocturno con telescopio.',
        'Estudio del ecosistema xerófilo.'
      ],
      latitude: 3.2325,
      longitude: -75.1664,
      rating: 4.8
    }
  ];

  const destinations = [];
  for (const dest of destinationsData) {
    const d = await prisma.destination.create({ data: dest });
    destinations.push(d);
  }
  console.log(`${destinations.length} destinos educativos creados.`);

  // 4. Crear tickets de soporte
  await prisma.supportTicket.create({
    data: {
      userId: teacher.id,
      subject: 'Problema al descargar Guía Pedagógica',
      message: 'Buenas tardes. Intento descargar el PDF del Museo del Oro desde mi celular pero el enlace no responde. Agradezco su soporte.',
      status: 'Pendiente'
    }
  });

  await prisma.supportTicket.create({
    data: {
      userId: teacher.id,
      subject: 'Sugerencia de nueva categoría',
      message: 'Me gustaría sugerir la categoría "Música Escolar" en los filtros de búsqueda.',
      status: 'Resuelto'
    }
  });

  console.log('Tickets de soporte de prueba creados.');

  // 5. Crear reservas (una este mes para el KPI)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  await prisma.reservation.create({
    data: {
      userId: teacher.id,
      destinationId: destinations[0].id, // Parque Explora
      startDate: tomorrow,
      endDate: dayAfter,
      numTeachers: 3,
      numStudents: 42
    }
  });

  console.log('Reservas de prueba creadas.');
  console.log('¡Sembrado de datos finalizado con éxito en PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('Error al sembrar base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
