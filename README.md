# SmarSoFT Corporate MVP

Sitio corporativo MVP desarrollado con Astro + TypeScript + Tailwind CSS, orientado a despliegue en Cloudflare Pages.

## Stack

- Astro
- TypeScript con configuración estricta
- Tailwind CSS 3 mediante integración oficial de Astro
- Cloudflare Pages Functions para el endpoint inicial de contacto

## Estructura principal

```text
.
├── astro.config.mjs
├── functions/
│   └── api/
│       └── contact.ts
├── public/
│   ├── favicon.svg
│   ├── og-default.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── contact/
│   │   ├── home/
│   │   ├── layout/
│   │   └── ui/
│   ├── data/
│   ├── pages/
│   └── styles/
├── tsconfig.json
└── wrangler.jsonc
```

## Scripts

- `npm run dev`: inicia el servidor de desarrollo
- `npm run build`: valida TypeScript/Astro y genera la carpeta `dist`
- `npm run preview`: sirve la versión compilada localmente

## Desarrollo local

1. Instale dependencias:

```bash
npm install
```

2. Ejecute el proyecto:

```bash
npm run dev
```

3. Abra `http://localhost:4321`

## Compilación

```bash
npm run build
```

La compilación genera el sitio estático en `dist/`. El sitemap base se publica desde `public/sitemap.xml`.

## Despliegue en Cloudflare Pages

### Opción 1: Desde el panel de Cloudflare Pages

1. Suba este repositorio a GitHub, GitLab o Bitbucket.
2. Cree un proyecto en Cloudflare Pages conectado al repositorio.
3. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Cloudflare detectará automáticamente la carpeta `functions/` para publicar el endpoint `/api/contact`.
5. Agregue también el dominio `www.smar-soft.com` al proyecto si desea recibir tráfico desde `www`.

### Canonical y redirección de `www`

- El sitio publica `https://smar-soft.com` como dominio canónico principal.
- El proyecto incluye [functions/_middleware.ts](./functions/_middleware.ts) para redirigir solicitudes que lleguen con host `www.smar-soft.com` hacia `https://smar-soft.com`, preservando ruta y query string.
- Para que esta redirección funcione en producción, `www.smar-soft.com` también debe apuntar al proyecto de Cloudflare Pages.
- A nivel de plataforma, Cloudflare recomienda configurar este escenario con Bulk Redirects para la estrategia definitiva de `www` hacia el apex.

### Opción 2: Con Wrangler

1. Instale Wrangler si aún no lo tiene:

```bash
npm install -D wrangler
```

2. Autentíquese:

```bash
npx wrangler login
```

3. Compile:

```bash
npm run build
```

4. Publique:

```bash
npx wrangler pages deploy dist
```

## Endpoint inicial de contacto

Ruta: `POST /api/contact`

Payload JSON esperado:

```json
{
  "nombre": "Nombre Apellido",
  "empresa": "Empresa SA de CV",
  "correo": "correo@empresa.com",
  "telefono": "+52 000 000 0000",
  "servicio": "Consultoría tecnológica",
  "mensaje": "Queremos analizar una iniciativa de modernización."
}
```

Respuesta exitosa:

```json
{
  "ok": true,
  "message": "Solicitud recibida. Nos pondremos en contacto a la brevedad.",
  "data": {
    "nombre": "Nombre Apellido",
    "empresa": "Empresa SA de CV",
    "correo": "correo@empresa.com",
    "telefono": "+52 000 000 0000",
    "servicio": "Consultoría tecnológica",
    "mensaje": "Queremos analizar una iniciativa de modernización.",
    "createdAt": "2026-04-15T00:00:00.000Z"
  }
}
```

## Pendientes recomendados para siguiente iteración

- Integrar Cloudflare Turnstile en el formulario
- Conectar correo transaccional o almacenamiento persistente
- Reemplazar placeholders legales y de contacto
- Definir analítica, eventos y conversiones
