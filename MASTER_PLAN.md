# DIGITRA.NEWS — Master Plan Definitivo
## El Primer Medio Turístico Basado en Datos de LATAM

Autor: David Barrera
Fecha: 6 Marzo 2026

---

## 1. VISIÓN

Digitra.news es un medio digital especializado en turismo y alquiler vacacional en Latinoamérica. No es un blog de viajes genérico — es un medio editorial que genera contenido basado en datos reales: precios de Airbnb, tendencias de búsqueda, ocupación hotelera, análisis de mercado.

**Objetivo:** Convertirse en fuente citada por Google, ChatGPT, Perplexity y Gemini cuando alguien pregunte sobre turismo en LATAM.

**Modelo de negocio:**
- Tráfico SEO → funnel hacia digitra.rentals (captar anfitriones)
- Autoridad de marca → posicionamiento Digitra en LATAM
- Futuro: ads, afiliados, reportes premium

---

## 2. STACK TÉCNICO

```
Framework:    Next.js 14 + TypeScript + Tailwind CSS
Database:     PostgreSQL 17 (DB: digitra_news)
ORM:          Prisma 6
Auth:         NextAuth v4 (credentials, solo admin)
AI:           Claude Haiku 4.5 (curación) + Claude Sonnet 4 (artículos)
Editor:       Tiptap (rich text)
Imágenes:     Unsplash API + fotos digitra.rentals + gráficos generados
Analytics:    GA4 (property dedicada)
Deploy:       Docker (puerto 3004) + Nginx + SSL
VPS:          31.97.42.156
```

---

## 3. CATEGORÍAS (5 categorías limpias, sin solapamiento)

| Ruta | Nombre | Contenido | Tipo |
|------|--------|-----------|------|
| `/destinos/` | Destinos | Guías, experiencias, rutas por ciudad | Original |
| `/datos/` | Data Turismo | Precios, ocupación, rankings, reportes | **Diferenciador** |
| `/tendencias/` | Tendencias | Búsquedas, proyecciones, análisis industria | Híbrido |
| `/alquiler-vacacional/` | Alquiler Vacacional | Tips anfitriones, comparativas, cómo elegir | **Funnel** |
| `/noticias/` | Noticias | Curación diaria del sector turístico | Automático/IA |

---

## 4. CLUSTERS DE CONTENIDO

### CLUSTER 1 — DESTINOS
```
/destinos/cartagena/
/destinos/medellin/
/destinos/santa-marta/
/destinos/guatape/
/destinos/san-andres/
/destinos/bogota/
/destinos/cancun/
/destinos/tulum/
/destinos/lima/
```

Artículos ejemplo:
- Mejores barrios para hospedarse en Cartagena
- Guía completa para visitar Guatapé en 2026
- Las 10 playas más buscadas del Caribe colombiano
- Qué hacer en Medellín: experiencias únicas
- Mejores restaurantes frente al mar en Santa Marta

### CLUSTER 2 — DATA TURISMO (el más poderoso)
```
/datos/precios-airbnb/
/datos/ocupacion/
/datos/destinos-populares/
/datos/reportes/
```

Artículos ejemplo:
- Precio promedio de Airbnb en Cartagena — Marzo 2026
- Ciudades con mayor ocupación turística en Colombia
- Ranking: destinos más reservados en LATAM este mes
- Reporte trimestral: turismo en Colombia Q1 2026
- Comparativa de precios: Airbnb vs Booking en 5 ciudades

### CLUSTER 3 — TENDENCIAS
```
/tendencias/busquedas/
/tendencias/viajeros/
/tendencias/mercado/
```

Artículos ejemplo:
- Qué destinos buscan más los turistas este mes
- Tendencias de viajes en Colombia 2026
- El turismo rural crece 40% en LATAM: análisis de datos
- Perfil del viajero digital en 2026

### CLUSTER 4 — ALQUILER VACACIONAL (funnel a rentals)
```
/alquiler-vacacional/airbnb/
/alquiler-vacacional/booking/
/alquiler-vacacional/consejos-anfitriones/
```

Artículos ejemplo:
- Cómo elegir un Airbnb seguro en Colombia
- Airbnb vs hoteles: cuándo conviene cada uno
- 7 errores que cometen los anfitriones nuevos en Airbnb
- Cómo crear una página de reservas para tu propiedad [CTA DIRECTO]
- Guía para anfitriones: optimiza tu listing y duplica reservas

