import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso del sitio web digitra.news. Conoce tus derechos y obligaciones al utilizar nuestro portal.",
};

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">
        T&eacute;rminos y Condiciones de Uso
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        &Uacute;ltima actualizaci&oacute;n: Noviembre 2025
      </p>

      <section className="prose prose-gray max-w-none space-y-8">
        <p>
          Bienvenido a <strong>Digitra News</strong>. Estos T&eacute;rminos y Condiciones rigen tu acceso y uso de nuestro
          sitio web <strong>digitra.news</strong> y todos los servicios relacionados.
        </p>
        <p>
          Al acceder o utilizar nuestro Sitio, aceptas estar sujeto a estos T&eacute;rminos. Si no est&aacute;s de acuerdo con
          alguna parte de estos t&eacute;rminos, no debes utilizar nuestro Sitio.
        </p>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">1. Aceptaci&oacute;n de los T&eacute;rminos</h2>
          <p>Al acceder y utilizar Digitra News, declaras que:</p>
          <ul className="space-y-1">
            <li>Tienes al menos 18 a&ntilde;os de edad o la mayor&iacute;a de edad en tu jurisdicci&oacute;n</li>
            <li>Aceptas cumplir con estos T&eacute;rminos y todas las leyes aplicables</li>
            <li>Proporcionas informaci&oacute;n precisa y completa cuando sea requerida</li>
            <li>Mantendr&aacute;s la seguridad de tu cuenta (si corresponde)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">2. Uso Permitido del Sitio</h2>
          <h3 className="text-lg font-semibold mt-4">Usos Permitidos:</h3>
          <ul className="space-y-1">
            <li>Buscar informaci&oacute;n sobre destinos tur&iacute;sticos en Colombia</li>
            <li>Leer y compartir nuestros art&iacute;culos y noticias</li>
            <li>Publicar comentarios respetuosos y relevantes</li>
            <li>Registrar tu alojamiento o restaurante de buena fe</li>
            <li>Contactarnos con consultas leg&iacute;timas</li>
          </ul>
          <h3 className="text-lg font-semibold mt-4">Usos Prohibidos:</h3>
          <ul className="space-y-1">
            <li>Copiar, modificar o distribuir nuestro contenido sin autorizaci&oacute;n</li>
            <li>Usar el Sitio con fines ilegales o fraudulentos</li>
            <li>Publicar contenido ofensivo, difamatorio o inapropiado</li>
            <li>Intentar acceder a &aacute;reas restringidas del Sitio</li>
            <li>Enviar spam o contenido promocional no solicitado</li>
            <li>Realizar scraping automatizado sin permiso</li>
            <li>Interferir con el funcionamiento del Sitio</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">3. Propiedad Intelectual</h2>
          <p>Todo el contenido del Sitio, incluyendo pero no limitado a textos, art&iacute;culos, noticias, im&aacute;genes, fotograf&iacute;as, videos, logotipos, marcas, dise&ntilde;os, c&oacute;digo fuente y bases de datos, es propiedad de Digitra News o sus licenciantes y est&aacute; protegido por las leyes de derechos de autor y propiedad intelectual.</p>
          <p>Queda prohibida su reproducci&oacute;n total o parcial sin autorizaci&oacute;n expresa por escrito.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">4. Contenido Generado por Usuarios</h2>
          <p>Al publicar comentarios, registrar alojamientos o enviar contenido al Sitio:</p>
          <ul className="space-y-1">
            <li>Garantizas que tienes los derechos necesarios sobre el contenido</li>
            <li>Nos otorgas una licencia mundial, no exclusiva, libre de regal&iacute;as para usar, modificar y mostrar el contenido</li>
            <li>El contenido no viola derechos de terceros ni leyes aplicables</li>
            <li>Aceptas que podemos moderar, editar o eliminar contenido inapropiado</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">5. Enlaces a Sitios de Terceros</h2>
          <p>Nuestro Sitio puede contener enlaces a sitios web de terceros (Airbnb, Booking.com, Google Maps, etc.). Estos enlaces se proporcionan solo para tu conveniencia.</p>
          <p>No tenemos control sobre el contenido de estos sitios externos y no somos responsables por:</p>
          <ul className="space-y-1">
            <li>La disponibilidad de sitios o recursos externos</li>
            <li>El contenido, publicidad o productos en estos sitios</li>
            <li>Las pr&aacute;cticas de privacidad de terceros</li>
            <li>Los da&ntilde;os derivados del uso de estos sitios</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">6. Descargo de Responsabilidad</h2>
          <p>El Sitio se proporciona &ldquo;tal cual&rdquo; y &ldquo;seg&uacute;n disponibilidad&rdquo;. No garantizamos que:</p>
          <ul className="space-y-1">
            <li>El Sitio estar&aacute; disponible de forma ininterrumpida o sin errores</li>
            <li>La informaci&oacute;n sea siempre precisa, completa o actualizada</li>
            <li>Los defectos ser&aacute;n corregidos inmediatamente</li>
            <li>El Sitio est&eacute; libre de virus o componentes da&ntilde;inos</li>
          </ul>
          <p>Aunque nos esforzamos por mantener informaci&oacute;n precisa, <strong>no somos responsables por:</strong></p>
          <ul className="space-y-1">
            <li>Errores u omisiones en el contenido</li>
            <li>Decisiones tomadas basadas en nuestra informaci&oacute;n</li>
            <li>Experiencias negativas con establecimientos listados</li>
            <li>P&eacute;rdidas econ&oacute;micas relacionadas con el uso del Sitio</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">7. Limitaci&oacute;n de Responsabilidad</h2>
          <p>En la medida m&aacute;xima permitida por la ley, Digitra News y sus afiliados no ser&aacute;n responsables por ning&uacute;n da&ntilde;o directo, indirecto, incidental, especial, consecuente o ejemplar, incluyendo pero no limitado a, da&ntilde;os por p&eacute;rdida de beneficios, datos, uso, reputaci&oacute;n u otras p&eacute;rdidas intangibles resultantes del uso o la imposibilidad de usar el Sitio.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">8. Indemnizaci&oacute;n</h2>
          <p>Aceptas indemnizar y mantener indemne a Digitra News, sus directores, empleados y afiliados de cualquier reclamaci&oacute;n, p&eacute;rdida, da&ntilde;o, responsabilidad y gasto (incluyendo honorarios legales) que surjan de:</p>
          <ul className="space-y-1">
            <li>Tu uso del Sitio</li>
            <li>Tu violaci&oacute;n de estos T&eacute;rminos</li>
            <li>Tu violaci&oacute;n de derechos de terceros</li>
            <li>El contenido que publiques en el Sitio</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">9. Modificaciones a los T&eacute;rminos</h2>
          <p>Nos reservamos el derecho de modificar estos T&eacute;rminos en cualquier momento. Los cambios significativos ser&aacute;n notificados mediante:</p>
          <ul className="space-y-1">
            <li>Actualizaci&oacute;n de la fecha de &ldquo;&uacute;ltima actualizaci&oacute;n&rdquo; en esta p&aacute;gina</li>
            <li>Notificaci&oacute;n prominente en el Sitio</li>
            <li>Email a usuarios registrados (si aplica)</li>
          </ul>
          <p>Tu uso continuado del Sitio despu&eacute;s de los cambios constituye tu aceptaci&oacute;n de los nuevos T&eacute;rminos.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">10. Terminaci&oacute;n</h2>
          <p>Podemos suspender o terminar tu acceso al Sitio inmediatamente, sin previo aviso, por cualquier motivo, incluyendo pero no limitado a violaci&oacute;n de estos T&eacute;rminos.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">11. Ley Aplicable y Jurisdicci&oacute;n</h2>
          <p>Estos T&eacute;rminos se regir&aacute;n e interpretar&aacute;n de acuerdo con las leyes de Colombia. Cualquier disputa relacionada con estos T&eacute;rminos estar&aacute; sujeta a la jurisdicci&oacute;n exclusiva de los tribunales de Colombia.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">12. Divisibilidad</h2>
          <p>Si alguna disposici&oacute;n de estos T&eacute;rminos se considera inv&aacute;lida o inaplicable, el resto de las disposiciones continuar&aacute;n en pleno vigor y efecto.</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-display font-bold text-primary">Contacto</h2>
          <p>Si tienes preguntas sobre estos T&eacute;rminos y Condiciones, cont&aacute;ctanos:</p>
          <ul className="space-y-1">
            <li><strong>Email:</strong> <a href="mailto:contacto@digitra.news" className="text-accent hover:underline">contacto@digitra.news</a></li>
            <li><strong>Tel&eacute;fono:</strong> +57 320 804 5506</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
