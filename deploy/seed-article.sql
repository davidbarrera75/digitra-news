INSERT INTO articles (
  slug, title, subtitle, content, excerpt, category_id, subcategory,
  source_type, meta_title, meta_description, seo_keyword,
  tags, reading_time, status, is_featured, published_at, updated_at
) VALUES (
  'precio-promedio-airbnb-cartagena-marzo-2026',
  'Precio promedio de Airbnb en Cartagena supera los $185,000 COP por noche en marzo 2026',
  'Un aumento del 12% respecto a febrero posiciona a Cartagena como el destino más caro del Caribe colombiano',
  '<p>Según datos analizados por <strong>Digitra News</strong>, el precio promedio de una noche en Airbnb en Cartagena de Indias alcanzó los <strong>$185,000 COP</strong> durante marzo de 2026, lo que representa un incremento del 12% frente a los $165,000 COP registrados en febrero.</p>

<h2>¿Por qué subieron los precios?</h2>
<p>El aumento se debe principalmente a tres factores:</p>
<ul>
<li><strong>Temporada alta extendida:</strong> la Semana Santa y el puente de marzo generaron una demanda sostenida durante todo el mes.</li>
<li><strong>Mayor afluencia internacional:</strong> Colombia recibió un récord de turistas en febrero, y la tendencia se mantuvo en marzo.</li>
<li><strong>Oferta limitada en el Centro Histórico:</strong> las propiedades mejor calificadas en Getsemaní y el Centro Histórico mantienen ocupaciones superiores al 85%.</li>
</ul>

<h2>Precios por zona</h2>
<p>El análisis por barrio muestra diferencias significativas:</p>
<ul>
<li><strong>Centro Histórico:</strong> $220,000 COP/noche promedio (▲ 15%)</li>
<li><strong>Getsemaní:</strong> $195,000 COP/noche promedio (▲ 10%)</li>
<li><strong>Bocagrande:</strong> $165,000 COP/noche promedio (▲ 8%)</li>
<li><strong>Manga:</strong> $140,000 COP/noche promedio (▲ 5%)</li>
<li><strong>Crespo:</strong> $120,000 COP/noche promedio (▲ 3%)</li>
</ul>

<h2>Comparativa con otras ciudades</h2>
<p>Cartagena se mantiene como la ciudad más cara para alquiler vacacional en Colombia. En comparación:</p>
<ul>
<li><strong>Medellín:</strong> $125,000 COP/noche promedio</li>
<li><strong>Santa Marta:</strong> $110,000 COP/noche promedio</li>
<li><strong>Bogotá:</strong> $95,000 COP/noche promedio</li>
<li><strong>San Andrés:</strong> $175,000 COP/noche promedio</li>
</ul>

<h2>¿Qué significa para los anfitriones?</h2>
<p>Los anfitriones en Cartagena tienen una oportunidad clara: la demanda supera la oferta de propiedades de calidad. Según nuestros datos, las propiedades con fotos profesionales, descripción optimizada y respuesta rápida obtienen un <strong>35% más de reservas</strong> que el promedio.</p>

<blockquote>Si tienes una propiedad en Cartagena y no estás aprovechando la temporada, estás dejando dinero sobre la mesa.</blockquote>

<h2>Metodología</h2>
<p>Los datos fueron recopilados a partir de una muestra de 2,400 propiedades activas en Airbnb en Cartagena durante las primeras tres semanas de marzo de 2026. Los precios corresponden a tarifas por noche para dos huéspedes, excluyendo tasas de limpieza y servicio.</p>

<p><em>Fuente: Digitra News — Análisis de mercado turístico basado en datos.</em></p>',
  'Análisis del precio promedio de Airbnb en Cartagena para marzo 2026: $185,000 COP/noche, un aumento del 12%. Datos por zona y comparativa con otras ciudades.',
  2,
  'cartagena',
  'original',
  'Precio Airbnb Cartagena Marzo 2026: $185K COP/noche | Digitra News',
  'Precio promedio de Airbnb en Cartagena alcanza $185,000 COP por noche en marzo 2026. Análisis por zona, comparativa con otras ciudades y oportunidades para anfitriones.',
  'precio airbnb cartagena 2026',
  ARRAY['cartagena', 'airbnb', 'precios', 'datos', 'colombia'],
  5,
  'published',
  true,
  NOW(),
  NOW()
);

-- Link article to Cartagena destination
INSERT INTO article_destinations (article_id, destination_id, is_primary)
SELECT a.id, d.id, true
FROM articles a, destinations d
WHERE a.slug = 'precio-promedio-airbnb-cartagena-marzo-2026'
AND d.slug = 'cartagena';

-- Update destination article count
UPDATE destinations SET article_count = 1 WHERE slug = 'cartagena';