### CLUSTER 5 — NOTICIAS (curación)
```
/noticias/colombia/
/noticias/latam/
/noticias/industria/
```

Artículos ejemplo:
- Colombia recibe récord de turistas en febrero 2026
- Airbnb lanza nueva política de cancelación en LATAM
- Cartagena entre los 10 destinos más buscados del mundo

---

## 5. ESTRUCTURA DE URLs

Formato: `/categoria/ciudad-o-subtema/slug-del-articulo`

```
digitra.news/destinos/cartagena/mejores-barrios-para-hospedarse
digitra.news/datos/precios-airbnb/precio-promedio-cartagena-marzo-2026
digitra.news/tendencias/busquedas/destinos-mas-buscados-marzo-2026
digitra.news/alquiler-vacacional/consejos-anfitriones/errores-nuevos-anfitriones
digitra.news/noticias/colombia/record-turistas-febrero-2026
```

---

## 6. DISEÑO VISUAL

### Inspiración
Bloomberg + Apple News + NYT — editorial, limpio, data-driven.

### Paleta de colores
```
Primario:     #0F172A  (slate-900 — editorial, serio)
Acento:       #0EA5E9  (sky-500 — viajes, confianza, datos)
Secundario:   #10B981  (emerald-500 — crecimiento, positivo)
Superficie:   #F8FAFC  (slate-50 — fondo claro)
Texto:        #1E293B  (slate-800 — lectura cómoda)
Bordes:       #E2E8F0  (slate-200)
Highlight:    #FEF3C7  (amber-100 — datos destacados)
```

### Tipografía
```
Titulares:    Playfair Display (serif — editorial, autoridad)
Cuerpo:       Inter (sans-serif — legibilidad)
Datos/código: JetBrains Mono (monospace — gráficos, cifras)
```

### Layout — Home Page
```
┌─────────────────────────────────────────────────────┐
│  DIGITRA.NEWS    Destinos Datos Tendencias  Buscar  │
│                  Alquiler Noticias                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────┐  ┌────────┐┌────────┐│
│  │                          │  │ Art 2  ││ Art 3  ││
│  │    HERO — ARTÍCULO       │  │ thumb  ││ thumb  ││
│  │    PRINCIPAL              │  │ título ││ título ││
│  │    foto grande            │  │ fecha  ││ fecha  ││
│  │    titular fuerte         │  ├────────┤├────────┤│
│  │    categoría + fecha      │  │ Art 4  ││ Art 5  ││
│  │                          │  │        ││        ││
│  └──────────────────────────┘  └────────┘└────────┘│
│                                                     │
├─────────────────────────────────────────────────────┤
│  DATA TURISMO            pill: "Basado en datos"    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Precio   │ │ Ocupación│ │ Ranking  │            │
│  │ promedio │ │ por      │ │ destinos │            │
│  │ Airbnb   │ │ ciudad   │ │ más      │            │
│  │ Cartagen │ │          │ │ buscados │            │
│  │ $180K/n  │ │ 72%      │ │ 1.Cartag │            │
│  │ ▲ 12%    │ │ ▲ 5%     │ │ 2.Medell │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│  Tarjetas con mini-gráficos y cifras destacadas     │
├─────────────────────────────────────────────────────┤
│  DESTINOS POPULARES                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │CTG │ │MDE │ │SMR │ │BOG │ │SAI │               │
│  │foto│ │foto│ │foto│ │foto│ │foto│               │
│  │3art│ │5art│ │2art│ │4art│ │1art│               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
├─────────────────────────────────────────────────────┤
│  TENDENCIAS                    ALQUILER VACACIONAL  │
│  ┌──────┐┌──────┐┌──────┐    ┌──────┐┌──────┐     │
│  │trend1││trend2││trend3│    │tip1  ││tip2  │     │
│  └──────┘└──────┘└──────┘    └──────┘└──────┘     │
│                                                     │
│                    CTA BANNER                        │
│  ┌─────────────────────────────────────────────┐    │
│  │  ¿Tienes una propiedad vacacional?          │    │
│  │  Crea tu página de reservas GRATIS →        │    │
│  │  [digitra.rentals]                          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  NOTICIAS (curación)                                │
│  ┌──────┐┌──────┐┌──────┐┌──────┐                  │
│  │Fuente││Fuente││Fuente││Fuente│                  │
│  │Título││Título││Título││Título│                  │
│  │Resumn││Resumn││Resumn││Resumn│                  │
│  └──────┘└──────┘└──────┘└──────┘                  │
├─────────────────────────────────────────────────────┤
│  NEWSLETTER                                          │
│  ┌─────────────────────────────────────────────┐    │
│  │  Recibe datos y tendencias del turismo      │    │
│  │  en LATAM cada semana                       │    │
│  │  [email]  [Suscribirme]                     │    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  Footer: Digitra.news | Digitra Rentals | Contacto  │
│  Categorías | Redes sociales                        │
└─────────────────────────────────────────────────────┘
```

