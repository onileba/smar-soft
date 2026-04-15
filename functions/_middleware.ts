const CANONICAL_HOST = 'smar-soft.com';
const WWW_HOST = 'www.smar-soft.com';

export const onRequest = async (context: {
  request: Request;
  next: () => Promise<Response>;
}) => {
  const url = new URL(context.request.url);

  if (url.hostname === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';

    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};
