import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {albums} from '../src/data.js';
const dir=path.resolve('public/assets');
await mkdir(dir,{recursive:true});
const sourceArt={
'XXXTENTACION|17':'https://coverartarchive.org/release/1395477c-a71e-4058-a893-d33dfcad6a4b/front-500',
'XXXTENTACION|?':'https://coverartarchive.org/release/8c6866b0-cf04-47a2-ab2f-11ff6d51e893/front-500',
'XXXTENTACION|SKINS':'https://coverartarchive.org/release/e44941d5-47f8-4a41-ae64-05953df0a3b9/front-500',
'XXXTENTACION|LOOK AT ME: THE ALBUM':'https://coverartarchive.org/release/2636ce72-1351-4cf9-80de-f491f129289b/front-500'
};
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const isMatch=(album,item)=>{const target=normalize(album.title),actual=normalize(item.collectionName),artist=normalize(item.artistName);return (actual===target||actual.startsWith(target+' ')||target.startsWith(actual+' '))&&artist.includes(normalize(album.artist).split(' ')[0])};
async function get(url,ms=9000){const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);try{return await fetch(url,{signal:c.signal,headers:{'User-Agent':'SONARA-Eclipse-Portfolio/1.0 (album artwork metadata)',Accept:'application/json,image/*'}})}finally{clearTimeout(t)}}
let obtained=0,missing=[];
for(const album of albums){
 const dest=path.join(dir,'official-'+album.art+'.jpg');
 const key=album.artist+'|'+album.title;
 let urls=[];
 if(sourceArt[key])urls.push(sourceArt[key]);
 try{
  const q=new URL('https://itunes.apple.com/search');
  q.searchParams.set('term',album.artist+' '+album.title);
  q.searchParams.set('entity','album');
  q.searchParams.set('country','BR');
  q.searchParams.set('limit','50');
  const res=await get(q);
  if(res.ok){
    const js=await res.json();
    const hit=(js.results||[]).find(x=>isMatch(album,x));
    if(hit?.artworkUrl100)urls.push(hit.artworkUrl100.replace(/\d+x\d+bb/,'1200x1200bb'));
  }
 }catch(err){console.log('Search unavailable:',album.title,String(err.message||err))}
 // Deezer lists official-label album artwork where iTunes editions differ.
 try{
   const q='https://api.deezer.com/search/album?q='+encodeURIComponent(album.artist+' '+album.title)+'&limit=40';
   const res=await get(q,8000);
   if(res.ok){
     const js=await res.json();
     const hit=(js.data||[]).find(x=>{const title=normalize(x.title),target=normalize(album.title),artist=normalize(x.artist?.name||'');return (title===target||title.startsWith(target+' ')||target.startsWith(title+' '))&&artist.includes(normalize(album.artist).split(' ')[0])});
     if(hit?.cover_xl)urls.push(hit.cover_xl);
   }
 }catch(e){console.log('Second catalog unavailable:',album.title)}
 let success=false;
 for(const url of urls){
   try{const response=await get(url);if(!response.ok)continue;const type=response.headers.get('content-type')||'';if(!type.includes('image/'))continue;const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length<4000)continue;await writeFile(dest,bytes);success=true;obtained++;break}catch{}
 }
 if(!success)missing.push(album.artist+' — '+album.title);
 console.log((success?'FOUND':'MISSING')+' official cover:',album.artist,'—',album.title);
}
console.log('Album artwork:',obtained,'of',albums.length,'found. Missing:',JSON.stringify(missing));