### Layout — Artículo Individual
```
┌─────────────────────────────────────────────────────┐
│  DIGITRA.NEWS    Destinos Datos Tendencias  Buscar  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CATEGORÍA · 5 min lectura                          │
│                                                     │
│  Título Grande con Playfair Display                 │
│  Subtítulo explicativo en gris                      │
│                                                     │
│  Por David Barrera · 6 marzo 2026                   │
│  [Compartir] [Twitter] [LinkedIn]                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │          IMAGEN DESTACADA                   │    │
│  │          (ancho completo)                   │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────┐ ┌─────────────────┐   │
│  │                         │ │ SIDEBAR         │   │
│  │  CONTENIDO              │ │                 │   │
│  │                         │ │ Datos clave:    │   │
│  │  Introducción           │ │ • Precio: $180K │   │
│  │                         │ │ • Ocupación: 72%│   │
│  │  ## Sección 1           │ │ • Tendencia: ▲  │   │
│  │  Texto + datos          │ │                 │   │
│  │                         │ │ ─────────────── │   │
│  │  [GRÁFICO/CHART]        │ │                 │   │
│  │                         │ │ CTA:            │   │
│  │  ## Sección 2           │ │ ¿Tienes una     │   │
│  │  Texto + imágenes       │ │ propiedad?      │   │
│  │                         │ │ Crea tu página →│   │
│  │  ## Conclusión          │ │                 │   │
│  │                         │ │ ─────────────── │   │
│  │  FAQ (colapsable)       │ │                 │   │
│  │                         │ │ Artículos       │   │
│  └─────────────────────────┘ │ relacionados    │   │
│                               │ • Art 1        │   │
│                               │ • Art 2        │   │
│                               │ • Art 3        │   │
│                               └─────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  ARTÍCULOS RELACIONADOS (grid 3 cols)       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  NEWSLETTER CTA                             │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Layout — Artículo de Datos (especial)
Los artículos de `/datos/` tienen un diseño especial con:
```
┌─────────────────────────────────────────────────────┐
│  DATO DESTACADO (hero numérico)                      │
│  ┌─────────────────────────────────────────────┐    │
│  │      $185,000 COP / noche                   │    │
│  │      Precio promedio Airbnb en Cartagena     │    │
│  │      ▲ 12% vs mes anterior                   │    │
│  │      Fuente: Digitra News · Marzo 2026       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Min      │ │ Promedio │ │ Max      │            │
│  │ $95K     │ │ $185K    │ │ $420K    │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  [GRÁFICO: evolución de precios últimos 6 meses]    │
│  [TABLA: precios por zona]                          │
│  [MAPA: ocupación por barrio]                       │
│                                                     │
│  Análisis textual + contexto + fuentes              │
└─────────────────────────────────────────────────────┘
```

### Componentes de diseño clave
- **Data Cards:** tarjetas con cifra grande + tendencia (▲▼) + mini sparkline
- **Category Pills:** badges de color por categoría en cada artículo
- **Source Badge:** "Fuente: Digitra News" en cada dato (para citaciones IA)
- **Reading Progress:** barra de progreso en top del artículo
- **Share Float:** botones de compartir flotantes en scroll
- **CTA Contextual:** cambia según categoría (anfitrión vs viajero)

---

## 7. BASE DE DATOS

```sql
-- PostgreSQL 17 | DB: digitra_news | User: digitra

