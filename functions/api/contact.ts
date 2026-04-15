type ContactPayload = {
  nombre?: unknown;
  empresa?: unknown;
  correo?: unknown;
  telefono?: unknown;
  servicio?: unknown;
  mensaje?: unknown;
  turnstileToken?: unknown;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

const asTrimmedString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isSuspiciousMessage = (value: string) => value.length > 3000;

export const onRequestPost = async ({ request }: { request: Request }) => {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json(
      {
        ok: false,
        message: 'El cuerpo de la solicitud debe enviarse como JSON válido.',
      },
      400,
    );
  }

  const nombre = asTrimmedString(payload.nombre);
  const empresa = asTrimmedString(payload.empresa);
  const correo = asTrimmedString(payload.correo).toLowerCase();
  const telefono = asTrimmedString(payload.telefono);
  const servicio = asTrimmedString(payload.servicio);
  const mensaje = asTrimmedString(payload.mensaje);
  const turnstileToken = asTrimmedString(payload.turnstileToken);

  if (!nombre || !correo || !servicio || !mensaje) {
    return json(
      {
        ok: false,
        message: 'Los campos nombre, correo, servicio y mensaje son obligatorios.',
      },
      400,
    );
  }

  if (!isValidEmail(correo)) {
    return json(
      {
        ok: false,
        message: 'El correo proporcionado no tiene un formato válido.',
      },
      400,
    );
  }

  if (mensaje.length < 10) {
    return json(
      {
        ok: false,
        message: 'El mensaje debe contener al menos 10 caracteres.',
      },
      400,
    );
  }

  if (isSuspiciousMessage(mensaje)) {
    return json(
      {
        ok: false,
        message: 'El mensaje excede la longitud permitida.',
      },
      400,
    );
  }

  const normalizedPayload = {
    nombre,
    empresa,
    correo,
    telefono,
    servicio,
    mensaje,
    turnstileTokenPresent: Boolean(turnstileToken),
    createdAt: new Date().toISOString(),
  };

  // TODO: Validar `turnstileToken` contra la API de Cloudflare Turnstile usando la secret key del entorno.
  // TODO: Rechazar solicitudes sin token válido cuando el widget Turnstile ya esté habilitado en el frontend.
  // TODO: Enviar correo transaccional o registrar la solicitud en almacenamiento persistente.
  // TODO: Agregar observabilidad y rate limiting si el volumen de tráfico lo requiere.

  return json({
    ok: true,
    message: 'Solicitud recibida. Nos pondremos en contacto a la brevedad.',
    data: normalizedPayload,
  });
};
