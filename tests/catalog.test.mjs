import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {albums} from '../src/data.js';
function jpegSize(bytes){let i=2;while(i<bytes.length){if(bytes[i]!==255){i++;continue}const marker=bytes[i+1];if(marker===0xd9||marker===0xda)break;const size=bytes.readUInt16BE(i+2);if([0xc0,0xc1,0xc2].includes(marker))return {width:bytes.readUInt16BE(i+7),height:bytes.readUInt16BE(i+5)};i+=2+size;}throw Error('Invalid JPEG');}
test('17 uses a verified large square source instead of the old thumbnail',()=>{const {width,height}=jpegSize(readFileSync('public/assets/official-album-17.jpg'));assert.equal(width,height);assert.ok(width>=1000,`Artwork is only ${width}px`)});
test('every catalogued album ships with local square artwork',()=>{for(const a of albums){const path=`public/assets/official-${a.art}.jpg`;assert.ok(existsSync(path),`${a.title}: missing asset`);const {width,height}=jpegSize(readFileSync(path));assert.equal(width,height,`${a.title}: non-square source`);assert.ok(width>=300,`${a.title}: thumbnail`)}});
test('WIU portrait has a dedicated crop, not the group fallback',()=>{assert.notEqual(readFileSync('public/assets/artist-wiu.jpg').toString('base64'),readFileSync('public/assets/artist-trio.jpg').toString('base64'))});
test('catalogue snapshot is valid and keeps track titles',()=>{const catalog=JSON.parse(readFileSync('public/album-tracklists.json'));assert.ok(catalog['album-17'].tracks.some(t=>t.title==='Jocelyn Flores'));for(const entry of Object.values(catalog))for(const t of entry.tracks)assert.ok(typeof t.title==='string'&&t.title.trim())});
