export type Locale = 'es' | 'en'

type TranslationDict = Record<string, string>

const es: TranslationDict = {
  // Navbar
  'nav.home': 'Inicio',
  'nav.destinations': 'Destinos',
  'nav.data': 'Data Turismo',
  'nav.trends': 'Tendencias',
  'nav.rental': 'Alquiler Vacacional',
  'nav.news': 'Noticias',
  'nav.pulse': 'Pulse',
  'nav.search': 'Buscar',
  'nav.about': 'Acerca de',
  'nav.contact': 'Contacto',

  // Homepage
  'home.hero.badge': 'Inteligencia turística',
  'home.hero.title': 'Turismo basado en datos',
  'home.hero.subtitle': 'El primer medio turístico basado en datos de Latinoamérica',
  'home.pulse.title': 'Pulse Hoy',
  'home.pulse.subtitle': 'Indicadores turísticos en tiempo real',
  'home.sectors.title': 'Noticias del Sector',
  'home.sectors.badge': 'Actualización diaria',
  'home.destinations.title': 'Destinos Populares',
  'home.categories.title': 'Explora por categoría',
  'home.cta.title': '¿Tienes una propiedad vacacional?',
  'home.cta.subtitle': 'Crea tu página profesional gratis en Digitra Rentals',
  'home.cta.button': 'Crear mi página gratis',

  // Articles
  'article.readMore': 'Leer más',
  'article.relatedArticles': 'Artículos relacionados',
  'article.publishedOn': 'Publicado el',
  'article.share': 'Compartir',
  'article.readingTime': '{min} min de lectura',
  'article.tags': 'Etiquetas',
  'article.source': 'Fuente',

  // Pulse
  'pulse.title': 'Digitra Pulse',
  'pulse.subtitle': 'Indicadores turísticos en tiempo real para {count} ciudades colombianas',
  'pulse.score': 'Score',
  'pulse.weather': 'Clima',
  'pulse.flights': 'Vuelos',
  'pulse.accommodation': 'Alojamiento',
  'pulse.events': 'Eventos',
  'pulse.season': 'Temporada',
  'pulse.updated': 'Actualizado hoy',
  'pulse.summary': 'Resumen IA',

  // Destinations
  'destinations.title': 'Destinos',
  'destinations.subtitle': 'Guías turísticas basadas en datos',
  'destinations.explore': 'Explorar destino',
  'destinations.articles': '{count} artículos',

  // Search
  'search.title': 'Buscar',
  'search.placeholder': 'Buscar artículos, destinos, datos...',
  'search.noResults': 'No se encontraron resultados para "{query}"',
  'search.results': '{count} resultados para "{query}"',

  // Footer
  'footer.brand': 'El primer medio turístico basado en datos de Latinoamérica.',
  'footer.sections': 'Secciones',
  'footer.digitra': 'Digitra',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterText': 'Datos y tendencias del turismo en LATAM, cada semana.',
  'footer.rights': 'Todos los derechos reservados',
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos y Condiciones',
  'footer.editorial': 'Política Editorial',

  // Common
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.back': 'Volver',
  'common.seeAll': 'Ver todo',
  'common.share': 'Compartir',
}

const en: TranslationDict = {
  // Navbar
  'nav.home': 'Home',
  'nav.destinations': 'Destinations',
  'nav.data': 'Tourism Data',
  'nav.trends': 'Trends',
  'nav.rental': 'Vacation Rental',
  'nav.news': 'News',
  'nav.pulse': 'Pulse',
  'nav.search': 'Search',
  'nav.about': 'About',
  'nav.contact': 'Contact',

  // Homepage
  'home.hero.badge': 'Tourism intelligence',
  'home.hero.title': 'Data-driven tourism',
  'home.hero.subtitle': 'Latin America\'s first data-driven tourism media',
  'home.pulse.title': 'Pulse Today',
  'home.pulse.subtitle': 'Real-time tourism indicators',
  'home.sectors.title': 'Sector News',
  'home.sectors.badge': 'Daily update',
  'home.destinations.title': 'Popular Destinations',
  'home.categories.title': 'Explore by category',
  'home.cta.title': 'Do you own a vacation rental?',
  'home.cta.subtitle': 'Create your free professional page on Digitra Rentals',
  'home.cta.button': 'Create my free page',

  // Articles
  'article.readMore': 'Read more',
  'article.relatedArticles': 'Related articles',
  'article.publishedOn': 'Published on',
  'article.share': 'Share',
  'article.readingTime': '{min} min read',
  'article.tags': 'Tags',
  'article.source': 'Source',

  // Pulse
  'pulse.title': 'Digitra Pulse',
  'pulse.subtitle': 'Real-time tourism indicators for {count} Colombian cities',
  'pulse.score': 'Score',
  'pulse.weather': 'Weather',
  'pulse.flights': 'Flights',
  'pulse.accommodation': 'Accommodation',
  'pulse.events': 'Events',
  'pulse.season': 'Season',
  'pulse.updated': 'Updated today',
  'pulse.summary': 'AI Summary',

  // Destinations
  'destinations.title': 'Destinations',
  'destinations.subtitle': 'Data-driven travel guides',
  'destinations.explore': 'Explore destination',
  'destinations.articles': '{count} articles',

  // Search
  'search.title': 'Search',
  'search.placeholder': 'Search articles, destinations, data...',
  'search.noResults': 'No results found for "{query}"',
  'search.results': '{count} results for "{query}"',

  // Footer
  'footer.brand': 'Latin America\'s first data-driven tourism media.',
  'footer.sections': 'Sections',
  'footer.digitra': 'Digitra',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterText': 'Tourism data and trends in LATAM, every week.',
  'footer.rights': 'All rights reserved',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms & Conditions',
  'footer.editorial': 'Editorial Policy',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.back': 'Back',
  'common.seeAll': 'See all',
  'common.share': 'Share',
}

export const translations: Record<Locale, TranslationDict> = { es, en }