-- Artículos (propios + curados)
CREATE TABLE articles (
    id              SERIAL PRIMARY KEY,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    title           VARCHAR(500) NOT NULL,
    subtitle        VARCHAR(500),
    content         TEXT NOT NULL,
    excerpt         VARCHAR(500),
    cover_image     VARCHAR(500),
    cover_image_alt VARCHAR(255),
    category_id     INTEGER REFERENCES categories(id),
    subcategory     VARCHAR(100),          -- ciudad o subtema
    source_type     VARCHAR(20) DEFAULT 'original',  -- original | curated
    source_url      VARCHAR(500),          -- URL fuente (curados)
    source_name     VARCHAR(200),          -- nombre fuente (curados)
    meta_title      VARCHAR(200),
    meta_description VARCHAR(320),
    canonical_url   VARCHAR(500),
    og_image        VARCHAR(500),
    reading_time    INTEGER DEFAULT 5,
    faq_items       JSONB,                 -- FAQ para schema
    tags            TEXT[],                -- tags libres
    data_highlights JSONB,                 -- cifras destacadas para sidebar/cards
    status          VARCHAR(20) DEFAULT 'draft',  -- draft | published | scheduled
    is_featured     BOOLEAN DEFAULT false,
    published_at    TIMESTAMPTZ,
    scheduled_at    TIMESTAMPTZ,
    seo_keyword     VARCHAR(200),          -- keyword objetivo
    seo_tool_ref    VARCHAR(100),          -- referencia a seo-tool
    views_count     INTEGER DEFAULT 0,
    shares_count    INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    description     VARCHAR(500),
    meta_title      VARCHAR(200),
    meta_description VARCHAR(320),
    color           VARCHAR(7),            -- hex color
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Ciudades/Destinos (para URLs y hubs)
CREATE TABLE destinations (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    country         VARCHAR(100) NOT NULL,
    country_slug    VARCHAR(100) NOT NULL,
    description     VARCHAR(500),
    cover_image     VARCHAR(500),
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    article_count   INTEGER DEFAULT 0,    -- cache counter
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Relación artículo-destino (un artículo puede mencionar varias ciudades)
CREATE TABLE article_destinations (
    article_id      INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    destination_id  INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    is_primary      BOOLEAN DEFAULT false, -- destino principal del artículo
    PRIMARY KEY (article_id, destination_id)
);

-- Subscribers (newsletter)
CREATE TABLE subscribers (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(200),
    source          VARCHAR(50),           -- popup | footer | article | external
    is_active       BOOLEAN DEFAULT true,
    confirmed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- CTA tracking (funnel a digitra.rentals)
CREATE TABLE cta_clicks (
    id              SERIAL PRIMARY KEY,
    article_id      INTEGER REFERENCES articles(id),
    cta_type        VARCHAR(50),           -- inline | sidebar | banner | popup
    cta_text        VARCHAR(200),
    destination_url VARCHAR(500),
    referrer_url    VARCHAR(500),
    user_agent      VARCHAR(500),
    clicked_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Fuentes de curación (RSS)
CREATE TABLE curated_sources (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    rss_feed_url    VARCHAR(500),
    category_id     INTEGER REFERENCES categories(id),
    is_active       BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Page views (analytics propias)
CREATE TABLE page_views (
    id              SERIAL PRIMARY KEY,
    article_id      INTEGER REFERENCES articles(id),
    path            VARCHAR(500),
    referrer        VARCHAR(500),
    ai_source       VARCHAR(50),           -- chatgpt | perplexity | gemini | claude
    utm_source      VARCHAR(100),
    utm_medium      VARCHAR(100),
    utm_campaign    VARCHAR(100),
    country         VARCHAR(5),
    device          VARCHAR(20),
    viewed_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Data snapshots (datos de mercado para artículos de /datos/)
CREATE TABLE market_data (
    id              SERIAL PRIMARY KEY,
    destination_id  INTEGER REFERENCES destinations(id),
    metric_type     VARCHAR(50),           -- avg_price | occupancy | listing_count | demand_score
    value           DECIMAL(12, 2),
    previous_value  DECIMAL(12, 2),        -- para calcular tendencia
    period          VARCHAR(20),           -- 2026-03, 2026-Q1, 2026-W10
    source          VARCHAR(100),          -- apify_airbnb | apify_booking | manual
    raw_data        JSONB,                 -- datos crudos del scraping
    collected_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_source ON articles(source_type);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_page_views_article ON page_views(article_id);
CREATE INDEX idx_page_views_ai ON page_views(ai_source) WHERE ai_source IS NOT NULL;
CREATE INDEX idx_market_data_dest ON market_data(destination_id, metric_type, period);
CREATE INDEX idx_cta_clicks_article ON cta_clicks(article_id);
```

### Seed de categorías
```sql
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
('Destinos', 'destinos', 'Guías, experiencias y rutas por ciudad', '#0EA5E9', 1),
('Data Turismo', 'datos', 'Precios, ocupación, rankings y reportes basados en datos', '#10B981', 2),
('Tendencias', 'tendencias', 'Búsquedas, proyecciones y análisis de la industria', '#8B5CF6', 3),
('Alquiler Vacacional', 'alquiler-vacacional', 'Tips para anfitriones, comparativas y guías de reserva', '#F59E0B', 4),
('Noticias', 'noticias', 'Curación diaria de noticias del sector turístico', '#EF4444', 5);
```

### Seed de destinos iniciales
```sql
INSERT INTO destinations (name, slug, country, country_slug) VALUES
('Cartagena', 'cartagena', 'Colombia', 'colombia'),
('Medellín', 'medellin', 'Colombia', 'colombia'),
('Santa Marta', 'santa-marta', 'Colombia', 'colombia'),
('Bogotá', 'bogota', 'Colombia', 'colombia'),
('San Andrés', 'san-andres', 'Colombia', 'colombia'),
('Guatapé', 'guatape', 'Colombia', 'colombia'),
('Cancún', 'cancun', 'México', 'mexico'),
('Tulum', 'tulum', 'México', 'mexico'),
('Lima', 'lima', 'Perú', 'peru'),
('Buenos Aires', 'buenos-aires', 'Argentina', 'argentina');
```

---

## 8. ESTRUCTURA DEL PROYECTO

```
~/digitra-news/
├── app/
│   ├── page.tsx                        # Home
│   ├── layout.tsx                      # Layout global + fonts + GA4
│   ├── globals.css                     # Tailwind + custom styles
│   ├── not-found.tsx                   # 404 con links a categorías
│   ├── sitemap.ts                      # Sitemap dinámico
│   ├── robots.ts                       # Robots.txt
│   │
│   ├── [category]/
│   │   ├── page.tsx                    # Hub de categoría
│   │   └── [slug]/
│   │       └── page.tsx                # Artículo individual
│   │
│   ├── destinos/
│   │   └── [destination]/
│   │       └── page.tsx                # Hub de destino (override)
│   │
│   ├── buscar/
│   │   └── page.tsx                    # Búsqueda full-text
│   │
│   ├── tags/
│   │   └── [tag]/
│   │       └── page.tsx                # Artículos por tag
│   │
│   ├── newsletter/
│   │   └── page.tsx                    # Landing suscripción
│   │
│   ├── admin/
│   │   ├── layout.tsx                  # Admin layout con sidebar
│   │   ├── page.tsx                    # Dashboard: stats, últimos, drafts
│   │   ├── login/page.tsx              # Login admin
│   │   ├── articles/
│   │   │   ├── page.tsx                # Lista artículos + filtros
│   │   │   ├── new/page.tsx            # Crear artículo (editor Tiptap)
│   │   │   └── [id]/edit/page.tsx      # Editar artículo
│   │   ├── curated/
│   │   │   └── page.tsx                # Panel curación: fetch RSS + IA
│   │   ├── data/
│   │   │   └── page.tsx                # Importar/ver datos de mercado
│   │   ├── categories/
│   │   │   └── page.tsx                # CRUD categorías
│   │   ├── destinations/
│   │   │   └── page.tsx                # CRUD destinos
│   │   └── subscribers/
│   │       └── page.tsx                # Lista + exportar
│   │
│   └── api/
│       ├── articles/route.ts           # CRUD artículos
│       ├── curate/
│       │   ├── fetch/route.ts          # Fetch RSS de fuentes
│       │   └── summarize/route.ts      # Claude resume artículo externo
│       ├── generate/route.ts           # Claude genera artículo desde keyword
│       ├── newsletter/route.ts         # Subscribe/confirm/unsubscribe
│       ├── cta-track/route.ts          # Registrar clic en CTA
│       ├── track/route.ts              # Page view tracking
│       ├── market-data/route.ts        # Importar datos de mercado
│       ├── search/route.ts             # Búsqueda full-text
│       └── og/route.tsx                # OG image generator (Vercel OG)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  # Nav con categorías
│   │   ├── Footer.tsx                  # Links + newsletter mini
│   │   ├── Sidebar.tsx                 # Sidebar artículo (datos + CTA)
│   │   └── ReadingProgress.tsx         # Barra progreso lectura
│   │
│   ├── articles/
│   │   ├── ArticleCard.tsx             # Card en grids
│   │   ├── ArticleGrid.tsx             # Grid responsivo
│   │   ├── ArticleBody.tsx             # Renderer del contenido
│   │   ├── ArticleHero.tsx             # Hero del artículo
│   │   ├── ArticleMeta.tsx             # Autor, fecha, tiempo lectura
│   │   ├── RelatedArticles.tsx         # Artículos relacionados
│   │   └── ShareButtons.tsx            # Compartir (flotante)
│   │
│   ├── data/
│   │   ├── DataCard.tsx                # Cifra + tendencia + sparkline
│   │   ├── DataHero.tsx                # Hero numérico para /datos/
│   │   ├── PriceChart.tsx              # Gráfico evolución precios
│   │   └── MarketTable.tsx             # Tabla comparativa
│   │
│   ├── home/
│   │   ├── HeroSection.tsx             # Artículo principal + 4 secundarios
│   │   ├── DataSection.tsx             # Sección Data Turismo
│   │   ├── DestinationsSection.tsx     # Destinos populares
│   │   ├── TrendingSection.tsx         # Tendencias + Alquiler
│   │   └── NewsSection.tsx             # Noticias curadas
│   │
│   ├── cta/
│   │   ├── RentalsCTA.tsx              # CTA hacia digitra.rentals
│   │   ├── NewsletterCTA.tsx           # CTA suscripción
│   │   └── InlineCTA.tsx               # CTA dentro del contenido
│   │
│   ├── seo/
│   │   ├── JsonLd.tsx                  # NewsArticle + Dataset + FAQPage
│   │   └── MetaTags.tsx                # Open Graph + Twitter Cards
│   │
│   ├── admin/
│   │   ├── ArticleEditor.tsx           # Editor Tiptap completo
│   │   ├── CuratedPanel.tsx            # Fetch + resumir + crear draft
│   │   ├── StatsCards.tsx              # Métricas del dashboard
│   │   ├── ImagePicker.tsx             # Unsplash + upload
│   │   └── GenerateFromKeyword.tsx     # Generar con IA desde keyword
│   │
│   └── ui/
│       ├── CategoryPill.tsx            # Badge de categoría con color
│       ├── TrendIndicator.tsx          # ▲▼ con color
│       ├── SearchInput.tsx
│       └── Pagination.tsx
│
├── lib/
│   ├── db.ts                           # Prisma client
│   ├── auth.ts                         # NextAuth config
│   ├── actions/
│   │   ├── articles.ts                 # Server actions artículos
│   │   ├── categories.ts
│   │   ├── destinations.ts
│   │   ├── subscribers.ts
│   │   └── market-data.ts
│   ├── ai/
│   │   ├── generate-article.ts         # Claude Sonnet: generar artículo completo
│   │   ├── summarize-source.ts         # Claude Haiku: resumir fuente curada
│   │   ├── generate-meta.ts            # Claude Haiku: meta title/description
│   │   └── extract-data.ts             # Claude: extraer datos de texto
│   ├── curate/
│   │   ├── rss-fetcher.ts              # Fetch + parse RSS feeds
│   │   └── sources.ts                  # Lista de fuentes configuradas
│   ├── seo/
│   │   ├── schemas.ts                  # JSON-LD generators
│   │   ├── indexing.ts                 # Google Indexing + IndexNow
│   │   └── sitemap.ts                  # Helpers para sitemap
│   ├── analytics/
│   │   ├── gtag.ts                     # GA4 event helpers
│   │   ├── ai-referrer.ts             # Detección tráfico IA
│   │   └── cta-tracker.ts             # Track clics a rentals
│   └── integrations/
│       ├── unsplash.ts                 # Buscar imágenes
│       ├── seo-tool.ts                 # API interna a seo-tool
│       └── rentals.ts                  # Links y datos de rentals
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── deploy/
│   ├── Dockerfile.prod                 # Multi-stage, Node 20-alpine
│   ├── docker-compose.prod.yml         # Puerto 3004
│   └── deploy.sh                       # Build + swap + healthcheck
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── indexnow-key.txt
│
├── .env.local                          # Dev
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 9. INTEGRACIONES

### 9.1 seo-tool → digitra.news
Comunicación interna en el VPS (localhost:3003).

```
Admin de news → "Generar artículo" → input: keyword
                                    → llama a Claude Sonnet con contexto de keyword
                                    → genera: título, contenido, meta, FAQ, tags
                                    → crea draft para revisión
```

No se usa la API de seo-tool directamente — se reutiliza el patrón de generación con Claude. Los keywords se consultan manualmente en seo-tool y se copian.

### 9.2 digitra.news → digitra.rentals (funnel)
CTAs contextuales que varían por categoría:

| Categoría | CTA | Destino |
|-----------|-----|---------|
| Destinos | "Ver propiedades en [ciudad]" | rentals/propiedades/colombia/[city] |
| Datos | "Publica tu propiedad y gana" | rentals/#pricing |
| Alquiler Vacacional | "Crea tu página gratis" | rentals/ |
| Tendencias | "Aprovecha la temporada" | rentals/ |
| Noticias | "¿Eres anfitrión?" (sidebar) | rentals/ |

Cada clic se trackea en `cta_clicks` + evento GA4.

### 9.3 Curación con IA
```
Fuentes RSS:
├── Hosteltur LATAM (hosteltur.com/latam)
├── Reportur (reportur.com)
├── Skift (skift.com/feed)
├── PhocusWire (phocuswire.com/feed)
├── MinCIT Colombia (mincit.gov.co)
└── Procolombia (procolombia.co)

Flujo:
1. Admin → "Curar noticias" → fetch últimos artículos de fuentes
2. Lista de artículos con título + URL + fuente
3. Click "Resumir" → Claude Haiku genera: extracto + título propio + tags
4. Revisas → editas → publicas como artículo curado
5. Siempre incluye source_url y source_name (atribución)
```

### 9.4 Datos de Mercado (Apify)
```
Scraping periódico (semanal):
├── Airbnb: precios, ocupación por ciudad (tri_angle/airbnb-rooms-urls-scraper)
├── Booking: precios comparativos (voyager/booking-scraper)
└── Se almacena en market_data

Flujo para artículos de /datos/:
1. Cron o manual: ejecutar scrapers → guardar en market_data
2. Admin → "Nuevo artículo de datos" → seleccionar destino
3. Sistema muestra datos actuales + histórico
4. Claude genera análisis con datos reales
5. Artículo incluye DataCards, gráficos, tablas
```

---

## 10. SEO Y CITACIONES IA

### Schemas JSON-LD por tipo
```
Artículos originales:  NewsArticle + FAQPage
Artículos de datos:    NewsArticle + Dataset + FAQPage
Artículos curados:     NewsArticle (con citation)
Home:                  WebSite + Organization
Categorías:            CollectionPage
Destinos:              Place + CollectionPage
```

### Formato para citaciones IA
Cada artículo de datos incluirá:
```
"Según datos analizados por Digitra News, el precio promedio de
Airbnb en Cartagena en marzo 2026 es de $185,000 COP por noche,
un aumento del 12% respecto al mes anterior."
```

Este formato (fuente + dato + contexto temporal) es el que las IAs citan.

### Auto-indexing
Mismo patrón de digitra.rentals:
- Google Indexing API al publicar/actualizar
- IndexNow (Bing/Yandex) simultáneo
- Sitemap dinámico con lastmod

### Meta tags
```html
<title>{meta_title} | Digitra News</title>
<meta name="description" content="{meta_description}">
<meta property="og:type" content="article">
<meta property="og:image" content="{og_image o generada}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://digitra.news/{category}/{slug}">
```

---

## 11. FRECUENCIA DE PUBLICACIÓN

### Fase 1 (mes 1-2): 5-7 artículos/semana
```
Lunes:     1 artículo original (destino o alquiler vacacional)
Martes:    1 artículo de datos (precios/ocupación)
Miércoles: 1-2 noticias curadas
Jueves:    1 artículo original (tendencia o guía)
Viernes:   1-2 noticias curadas
```

### Fase 2 (mes 3+): 7-10 artículos/semana
Agregar más curación automática + artículos de datos semanales por ciudad.

### Fase 3 (mes 6+): 10-15 artículos/semana
Pipeline semi-automático maduro. Reportes trimestrales. Posible contribuidores.

---

## 12. CONFIGURACIÓN VPS

### DNS
```
digitra.news        A       31.97.42.156
www.digitra.news    CNAME   digitra.news
```

### Nginx
```nginx
# /etc/nginx/sites-available/digitra-news

server {
    listen 80;
    server_name digitra.news www.digitra.news;
    return 301 https://digitra.news$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.digitra.news;
    ssl_certificate /etc/letsencrypt/live/digitra.news/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/digitra.news/privkey.pem;
    return 301 https://digitra.news$request_uri;
}

server {
    listen 443 ssl http2;
    server_name digitra.news;

    ssl_certificate /etc/letsencrypt/live/digitra.news/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/digitra.news/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # Cache de estáticos
    location /_next/static {
        proxy_pass http://127.0.0.1:3004;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location /images {
        proxy_pass http://127.0.0.1:3004;
        expires 30d;
        access_log off;
    }
}
```

### Docker
```yaml
# docker-compose.prod.yml
services:
  digitra-news:
    build:
      context: .
      dockerfile: deploy/Dockerfile.prod
    ports:
      - "3004:3000"
    environment:
      - DATABASE_URL=postgresql://digitra:Digitra2026@host.docker.internal:5432/digitra_news
      - NEXTAUTH_URL=https://digitra.news
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - UNSPLASH_ACCESS_KEY=${UNSPLASH_ACCESS_KEY}
      - GA_MEASUREMENT_ID=${GA_MEASUREMENT_ID}
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

### PostgreSQL
```sql
-- En el VPS
CREATE DATABASE digitra_news;
GRANT ALL PRIVILEGES ON DATABASE digitra_news TO digitra;
```

---

## 13. FASES DE DESARROLLO

### FASE 1 — Scaffolding + Admin (semana 1)
- [ ] Crear proyecto Next.js en ~/digitra-news
- [ ] Configurar Prisma + schema + seed
- [ ] Auth admin (NextAuth credentials)
- [ ] CRUD artículos con editor Tiptap
- [ ] CRUD categorías y destinos
- [ ] Subir imágenes (local o Unsplash)

### FASE 2 — Público (semana 2)
- [ ] Home page con todas las secciones
- [ ] Página de categoría
- [ ] Página de artículo individual
- [ ] Página de destino
- [ ] Búsqueda
- [ ] Newsletter form
- [ ] 404 page

### FASE 3 — SEO + Deploy (semana 2-3)
- [ ] JSON-LD schemas
- [ ] Meta tags + OG images
- [ ] Sitemap dinámico
- [ ] Auto-indexing (Google + IndexNow)
- [ ] AI referrer tracking
- [ ] Docker + Nginx + SSL
- [ ] Deploy al VPS

### FASE 4 — Curación + IA (semana 3-4)
- [ ] RSS fetcher para fuentes
- [ ] Claude summarizer para curación
- [ ] Generación de artículos desde keyword
- [ ] Panel de curación en admin

### FASE 5 — Data + Funnel (semana 4-5)
- [ ] Integración Apify para datos de mercado
- [ ] DataCards y gráficos
- [ ] Artículos de datos con layout especial
- [ ] CTAs hacia digitra.rentals con tracking
- [ ] GA4 setup + eventos

### FASE 6 — Optimización (mes 2)
- [ ] OG image generator dinámico
- [ ] Newsletter con Brevo
- [ ] Reportes trimestrales template
- [ ] Performance + Core Web Vitals
- [ ] Contribuidores (si aplica)

---

## 14. ENV VARIABLES

```env
# Database
DATABASE_URL=postgresql://digitra:Digitra2026@localhost:5432/digitra_news

# Auth
NEXTAUTH_URL=https://digitra.news
NEXTAUTH_SECRET=<generar>
ADMIN_EMAIL=david@digitra.co
ADMIN_PASSWORD=<definir>

# AI
ANTHROPIC_API_KEY=<existente>

# Imágenes
UNSPLASH_ACCESS_KEY=<obtener>

# SEO
INDEXNOW_API_KEY=<generar>
GOOGLE_SERVICE_ACCOUNT_EMAIL=digitra-indexing@pro-contact-489315-p4.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<existente>

# Analytics
GA_MEASUREMENT_ID=<nuevo property>

# Newsletter (futuro)
BREVO_API_KEY=<existente o nueva>
BREVO_SENDER_EMAIL=noticias@digitra.news

# Apify (futuro)
APIFY_API_TOKEN=<obtener>
```
