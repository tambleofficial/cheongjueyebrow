const htmlPaths = ["/brow-design.html","/consultation-process.html","/portfolio-guide.html","/faq-care.html","/visit-location.html","/naver38f30a1e178ab296c7f5ea2a4e36e27e.html"];
const assets = ["/images/belle-myu/bm-v3-01-hero.jpg","/images/belle-myu/bm-v3-02-consultation.jpg","/images/belle-myu/bm-v3-03-brow-closeup.jpg","/images/belle-myu/bm-v3-04-brow-process.jpg","/images/belle-myu/bm-v3-05-result-a.jpg","/images/belle-myu/bm-v3-06-result-b.jpg","/images/belle-myu/bm-v3-07-mirror.jpg","/images/belle-myu/bm-v3-08-hanbok.jpg","/images/belle-myu/bm-v3-09-portrait.jpg","/images/belle-myu/bm-v3-10-entrance.jpg","/images/belle-myu/bm-v3-11-interior.jpg","/images/belle-myu/bm-v3-12-space-a.jpg","/images/belle-myu/bm-v3-13-space-b.jpg","/images/belle-myu/brow-detail-01.jpg","/images/belle-myu/brow-detail-02.jpg","/images/belle-myu/brow-process.jpg","/images/belle-myu/brow-result-01.jpg","/images/belle-myu/brow-result-02.jpg","/images/belle-myu/consultation.jpg","/images/belle-myu/hero-main.jpg","/images/belle-myu/lifestyle-01.jpg","/images/belle-myu/lifestyle-02.jpg","/images/belle-myu/space-treatment-01.jpg","/images/belle-myu/space-treatment-02.jpg","/images/belle-myu/store-entrance.jpg","/images/belle-myu/store-interior.jpg","/assets/fonts/S-CoreDream-4Regular.woff","/assets/fonts/S-CoreDream-6Bold.woff","/assets/site.css","/assets/site.js","/robots.txt","/sitemap.xml","/rss.xml"];
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
