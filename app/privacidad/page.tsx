import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo recopilamos, usamos, almacenamos y protegemos tu información personal en Digitra News.",
};

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">
        Pol&iacute;tica de Privacidad
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        &Uacute;ltima actualizaci&oacute;n: Noviembre 2025
      </p>

      <section className="prose prose-gray max-w-none space-y-8">
        <p>
          En Digitra News, nos tomamos muy en serio tu privacidad. Esta Pol&iacute;tica de Privacidad explica c&oacute;mo
          recopilamos, usamos, almacenamos y protegemos tu informaci&oacute;n personal cuando utilizas nuestro sitio
          web <strong>digitra.news</strong>.
        </p>
        <p>Al acceder y utilizar nuestro sitio, aceptas las pr&aacute;cticas descritas en esta pol&iacute;tica.</p>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">1. Informaci&oacute;n que Recopilamos</h2>

          <h3 className="text-lg font-semibold mt-4">1.1 Informaci&oacute;n que nos Proporcionas</h3>
          <ul className="space-y-1">
            <li>Nombre y correo electr&oacute;nico al enviar comentarios o formularios de contacto</li>
            <li>Informaci&oacute;n de alojamientos o restaurantes al registrar tu negocio</li>
            <li>Datos de contacto opcionales (tel&eacute;fono, WhatsApp)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">1.2 Informaci&oacute;n Recopilada Autom&aacute;ticamente</h3>
          <ul className="space-y-1">
            <li>Direcci&oacute;n IP y datos de navegaci&oacute;n</li>
            <li>Tipo de dispositivo y navegador</li>
            <li>P&aacute;ginas visitadas y tiempo de permanencia</li>
            <li>Origen de la visita (referrer)</li>
            <li>Cookies y tecnolog&iacute;as similares</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">1.3 Informaci&oacute;n de Terceros</h3>
          <p>Podemos recopilar informaci&oacute;n de servicios de terceros como Google Analytics para mejorar nuestro servicio y comprender mejor el comportamiento de los usuarios.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">2. C&oacute;mo Usamos tu Informaci&oacute;n</h2>
          <ul className="space-y-1">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Responder a tus consultas y comentarios</li>
            <li>Enviar notificaciones sobre actualizaciones del servicio</li>
            <li>Analizar el uso del sitio web y mejorar la experiencia del usuario</li>
            <li>Detectar y prevenir fraudes o actividades no autorizadas</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Personalizar el contenido seg&uacute;n tus intereses</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">3. Uso de Cookies</h2>
          <p>Utilizamos cookies y tecnolog&iacute;as similares para:</p>
          <ul className="space-y-1">
            <li>Recordar tus preferencias (tema oscuro/claro)</li>
            <li>Analizar el tr&aacute;fico del sitio web</li>
            <li>Mejorar la funcionalidad y seguridad del sitio</li>
            <li>Personalizar el contenido y la publicidad</li>
          </ul>
          <p>Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio web.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">4. Protecci&oacute;n de tus Datos</h2>
          <p>Implementamos medidas de seguridad t&eacute;cnicas y organizativas para proteger tu informaci&oacute;n:</p>
          <ul className="space-y-1">
            <li>Encriptaci&oacute;n SSL/TLS para transmisi&oacute;n de datos</li>
            <li>Almacenamiento seguro en servidores protegidos</li>
            <li>Acceso restringido a datos personales</li>
            <li>Auditor&iacute;as de seguridad regulares</li>
            <li>Copias de seguridad peri&oacute;dicas</li>
          </ul>
          <p>Sin embargo, ning&uacute;n m&eacute;todo de transmisi&oacute;n por internet es 100% seguro. Te recomendamos tomar precauciones al compartir informaci&oacute;n personal en l&iacute;nea.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">5. Compartir tu Informaci&oacute;n</h2>
          <p>No vendemos, alquilamos ni compartimos tu informaci&oacute;n personal con terceros, excepto en los siguientes casos:</p>
          <ul className="space-y-1">
            <li><strong>Con tu consentimiento:</strong> Cuando nos autorizas expl&iacute;citamente</li>
            <li><strong>Proveedores de servicios:</strong> Google Analytics, servicios de hosting</li>
            <li><strong>Cumplimiento legal:</strong> Cuando la ley lo requiera</li>
            <li><strong>Protecci&oacute;n de derechos:</strong> Para proteger nuestros derechos legales</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">6. Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul className="space-y-1">
            <li><strong>Acceder</strong> a tu informaci&oacute;n personal</li>
            <li><strong>Rectificar</strong> datos incorrectos o incompletos</li>
            <li><strong>Eliminar</strong> tu informaci&oacute;n (derecho al olvido)</li>
            <li><strong>Oponerte</strong> al procesamiento de tus datos</li>
            <li><strong>Portabilidad</strong> de tus datos</li>
            <li><strong>Retirar</strong> el consentimiento en cualquier momento</li>
          </ul>
          <p>Para ejercer estos derechos, cont&aacute;ctanos en <a href="mailto:contacto@digitra.news" className="text-accent hover:underline">contacto@digitra.news</a></p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">7. Retenci&oacute;n de Datos</h2>
          <p>Conservamos tu informaci&oacute;n personal solo durante el tiempo necesario para cumplir con los prop&oacute;sitos descritos en esta pol&iacute;tica, salvo que la ley requiera o permita un per&iacute;odo de retenci&oacute;n m&aacute;s largo.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">8. Enlaces a Sitios de Terceros</h2>
          <p>Nuestro sitio puede contener enlaces a sitios web de terceros (Airbnb, Booking.com, etc.). No somos responsables de las pr&aacute;cticas de privacidad de estos sitios. Te recomendamos leer sus pol&iacute;ticas de privacidad.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">9. Menores de Edad</h2>
          <p>Nuestro servicio no est&aacute; dirigido a menores de 13 a&ntilde;os. No recopilamos intencionalmente informaci&oacute;n personal de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos de inmediato.</p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">10. Cambios a esta Pol&iacute;tica</h2>
          <p>Podemos actualizar esta Pol&iacute;tica de Privacidad peri&oacute;dicamente. Te notificaremos sobre cambios significativos publicando la nueva pol&iacute;tica en esta p&aacute;gina y actualizando la fecha de &ldquo;&uacute;ltima actualizaci&oacute;n&rdquo;.</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-display font-bold text-primary">11. Contacto</h2>
          <p>Si tienes preguntas sobre esta Pol&iacute;tica de Privacidad, cont&aacute;ctanos:</p>
          <ul className="space-y-1">
            <li><strong>Email:</strong> <a href="mailto:contacto@digitra.news" className="text-accent hover:underline">contacto@digitra.news</a></li>
            <li><strong>Tel&eacute;fono:</strong> +57 320 804 5506</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
