// Validates every testdata fixture against the REAL functions extracted from
// radiance.html (browser globals stubbed), and asserts full branch coverage.
// Run: node test_model.js
const fs=require("fs");
const h=fs.readFileSync("index.html","utf8");
let src=h.match(/<script>([\s\S]*)<\/script>/)[1];
const noop=()=>{}; const el=new Proxy({},{get:()=>(()=>el),set:()=>true});
el.classList={toggle:noop,remove:noop}; el.querySelectorAll=()=>[]; el.options=[]; el.dataset={};
global.document={getElementById:()=>el,querySelector:()=>el,querySelectorAll:()=>[],body:{dataset:{}},createElement:()=>el};
global.localStorage={getItem:()=>null,setItem:noop}; global.fetch=()=>Promise.reject(new Error("x"));
global.location={origin:"https://vanhexen.github.io"};
const mod={}; src+="\n;mod.f5=fivestar5050;mod.rad=radiance;mod.feas=feasibleStarts;"; new Function("mod",src)(mod);
const {f5,rad,feas}=mod; const V50="2024-08-28";

const EXP={full_converges_to_0:"0",three_loss_then_CR:"1",partial_ambiguous:"AMBIG",partial_converges:"1",
 boundary_guarantee:"0",two_CR_cycles:"1",alternating_low:"0",loss_pending:"1",no_fives:"NONE",
 cr_eligible_c2:"1",export_charmap_path:"0",multi_uid:"0"};
const branches=new Set(); let pass=0,fail=0;
function charOf(f){ const d=JSON.parse(fs.readFileSync("testdata/"+f,"utf8")); return d.user.gi.uids[0].wishes.character; }

for(const f of fs.readdirSync("testdata").filter(x=>x.endsWith(".json"))){
  const key=f.replace(".json","");
  const ev=f5(charOf(f));
  let got;
  if(!ev.length){ got="NONE"; branches.add("empty"); }
  else{
    const earliest=ev.map(e=>e[0]).sort()[0], partial=earliest>V50;
    if(ev.some(e=>e[0]<V50)) branches.add("preV50skip");
    if(key==="export_charmap_path") branches.add("charmap");
    const log=rad(ev, partial?(feas(ev)[0]?feas(ev)[0][0]:1):1)[1];
    for(const r of log){ const n=r[5];
      if(n.startsWith("CR PROC")) branches.add("win_c3_CRproc");
      else if(n.startsWith("CR-eligible")) branches.add("win_c2_eligible");
      else if(n==="normal win") branches.add("win_normal");
      else if(n==="loss") branches.add("loss");
      else if(n.startsWith("guaranteed")) branches.add("guarantee"); }
    if(!partial) got=String(rad(ev,1)[0]);
    else{ const fe=feas(ev), fin=[...new Set(fe.map(x=>x[1][0]))];
      if(fe.length<4) branches.add("loss_at_c3_throw");
      got=fin.length===1?String(fin[0]):"AMBIG"; }
  }
  const exp=EXP[key];
  const ok = exp===undefined ? null : got===exp;
  if(ok===false) fail++; else if(ok===true) pass++;
  console.log((ok===null?"NOEXP":ok?"PASS ":"FAIL ")+key.padEnd(22)+" got "+got+(exp!==undefined?" exp "+exp:""));
}
const need=["win_normal","win_c2_eligible","win_c3_CRproc","loss","guarantee","loss_at_c3_throw","preV50skip","charmap","empty"];
console.log("\nbranch coverage:");
let missing=0;
for(const b of need){ const has=branches.has(b); if(!has) missing++; console.log("  "+(has?"ok ":"-- ")+b); }
const good = fail===0 && missing===0;
console.log(`\nmodel: ${pass} passed, ${fail} failed, ${missing} branches missing`);
process.exit(good?0:1);
