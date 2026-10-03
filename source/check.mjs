import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'source/data/site.json'),'utf8'));
const locked=JSON.parse(fs.readFileSync(path.join(root,'source/data/protected-meta.json'),'utf8'));
for(const p of data.pages){
 const html=fs.readFileSync(path.join(root,p.file),'utf8');
 for(const t of locked[p.file])assert(html.includes(t),p.file+' metadata changed');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,p.file+' H1');
 assert.equal([...html.matchAll(/<main\b/g)].length,1,p.file+' main');
 assert(!/\{\{|example\.com/.test(html),p.file+' unresolved content');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.equal(graph.filter(x=>x['@type']==='ItemList').length,p.file==='index.html'?1:0);
 for(const [,a] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!a.startsWith('/')||a==='/')continue;
  const target=a.split('#')[0].split('?')[0];
  assert(fs.existsSync(path.join(root,target)),p.file+' missing '+target);
 }
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];
 assert.equal(canonical,new URL(p.path,data.site.baseUrl).href);
}
console.log('PASS: six pages, protected metadata, H1/main, JSON-LD, canonical URLs and local links/assets.');
