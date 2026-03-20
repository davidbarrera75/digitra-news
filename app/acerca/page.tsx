import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de Digitra News | Tu fuente de información turística sobre Colombia",
  description:
    "Conoce la misión, visión y equipo editorial de Digitra News, el portal líder en información turística de Colombia.",
};

export default function AcercaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">
        Acerca de Digitra News
      </h1>
      <p className="text-accent font-semibold mb-8">
        Tu fuente confiable de informaci&oacute;n tur&iacute;stica sobre Colombia
      </p>

      <section className="prose prose-gray max-w-none space-y-8">
        <div>
          <h2 className="text-xl font-display font-bold text-primary">Nuestra Misi&oacute;n</h2>
          <p>
            Digitra News es el portal l&iacute;der en informaci&oacute;n tur&iacute;stica de Colombia, comprometido con proporcionar
            contenido actualizado, preciso y confiable sobre los destinos m&aacute;s fascinantes del pa&iacute;s.
          </p>
          <p>
            Nuestra misi&oacute;n es inspirar y facilitar experiencias de viaje memorables, conectando a viajeros con la
            diversidad cultural, natural y gastron&oacute;mica que Colombia tiene para ofrecer.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">Nuestra Visi&oacute;n</h2>
          <p>
            Ser reconocidos como el referente n&uacute;mero uno en informaci&oacute;n tur&iacute;stica de Colombia, destac&aacute;ndonos
            por la calidad de nuestro contenido, la precisi&oacute;n de nuestra informaci&oacute;n y nuestro compromiso con la
            promoci&oacute;n responsable del turismo.
          </p>
          <p>
            Aspiramos a ser el puente que conecte a millones de viajeros con las maravillas de Colombia,
            contribuyendo al desarrollo sostenible del sector tur&iacute;stico nacional.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">Qu&eacute; Ofrecemos</h2>
          <ul className="space-y-3">
            <li>
              <strong>Noticias de Turismo:</strong> Informaci&oacute;n actualizada sobre eventos, festivales y novedades del sector tur&iacute;stico colombiano.
            </li>
            <li>
              <strong>Gu&iacute;as de Destinos:</strong> Descripciones detalladas de los mejores destinos tur&iacute;sticos, con recomendaciones de alojamiento y restaurantes.
            </li>
            <li>
              <strong>Gastronom&iacute;a Local:</strong> Descubre los mejores restaurantes y la rica diversidad culinaria de cada regi&oacute;n.
            </li>
            <li>
              <strong>Mapas Interactivos:</strong> Visualiza destinos, alojamientos y puntos de inter&eacute;s en nuestro mapa interactivo.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">Equipo Editorial</h2>
          <p>
            Nuestro equipo est&aacute; conformado por periodistas especializados en turismo, expertos locales y viajeros
            apasionados que conocen Colombia en profundidad.
          </p>
          <p>
            Cada art&iacute;culo es cuidadosamente investigado y verificado para garantizar informaci&oacute;n precisa y
            actualizada que ayude a nuestros lectores a planificar sus viajes con confianza.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">Nuestro Compromiso</h2>
          <ul className="space-y-1">
            <li>Informaci&oacute;n verificada y actualizada constantemente</li>
            <li>Contenido original y de calidad editorial</li>
            <li>Promoci&oacute;n del turismo responsable y sostenible</li>
            <li>Respeto por la diversidad cultural y natural de Colombia</li>
            <li>Transparencia en nuestras fuentes y recomendaciones</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">Nuestra Historia</h2>
          <p>
            Digitra News naci&oacute; en 2025 con la visi&oacute;n de crear un espacio digital integral dedicado al turismo en
            Colombia. Desde entonces, hemos crecido hasta convertirnos en una fuente confiable para miles de
            viajeros que buscan explorar las maravillas del pa&iacute;s.
          </p>
          <p>
            Somos parte de{" "}
            <a href="https://digitra.rent" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Digitra.rent
            </a>
            , una plataforma comprometida con el desarrollo del sector tur&iacute;stico en Colombia.
          </p>
        </div>
      </section>
    </main>
  );
}
