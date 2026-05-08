type ContactPayload = {
  nombre?: unknown;
  empresa?: unknown;
  correo?: unknown;
  telefono?: unknown;
  servicio?: unknown;
  mensaje?: unknown;
  turnstileToken?: unknown;
};

type Env = {
  CLOUDFLARE_ACCOUNT_ID?: string;
  EMAIL_SERVICE_API_TOKEN?: string;
  CONTACT_INBOX_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_FROM_NAME?: string;
  MICROSOFT_TENANT_ID?: string;
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_SENDER_EMAIL?: string;
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
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getEmailConfig = (env: Env) => {
  const accountId = asTrimmedString(env.CLOUDFLARE_ACCOUNT_ID);
  const apiToken = asTrimmedString(env.EMAIL_SERVICE_API_TOKEN);
  const inboxEmail = asTrimmedString(env.CONTACT_INBOX_EMAIL) || 'contacto@smar-soft.com';
  const fromEmail = asTrimmedString(env.CONTACT_FROM_EMAIL) || 'no-reply@smar-soft.com';
  const fromName = asTrimmedString(env.CONTACT_FROM_NAME) || 'SmarSoFT';

  return {
    accountId,
    apiToken,
    inboxEmail,
    fromEmail,
    fromName,
    isConfigured: Boolean(accountId && apiToken),
  };
};

const getMicrosoftConfig = (env: Env) => {
  const tenantId = asTrimmedString(env.MICROSOFT_TENANT_ID);
  const clientId = asTrimmedString(env.MICROSOFT_CLIENT_ID);
  const clientSecret = asTrimmedString(env.MICROSOFT_CLIENT_SECRET);
  const senderEmail =
    asTrimmedString(env.MICROSOFT_SENDER_EMAIL) ||
    asTrimmedString(env.CONTACT_FROM_EMAIL) ||
    'contacto@smar-soft.com';
  const inboxEmail = asTrimmedString(env.CONTACT_INBOX_EMAIL) || 'contacto@smar-soft.com';

  return {
    tenantId,
    clientId,
    clientSecret,
    senderEmail,
    inboxEmail,
    isConfigured: Boolean(tenantId && clientId && clientSecret && senderEmail),
  };
};

const buildTextBody = (payload: {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  createdAt: string;
}) =>
  [
    'Nueva solicitud de contacto desde smar-soft.com',
    '',
    `Fecha: ${payload.createdAt}`,
    `Nombre: ${payload.nombre}`,
    `Empresa: ${payload.empresa || 'No indicada'}`,
    `Correo: ${payload.correo}`,
    `Telefono: ${payload.telefono || 'No indicado'}`,
    `Servicio: ${payload.servicio}`,
    '',
    'Mensaje:',
    payload.mensaje,
  ].join('\n');

const buildHtmlBody = (payload: {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  createdAt: string;
}) => {
  const rows = [
    ['Fecha', payload.createdAt],
    ['Nombre', payload.nombre],
    ['Empresa', payload.empresa || 'No indicada'],
    ['Correo', payload.correo],
    ['Telefono', payload.telefono || 'No indicado'],
    ['Servicio', payload.servicio],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
      <h1 style="margin:0 0 16px;font-size:20px;color:#05202b">Nueva solicitud de contacto</h1>
      <p style="margin:0 0 20px">Se recibio una nueva solicitud desde <strong>smar-soft.com</strong>.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;margin:0 0 20px">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="padding:10px 12px;border:1px solid #cbd5e1;background:#f8fafc;font-weight:700;width:180px">${escapeHtml(label)}</td>
                  <td style="padding:10px 12px;border:1px solid #cbd5e1">${escapeHtml(value)}</td>
                </tr>`,
            )
            .join('')}
        </tbody>
      </table>
      <h2 style="margin:0 0 8px;font-size:16px;color:#05202b">Mensaje</h2>
      <div style="padding:14px 16px;border:1px solid #cbd5e1;border-radius:12px;background:#ffffff;white-space:pre-wrap">${escapeHtml(
        payload.mensaje,
      )}</div>
    </div>
  `.trim();
};

const sendContactEmail = async (
  env: Env,
  payload: {
    nombre: string;
    empresa: string;
    correo: string;
    telefono: string;
    servicio: string;
    mensaje: string;
    createdAt: string;
  },
) => {
  const microsoftConfig = getMicrosoftConfig(env);

  if (microsoftConfig.isConfigured) {
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${microsoftConfig.tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: microsoftConfig.clientId,
          client_secret: microsoftConfig.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }).toString(),
      },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Microsoft Graph token error', {
        status: tokenResponse.status,
        errorText,
      });

      return {
        ok: false,
        status: 502,
        message:
          'La autenticacion con Microsoft 365 fallo. Revise tenant ID, client ID, client secret y permisos Mail.Send con admin consent.',
      };
    }

    const tokenPayload = (await tokenResponse.json()) as { access_token?: string };
    const accessToken = asTrimmedString(tokenPayload.access_token);

    if (!accessToken) {
      return {
        ok: false,
        status: 502,
        message: 'Microsoft 365 no devolvio un access token valido para el envio de correo.',
      };
    }

    const graphResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(microsoftConfig.senderEmail)}/sendMail`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: `Nuevo contacto SmarSoFT: ${payload.servicio}`,
            body: {
              contentType: 'HTML',
              content: buildHtmlBody(payload),
            },
            toRecipients: [
              {
                emailAddress: {
                  address: microsoftConfig.inboxEmail,
                },
              },
            ],
            replyTo: [
              {
                emailAddress: {
                  address: payload.correo,
                  name: payload.nombre,
                },
              },
            ],
          },
          saveToSentItems: true,
        }),
      },
    );

    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      console.error('Microsoft Graph sendMail error', {
        status: graphResponse.status,
        errorText,
      });

      return {
        ok: false,
        status: 502,
        message:
          'Microsoft 365 rechazo el envio. Revise el buzon remitente, el permiso Mail.Send y el admin consent de la aplicacion.',
      };
    }

    return {
      ok: true,
      status: 200,
    };
  }

  const emailConfig = getEmailConfig(env);

  if (!emailConfig.isConfigured) {
    return {
      ok: false,
      status: 503,
      message:
        'El flujo de correo no esta configurado todavia. Configure Microsoft 365 o Cloudflare Email Service y las variables de entorno requeridas.',
    };
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${emailConfig.accountId}/email/sending/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${emailConfig.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailConfig.inboxEmail,
        from: {
          address: emailConfig.fromEmail,
          name: emailConfig.fromName,
        },
        reply_to: {
          address: payload.correo,
          name: payload.nombre,
        },
        subject: `Nuevo contacto SmarSoFT: ${payload.servicio}`,
        text: buildTextBody(payload),
        html: buildHtmlBody(payload),
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudflare Email Service error', {
      status: response.status,
      errorText,
    });

    return {
      ok: false,
      status: 502,
      message:
        'La solicitud fue validada, pero Cloudflare Email Service no acepto el envio. Revise la configuracion del dominio y del token.',
    };
  }

  return {
    ok: true,
    status: 200,
  };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
  // TODO: Agregar observabilidad y rate limiting si el volumen de tráfico lo requiere.

  const deliveryResult = await sendContactEmail(env, normalizedPayload);

  if (!deliveryResult.ok) {
    return json(
      {
        ok: false,
        message: deliveryResult.message,
      },
      deliveryResult.status,
    );
  }

  return json({
    ok: true,
    message: 'Solicitud enviada correctamente. Nos pondremos en contacto a la brevedad.',
  });
};
