import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const assets=JSON.parse(readFileSync('public/assets/art-direction.json'));
test('cinematic hero art is supplied at display quality',()=>{for(const file of ['hero-x-cinematic.webp','hero-trap-cinematic.webp','legacy-archive-final.webp']){const a=assets.find(x=>x.file===file);assert.ok(a?.width>=1500);assert.ok(a?.height>=600);assert.equal(createHash('sha256').update(readFileSync('public/assets/'+file)).digest('hex'),a.sha256)}});
test('legacy chapter art and clean mood backgrounds ship with matching bytes',()=>{for(const file of ['archive-paper-texture.webp','archive-palms.webp','mood-after-dark-art.webp','mood-deep-focus-art.webp','mood-night-drive-art.webp','mood-energy-art.webp']){const a=assets.find(x=>x.file===file);assert.ok(a,file+' missing');const bytes=readFileSync('public/assets/'+file);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256)}});
