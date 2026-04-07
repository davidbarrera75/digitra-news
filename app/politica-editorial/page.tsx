import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política Editorial",
  description:
    "Conoce nuestros estándares de calidad, ética periodística y proceso de verificación de información en Digitra News.",
};

export default function PoliticaEditorialPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">
        Pol&iacute;tica Editorial
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        &Uacute;ltima actualizaci&oacute;n: Noviembre 2025
      </p>

      <section className="prose prose-gray max-w-none space-y-8">
        <p>
          En <strong>Digitra News</strong>, estamos comprometidos con la excelencia editorial y la &eacute;tica period&iacute;stica.
          Esta Pol&iacute;tica Editorial define nuestros principios, est&aacute;ndares y procesos para garantizar informaci&oacute;n
          precisa, confiable y de calidad sobre el turismo en Colombia.
        </p>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">1. Principios Editoriales Fundamentales</h2>

          <h3 className="text-lg font-semibold mt-4">1.1 Precisi&oacute;n y Veracidad</h3>
          <p>Nos comprometemos a publicar informaci&oacute;n precisa y verificada. Todos nuestros art&iacute;culos pasan por un proceso de verificaci&oacute;n de datos y fuentes antes de su publicaci&oacute;n.</p>

          <h3 className="text-lg font-semibold mt-4">1.2 Independencia Editorial</h3>
          <p>Mantenemos independencia editorial en todas nuestras decisiones de contenido. Nuestra cobertura no est&aacute; influenciada por intereses comerciales, publicitarios o de terceros.</p>

          <h3 className="text-lg font-semibold mt-4">1.3 Transparencia</h3>
          <p>Identificamos claramente nuestras fuentes de informaci&oacute;n siempre que sea posible. Distinguimos entre contenido editorial, publicitario y generado por usuarios.</p>

          <h3 className="text-lg font-semibold mt-4">1.4 Imparcialidad</h3>
          <p>Presentamos la informaci&oacute;n de manera equilibrada y objetiva, evitando sesgos y permitiendo a nuestros lectores formar sus propias opiniones.</p>

          <h3 className="text-lg font-semibold mt-4">1.5 Respeto y Responsabilidad</h3>
          <p>Tratamos a todas las personas y comunidades con respeto. Somos responsables del impacto de nuestro contenido y asumimos la responsabilidad por errores u omisiones.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">2. Proceso de Verificaci&oacute;n de Informaci&oacute;n</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Investigaci&oacute;n Inicial:</strong> Nuestros editores investigan m&uacute;ltiples fuentes confiables, incluyendo comunicados oficiales, medios reconocidos y expertos en turismo.</li>
            <li><strong>Verificaci&oacute;n de Datos:</strong> Verificamos fechas, nombres, ubicaciones y estad&iacute;sticas contra fuentes primarias o secundarias confiables.</li>
            <li><strong>Revisi&oacute;n Editorial:</strong> Un editor senior revisa el contenido para asegurar precisi&oacute;n, claridad y cumplimiento de nuestros est&aacute;ndares editoriales.</li>
            <li><strong>Publicaci&oacute;n y Monitoreo:</strong> Despu&eacute;s de la publicaci&oacute;n, monitoreamos el contenido y actualizamos cuando sea necesario para mantener la precisi&oacute;n.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">3. Fuentes de Informaci&oacute;n</h2>
          <h3 className="text-lg font-semibold mt-4">Fuentes Primarias:</h3>
          <ul className="space-y-1">
            <li>Comunicados oficiales de gobiernos locales y nacionales</li>
            <li>Ministerio de Comercio, Industria y Turismo de Colombia</li>
            <li>Entrevistas directas con autoridades y expertos</li>
            <li>Observaci&oacute;n directa de eventos y destinos</li>
          </ul>
          <h3 className="text-lg font-semibold mt-4">Fuentes Secundarias:</h3>
          <ul className="space-y-1">
            <li>Medios de comunicaci&oacute;n reconocidos y confiables</li>
            <li>Investigaciones acad&eacute;micas y estudios especializados</li>
            <li>Rese&ntilde;as y experiencias de viajeros verificados</li>
            <li>Estad&iacute;sticas oficiales de turismo</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">4. Pol&iacute;tica de Correcci&oacute;n de Errores</h2>
          <ul className="space-y-2">
            <li><strong>Errores Menores:</strong> Corregimos inmediatamente y actualizamos el art&iacute;culo sin notificaci&oacute;n adicional (errores tipogr&aacute;ficos, formato, etc.).</li>
            <li><strong>Errores Significativos:</strong> Publicamos una nota de correcci&oacute;n clara en el art&iacute;culo, explicando el error y la correcci&oacute;n realizada.</li>
            <li><strong>Errores Graves:</strong> Retiramos el art&iacute;culo y publicamos una explicaci&oacute;n, o lo corregimos completamente con una nota prominente sobre los cambios.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">5. Conflictos de Inter&eacute;s</h2>
          <ul className="space-y-1">
            <li>No aceptamos pagos por cobertura editorial positiva</li>
            <li>Identificamos claramente contenido patrocinado o publicitario</li>
            <li>Nuestros editores declaran cualquier relaci&oacute;n personal o financiera relevante</li>
            <li>No permitimos que relaciones comerciales afecten nuestra cobertura</li>
            <li>Enlaces a plataformas externas (Airbnb, Booking.com) son informativos, no patrocinados</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">6. Uso Responsable de IA</h2>
          <p>Digitra News utiliza herramientas de inteligencia artificial para asistir en la creaci&oacute;n de contenido:</p>
          <ul className="space-y-1">
            <li>La IA se utiliza como herramienta de asistencia para investigaci&oacute;n, redacci&oacute;n y organizaci&oacute;n de informaci&oacute;n.</li>
            <li>Todo contenido generado con asistencia de IA es revisado, verificado y editado por nuestro equipo editorial.</li>
            <li>Verificamos la precisi&oacute;n de hechos y datos, y complementamos con investigaci&oacute;n humana.</li>
            <li>Mantenemos la responsabilidad editorial final sobre todo el contenido publicado.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">7. Moderaci&oacute;n de Comentarios</h2>
          <ul className="space-y-1">
            <li>Todos los comentarios pasan por moderaci&oacute;n antes de publicarse</li>
            <li>Prohibimos contenido ofensivo, difamatorio, discriminatorio o spam</li>
            <li>Los comentarios deben ser relevantes al art&iacute;culo</li>
            <li>Nos reservamos el derecho de editar o eliminar comentarios inapropiados</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">8. Equipo Editorial</h2>
          <ul className="space-y-1">
            <li>Periodistas especializados en turismo y cultura colombiana</li>
            <li>Editores con experiencia en medios digitales</li>
            <li>Expertos locales de diferentes regiones de Colombia</li>
            <li>Verificadores de datos y correctores de estilo</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">9. Actualizaciones de Contenido</h2>
          <p>
            Revisamos y actualizamos regularmente nuestros art&iacute;culos para asegurar que la informaci&oacute;n permanezca
            actual y relevante. Las actualizaciones significativas son fechadas y anotadas cuando sea apropiado.
          </p>
        </div>

        <p className="text-sm text-gray-500 border-t pt-6">
          Si tienes preguntas sobre nuestra pol&iacute;tica editorial, cont&aacute;ctanos en{" "}
          <a href="mailto:contacto@digitra.news" className="text-accent hover:underline">contacto@digitra.news</a>
        </p>
      </section>
    </main>
  );
}
