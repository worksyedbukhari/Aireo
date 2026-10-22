import test from 'node:test';
import assert from 'node:assert/strict';
import {airports,findFlights,createBooking,lookupBooking,updateBooking,listBookings,joinCircle,saveEnquiry,validDate,resetDemo} from './dist/journey-store.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const date=new Date(Date.now()+30*86400000).toISOString().slice(0,10);
const returnDate=new Date(Date.now()+37*86400000).toISOString().slice(0,10);
const search={from:'RUH',to:'LHR',date,returnDate,trip:'return',cabin:'Business',passengers:2};
test('route search validates dates and keeps flight IDs unique across routes',()=>{
 assert.equal(validDate('2026-02-30'),false);
 assert.throws(()=>findFlights({...search,from:'LHR'}),/different airports/);
 assert.throws(()=>findFlights({...search,date:'2026-02-30'}),/valid departure/);
 assert.throws(()=>findFlights({...search,returnDate:'2000-01-01'}),/return date/);
 assert.throws(()=>findFlights({...search,passengers:0}),/1 and 6/);
 const ids=new Set();for(const from of airports)for(const to of airports){if(from===to)continue;const flights=findFlights({...search,from:from.code,to:to.code});assert.equal(flights.length,3);for(const f of flights){assert(!ids.has(f.id));ids.add(f.id);assert(f.price>0);assert.match(f.arrival,/^\d{2}:\d{2}$/);assert(validDate(f.arrivalDate));}}
});
test('multi-guest round trip validates seats, persists, checks in and cancels',()=>{
 const outbound=findFlights(search)[0],inbound=findFlights({...search,from:'LHR',to:'RUH',date:returnDate})[1];
 const input={search,outbound:outbound.id,inbound:inbound.id,guests:[{first:'Alex',last:'Demo'},{first:'Sam',last:'Demo'}],email:'alex@example.com',seats:['1A','1C']};
 assert.throws(()=>createBooking({...input,seats:['1A','1A']}),/seat/);
 assert.throws(()=>createBooking({...input,seats:['2A','1C']}),/seat/);
 assert.throws(()=>createBooking({...input,guests:[]}),/every guest/);
 const b=createBooking(input);assert.equal(b.total,(outbound.price+inbound.price)*2);
 assert.equal(listBookings()[0].reference,b.reference);
 assert.equal(lookupBooking({reference:b.reference.toLowerCase(),last:'demo'}).reference,b.reference);
 assert.throws(()=>lookupBooking({reference:b.reference,last:'wrong'}),/No matching/);
 assert.equal(updateBooking({reference:b.reference,last:'Demo'},'checkin').checkedIn,true);
 const cancelled=updateBooking({reference:b.reference,last:'Demo'},'cancel');assert.equal(cancelled.status,'Cancelled');assert.equal(cancelled.checkedIn,false);
 assert.throws(()=>updateBooking({reference:b.reference,last:'Demo'},'checkin'),/cancelled/);
});
test('one-way booking, duplicate membership and enquiry validation work without a server',()=>{
 const q={...search,passengers:1,trip:'oneway',returnDate:'',cabin:'Economy'};
 const b=createBooking({search:q,outbound:findFlights(q)[0].id,guests:[{first:'Taylor',last:'Sample'}],email:'t@example.com',seats:['4A']});assert.equal(b.inbound,null);
 const member=joinCircle({name:'Taylor',email:'t@example.com'});assert.equal(joinCircle({name:'Taylor',email:'T@example.com'}).id,member.id);
 assert.throws(()=>saveEnquiry({email:'not-an-email',message:'Please help me plan a trip.'}),/valid email/);
 assert(saveEnquiry({email:'t@example.com',message:'Please help me plan a trip.'}).id);
 resetDemo();assert.deepEqual(listBookings(),[]);
});
test('storage errors never claim a reservation was saved',()=>{const original=localStorage.setItem;localStorage.setItem=()=>{throw new Error('Quota exceeded')};assert.throws(()=>joinCircle({name:'Alex',email:'alex@example.com'}),/could not save/);localStorage.setItem=original;});
