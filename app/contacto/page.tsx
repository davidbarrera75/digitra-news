import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Digitra News",
  description:
    "Cont&aacute;ctanos para consultas sobre destinos tur&iacute;sticos, sugerencias de contenido, colaboraciones o reportar errores.",
};

export default function ContactoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-8">
        Contacto
      </h1>

      <section className="prose prose-gray max-w-none space-y-8">
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-display font-bold text-primary">Informaci&oacute;n de Contacto</h2>
          <ul className="space-y-3 list-none pl-0">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:contacto@digitra.news" className="text-accent hover:underline">
                contacto@digitra.news
              </a>
            </li>
            <li>
              <strong>Tel&eacute;fono:</strong>{" "}
              <a href="tel:+573208045506" className="text-accent hover:underline">
                +57 320 804 5506
              </a>
            </li>
            <li>
              <strong>Ubicaci&oacute;n:</strong> Colombia
            </li>
            <li>
              <strong>Horario de Atenci&oacute;n:</strong> Lunes a Viernes: 9:00 AM - 6:00 PM (Hora Colombia)
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-primary">
            &iquest;C&oacute;mo podemos ayudarte?
          </h2>
          <ul className="space-y-2">
            <li>Consultas sobre destinos tur&iacute;sticos</li>
            <li>Sugerencias de contenido</li>
            <li>Colaboraciones y alianzas</li>
            <li>Reporte de errores o informaci&oacute;n incorrecta</li>
            <li>Registrar tu alojamiento o restaurante</li>
            <li>Preguntas sobre publicidad</li>
          </ul>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
          <h2 className="text-xl font-display font-bold text-primary">
            Env&iacute;anos un Mensaje
          </h2>
          <p>
            Puedes enviarnos un mensaje directamente a{" "}
            <a
              href="mailto:contacto@digitra.news"
              className="text-accent hover:underline font-semibold"
            >
              contacto@digitra.news
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Respondemos todos los mensajes en un plazo m&aacute;ximo de 48 horas h&aacute;biles. Si tu consulta es
            urgente, te recomendamos contactarnos directamente por tel&eacute;fono o WhatsApp.
          </p>
        </div>
      </section>
    </main>
  );
}
