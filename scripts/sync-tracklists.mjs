import {albums} from '../src/data.js';
import {writeFile,mkdir} from 'node:fs/promises';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const formatDuration=ms=>{const sec=Math.round(Number(ms)/1000);return Number.isFinite(sec)&&sec>0?`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`:null};
const choose=(a,list)=>list.filter(x=>{const title=normalize(x.title||x.collectionName),artist=normalize(x.artist?.name||x.artistName),target=normalize(a.title),who=normalize(a.artist);return (title===target||title.startsWith(target+' ')||target.startsWith(title+' '))&&artist.includes(who)}).sort((x,y)=>Math.abs(Number((x.release_date||x.releaseDate||'').slice(0,4)||a.year)-Number(a.year))-Math.abs(Number((y.release_date||y.releaseDate||'').slice(0,4)||a.year)-Number(a.year)))[0];
async function json(url){const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),10000);try{const r=await fetch(url,{signal:ctrl.signal,headers:{Accept:'application/json','User-Agent':'SONARA-Eclipse/1.0 (discography metadata)'}});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(timer)}}
const catalog={};
for(const a of albums){
 let tracks=[],source='',complete=false,matchedTitle='';
 // iTunes album -> complete album track listing with albumId + tracks (no audio copied).
 try{
 const qs=new URL('https://itunes.apple.com/search');qs.searchParams.set('term',a.artist+' '+a.title);qs.searchParams.set('entity','album');qs.searchParams.set('country','BR');qs.searchParams.set('limit','80');
 const search=await json(qs);
 const hit=choose(a,(search.results||[]).map(x=>({...x,title:x.collectionName})));
 if(hit?.collectionId){
 const look=await json('https://itunes.apple.com/lookup?id='+hit.collectionId+'&entity=song&country=BR&limit=200');
 const songs=(look.results||[]).filter(x=>x.wrapperType==='track'&&x.collectionId===hit.collectionId&&x.kind==='song').sort((x,y)=>(x.discNumber||1)-(y.discNumber||1)||(x.trackNumber||0)-(y.trackNumber||0));
 if(songs.length){tracks=songs.map(x=>({title:x.trackName,disc:x.discNumber||1,number:x.trackNumber||0,duration:formatDuration(x.trackTimeMillis)}));complete=!!hit.trackCount&&songs.length>=hit.trackCount;source='Apple Music';matchedTitle=hit.collectionName;}
 }
 }catch(e){console.log('iTunes unavailable',a.title,String(e.message||e))}
 // Deezer exposes its own album track listing when iTunes metadata is incomplete or absent.
 if(!complete){try{
 const search=await json('https://api.deezer.com/search/album?q='+encodeURIComponent(a.artist+' '+a.title)+'&limit=100');
 const hit=choose(a,search.data||[]);
 if(hit?.id){
 const info=await json('https://api.deezer.com/album/'+hit.id);
 let songs=info.tracks?.data||[];
 if(info.tracks?.next){let next=info.tracks.next;for(let i=0;i<5&&next;i++){const pg=await json(next);songs.push(...(pg.data||[]));next=pg.next}}
 if(songs.length>tracks.length){tracks=songs.map((x,i)=>({title:x.title,disc:x.disk_number||1,number:x.track_position||i+1,duration:formatDuration((x.duration||0)*1000)}));complete=!!info.nb_tracks&&songs.length>=info.nb_tracks;source='Deezer';matchedTitle=info.title;}
 }
 }catch(e){console.log('Deezer unavailable',a.title,String(e.message||e))}}
 // Do not present unverified fallback as a full original album tracklist.
 catalog[a.art]={tracks,complete,source,matchedTitle,expected:tracks.length,artist:a.artist,album:a.title};
 console.log(`${a.artist} / ${a.title}: ${tracks.length} tracks, complete=${complete}, source=${source||'none'}`);
}
await mkdir('public',{recursive:true});await writeFile('public/album-tracklists.json',JSON.stringify(catalog,null,2));
console.log('Catalogue generated:',Object.entries(catalog).filter(([,v])=>v.complete).length,'complete albums of',albums.length);
