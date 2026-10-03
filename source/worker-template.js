const htmlPaths = __HTML_PATHS__;
const assets = __ASSET_PATHS__;
export default {
  async fetch(request, env) {
    const u = new URL(request.url);
    const p = u.pathname;
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method Not Allowed', {status:405,headers:{Allow:'GET, HEAD'}});
    if (p === '/index.html' || p === '/index') {
      u.pathname = '/';
      return Response.redirect(u.href, 301);
    }
    if (p === '/feed' || p === '/feed/' || p === '/rss') {
      u.pathname = '/rss.xml';
      return Response.redirect(u.href, 301);
    }
    const clean = p.replace(/\/$/, '');
    if (htmlPaths.includes(clean+'.html')) {
      u.pathname = clean+'.html';
      return Response.redirect(u.href, 301);
    }
    if (p === '/' || htmlPaths.includes(p) || assets.includes(p)) {
      // Pages normally redirects .html to clean URLs. Fetch the clean static
      // asset internally so the already-indexed .html URL remains a 200 URL.
      if (htmlPaths.includes(p)) u.pathname = p.slice(0,-5);
      const result = await env.ASSETS.fetch(new Request(u, request));
      const headers = new Headers(result.headers);
      headers.set('X-Content-Type-Options','nosniff');
      headers.set('Referrer-Policy','strict-origin-when-cross-origin');
      if (p === '/' || htmlPaths.includes(p)) headers.set('Cache-Control','public, max-age=0, must-revalidate');
      if (p === '/rss.xml') headers.set('Content-Type','application/rss+xml; charset=utf-8');
      if (p === '/sitemap.xml') headers.set('Content-Type','application/xml; charset=utf-8');
      return new Response(request.method === 'HEAD' ? null : result.body,{status:result.status,headers});
    }
    const missing = new URL('/404', u);
    const result = await env.ASSETS.fetch(new Request(missing,request));
    return new Response(request.method === 'HEAD' ? null : result.body,{status:404,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-cache'}});
  }
};
