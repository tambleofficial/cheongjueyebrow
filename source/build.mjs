import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, v) => fs.writeFileSync(path.join(root, p), v);
const data = JSON.parse(read('source/data/site.json'));
const dimensions = JSON.parse(read('source/data/image-dimensions.json'));
const protectedMeta = JSON.parse(read('source/data/protected-meta.json'));
const {site, carousel, pages} = data;
const url = p => new URL(p, site.baseUrl).href;
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const serialize = v => JSON.stringify(v, null, 2).replace(/</g, '\\u003c');
const items = carousel.items.filter(x => x.publish);
if (new URL(site.baseUrl).protocol !== 'https:') throw Error('HTTPS base URL required');
for (const prop of ['key', 'path']) if (new Set(items.map(x => x[prop])).size !== items.length) throw Error('Duplicate carousel '+prop);
for (const item of items) {
  if (!pages.some(p => p.path === item.path)) throw Error('Missing detail '+item.path);
  if (!fs.existsSync(path.join(root, item.imagePath))) throw Error('Missing image '+item.imagePath);
}
const faq = [
  ['원하는 눈썹 모양을 미리 정해야 하나요?', '완벽하게 정해오지 않아도 됩니다. 현재 눈썹의 숱과 결, 얼굴형을 함께 보며 디자인 방향을 좁힙니다.'],
  ['참고 사진을 가져가도 되나요?', '네. 마음에 드는 자연눈썹 사진이 있다면 상담에 도움이 됩니다. 다만 본인의 얼굴에 어울리는 범위에서 조율합니다.'],
  ['좌우 눈썹이 다른데 상담할 수 있나요?', '골격과 표정 습관 때문에 좌우가 다르게 보일 수 있습니다. 얼굴 전체에서 자연스러운 균형을 확인합니다.'],
  ['매장 위치는 어디인가요?', site.addressDisplay+'입니다. 아래 구글 지도에서 위치를 확인할 수 있습니다.']
];
const faqHTML = faq.map(([q,a]) => `<details class="faq"><summary>${esc(q)}</summary><div class="answer">${esc(a)}</div></details>`).join('\n');
const consult = `<section class="consult-panel" aria-label="상담 및 비용 문의"><div class="container consult-inner"><div><p class="kicker">CONSULTATION</p><h2>내 눈썹에 맞는 방향,<br>상담에서 함께 확인하세요.</h2><p>원하는 디자인과 현재 눈썹 상태를 알려주세요. 비용과 포함 항목, 방문 가능한 일정은 매장에 직접 문의하실 수 있습니다.</p></div><div class="actions"><a class="btn primary" href="${esc(site.kakaoUrl)}" target="_blank" rel="noopener">카카오톡 상담 문의</a><a class="btn" href="${esc(site.telephoneHref)}">전화로 문의하기</a></div></div></section>`;
const cards = `<section class="top-carousel" aria-labelledby="featured-title"><div class="container"><div class="carousel-heading"><div><p class="kicker">EXPLORE BELLE MYU</p><h2 id="featured-title">${esc(carousel.name)}</h2><p>디자인부터 상담, 방문 준비까지 차근차근 살펴보세요.</p></div><div class="carousel-controls" hidden><button type="button" aria-label="이전 안내 카드" aria-controls="guide-track">←</button><button type="button" aria-label="다음 안내 카드" aria-controls="guide-track">→</button></div></div><ul class="top-track" id="guide-track">${items.map(x => `<li><a class="guide-card" href="${esc(x.path)}"><img src="${esc(x.imagePath)}" alt="${esc(x.imageAlt)}" loading="lazy" decoding="async"><span class="card-name">${esc(x.name)}</span><p>${esc(x.summary)}</p></a></li>`).join('\n')}</ul></div></section>`;
for (const page of pages) {
  let html = read('source/templates/'+page.file);
  const graph = [site.business, {'@type':'WebSite','@id':url('/#website'),url:site.baseUrl,name:site.business.name,inLanguage:'ko-KR',publisher:{'@id':site.business['@id']}}, {'@type':'WebPage','@id':url(page.path)+'#webpage',url:url(page.path),name:page.title,description:page.description,inLanguage:'ko-KR',isPartOf:{'@id':url('/#website')},about:{'@id':site.business['@id']},primaryImageOfPage:{'@type':'ImageObject',url:url(page.imagePath)}}];
  if (page.path === '/') graph.push({'@type':'ItemList','@id':url('/#'+carousel.id),name:carousel.name,numberOfItems:items.length,itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,url:url(x.path),image:url(x.imagePath)}))});
  else graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'홈',item:site.baseUrl},{'@type':'ListItem',position:2,name:page.name,item:url(page.path)}]});
  if (page.file === 'brow-design.html') graph.push({'@type':'Service','@id':url(page.path)+'#service',name:'얼굴형 맞춤 눈썹 디자인',serviceType:'눈썹 디자인 상담',url:url(page.path),image:url(page.imagePath),provider:{'@id':site.business['@id']},description:'눈썹의 숱과 결, 눈썹산과 꼬리, 얼굴형과의 균형을 함께 확인하는 디자인 상담입니다.'});
  if (page.file === 'faq-care.html' || page.file === 'index.html') graph.push({'@type':'FAQPage','@id':url(page.path)+'#faq',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
  const related = `<section class="related" aria-label="관련 안내"><div class="container"><h2>함께 살펴보세요.</h2><div class="related-links">${items.filter(x=>x.path!==page.path).map(x=>`<a href="${esc(x.path)}">${esc(x.name)} ↗</a>`).join('\n')}</div></div></section>`;
  const tokens = {SCHEMA:`<script type="application/ld+json">\n${serialize({'@context':'https://schema.org','@graph':graph})}\n</script>`,CAROUSEL:cards,CONSULT:consult,RELATED:related,HOME_FAQ:`<section class="section"><div class="container"><p class="kicker">QUESTIONS</p><h2 class="h2">상담 전 자주 묻는 질문.</h2><div class="faq-list">${faqHTML}</div><div class="actions"><a class="btn" href="/faq-care.html">방문 전 안내 자세히 보기</a></div></div></section>`,PHONE:esc(site.business.telephone),PHONE_HREF:esc(site.telephoneHref),KAKAO:esc(site.kakaoUrl),INSTAGRAM:esc(site.instagramUrl),ADDRESS:esc(site.addressDisplay)};
  html=html.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in tokens))throw Error('Missing '+key);return tokens[key]});
  if(page.file==='faq-care.html') html=html.replace(/<div class="faq-list">.*?<\/details><\/div>/s,`<div class="faq-list">${faqHTML}</div>`);
  html=html.replace(/<img\b[^>]*>/g, tag=>{const src=tag.match(/src="([^"]+)"/)?.[1];const d=dimensions[src];if(!d)throw Error('Missing dimensions '+src);return tag.replace(/>$/,` width="${d.width}" height="${d.height}">`)});
  html=html.replaceAll(`href="${page.path}">`, `href="${page.path}" aria-current="page">`);
  for(const tag of protectedMeta[page.file]) if(!html.includes(tag))throw Error('Protected metadata changed: '+page.file);
  if(/example\.com|\{\{/.test(html))throw Error('Unresolved value: '+page.file);
  // Keep final HTML readable without rewriting the protected tags.
  html=html.replace(/>(?=<(?:section|div|article|figure|header|footer|nav|main|h[1-6]|p\b|link|meta|\/))/g,'>\n');
  write(page.file,html+'\n');
}
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`  <url><loc>${esc(url(p.path))}</loc><lastmod>${p.modified}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${url('/sitemap.xml')}\n`);
// Original publication dates remain intact. Only descriptions are made page-specific.
let rss=read('source/data/rss.xml');let ri=0;rss=rss.replace(/<item>[\s\S]*?<\/item>/g,block=>block.replace(/<description>.*?<\/description>/,`<description>${esc(pages.find(p=>block.includes(url(p.path)+'</link>'))?.description || pages[ri++].description)}</description>`));write('rss.xml',rss);
write('docs/carousel-mapping.csv','\uFEFF순서,카드명,상세URL,이미지URL\n'+items.map((x,i)=>[i+1,x.name,url(x.path),url(x.imagePath)].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n');
write('docs/page-urls.txt',pages.map(p=>url(p.path)).join('\n')+'\n');
console.log(`Built ${pages.length} pages; ${items.length} synchronized cards; protected metadata unchanged.`);
const htmlPaths = pages.filter(p=>p.path!=='/').map(p=>p.path).concat(fs.readdirSync(root).filter(f=>/^naver.*\.html$/.test(f)).map(f=>'/'+f));
const collect = dir => fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?collect(dir+'/'+e.name):['/'+dir+'/'+e.name]);
const assetPaths = [...collect('images'), ...collect('assets'), '/robots.txt','/sitemap.xml','/rss.xml'];
write('_worker.js',read('source/worker-template.js').replace('__HTML_PATHS__',JSON.stringify(htmlPaths)).replace('__ASSET_PATHS__',JSON.stringify(assetPaths)));
