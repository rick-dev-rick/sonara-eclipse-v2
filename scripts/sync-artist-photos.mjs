import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('public/assets');await mkdir(dir,{recursive:true});
const commons=(name)=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name)+'?width=1200';
async function download(url,out){const c=new AbortController();const t=setTimeout(()=>c.abort(),16000);try{const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':'SONARA-Eclipse/1.0 (portfolio; attribution Wikimedia Commons)',Accept:'image/*'}});if(!r.ok)throw Error('HTTP '+r.status);const b=Buffer.from(await r.arrayBuffer());if(b.length<10000)throw Error('Image too small');await writeFile(path.join(dir,out),b);console.log('PHOTO OK',out,b.length)}finally{clearTimeout(t)}}
const group='https://s2-quem.glbimg.com/gIyARkDOOZKA1FCNloXy--IKF_4%3D/0x1436%3A4160x5683/984x0/smart/filters%3Astrip_icc%28%29/i.s3.glbimg.com/v1/AUTH_b0f0e84207c948ab8b8777be5a6a4395/internal_photos/bs/2024/3/c/S7JOnUQJGX8URD4Rjeew/img-9209.jpeg';
const sources=[
 ['artist-x.jpg',commons('Xxxtentacion b-w.jpg')],
 ['artist-matue.jpg',commons('Matuê.jpg')],
 ['artist-teto.jpg',commons('Teto 2024.jpg')],
 ['artist-trio.jpg',group],
 ['artist-wiu-verified.webp','https://midia26.b-cdn.net/2026/11/wiu-piranguera-capa.jpg?format=webp&quality=90&width=1200']
];
const results=await Promise.allSettled(sources.map(async([file,url])=>download(url,file)));
results.forEach((r,i)=>console.log(sources[i][0],r.status,r.status==='rejected'?String(r.reason):''));
