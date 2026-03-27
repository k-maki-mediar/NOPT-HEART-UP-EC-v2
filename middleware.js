export const config = {
  matcher: '/(.*)',
};

export default function middleware(request) {
  const url = new URL(request.url);

  // BrowserSyncのwebsocket等は除外
  if (url.pathname.startsWith('/__')) {
    return;
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, ...passParts] = decoded.split(':');
      const pass = passParts.join(':');

      const expectedUser = process.env.BASIC_AUTH_USER;
      const expectedPass = process.env.BASIC_AUTH_PASSWORD;

      if (user === expectedUser && pass === expectedPass) {
        return new Response(null, {
          status: 200,
          headers: {
            'x-middleware-next': '1',
          },
        });
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });
}
