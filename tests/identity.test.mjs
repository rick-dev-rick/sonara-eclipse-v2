import test from 'node:test';
import assert from 'node:assert/strict';
import {trackId,migrateFavorites,queueWithTrack} from '../src/catalog.js';
import {demoTracks} from '../src/data.js';
test('artist, search and demonstration recording have the same identity',()=>{assert.equal(trackId({title:'SAD!',artist:'XXXTENTACION'}),trackId(demoTracks[1]));assert.equal(trackId({title:'SAD!',artist:'XXXTENTACION',id:'?|SAD!'}),trackId(demoTracks[1]))});
test('selecting an existing recording does not duplicate its queue entry',()=>{const t={title:'SAD!',artist:'XXXTENTACION',cover:'album-question'};assert.equal(queueWithTrack(t,demoTracks).filter(d=>d.title==='SAD!').length,1)});
test('old favourite formats converge without losing artists and albums',()=>{const list=migrateFavorites(['legacy-Jocelyn Flores','17|Jocelyn Flores','xxx-sad','SAD!','17','XXXTENTACION']);assert.deepEqual(list,[trackId({title:'Jocelyn Flores',artist:'XXXTENTACION'}),trackId(demoTracks[1]),'17','XXXTENTACION'])});
test('a track cannot alias its album',()=>{assert.notEqual(trackId(demoTracks[0]),'Máquina do Tempo')});
