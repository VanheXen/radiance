// DOM-stub harness: drives the REAL render() / fetchWishes() from radiance.html
// through the interactive paths that static fixtures can't reach.
// Run: node test_ui.js
const fs = require("fs");

// ---- minimal fake DOM ----
function mkEl(){
  return {
    textContent:"", _html:"", hidden:false, value:"", disabled:false, dataset:{},
    options:[],
    classList:{ _s:new Set(),
      toggle(c,on){ on?this._s.add(c):this._s.delete(c); },
      add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, contains(c){return this._s.has(c);} },
    get length(){ return this.options.length; }, set length(n){ this.options.length=n; },
    get innerHTML(){ return this._html; }, set innerHTML(v){ this._html=v; },
    insertAdjacentHTML(_p,html){ this._html+=html; },
    appendChild(o){ this.options.push(o); },
    addEventListener(){},
  };
}
const reg={};
function get(id){ return reg[id] || (reg[id]=mkEl()); }
// pre-seed selects
const seed=get("seed"); seed.options=["0","1","2","3"].map(v=>({value:v,hidden:false})); seed.value="1";
const crpick=get("crpick"); crpick.options=[{value:"-1",hidden:false}]; crpick.value="-1";
const pips=[mkEl(),mkEl(),mkEl()];
const tbody=mkEl();
global.document={
  getElementById:get,
  querySelector:s=> s==="#tbl tbody"?tbody:mkEl(),
  querySelectorAll:s=> s===".pip"?pips:[],
  createElement:()=>({ _v:"", get value(){return this._v;}, set value(x){this._v=String(x);}, // browsers stringify option.value
                       textContent:"", hidden:false }),
  body:{dataset:{}},
};
global.localStorage={getItem:()=>null,setItem(){}};
global.fetch=()=>Promise.reject(new Error("no default net"));

// ---- load real script, export the functions we need ----
let src=fs.readFileSync("index.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1];
src+="\n;mod.render=render;mod.fetchWishes=fetchWishes;mod.f5=fivestar5050;"
   +"mod.showUid=showUid;mod._setLoaded=(u,f)=>{LOADED={uids:u,fname:f};};";
const mod={}; new Function("mod",src)(mod);
const {render,fetchWishes,f5}=mod;

const charOf=f=>JSON.parse(fs.readFileSync("testdata/"+f,"utf8")).user.gi.uids[0].wishes.character;
let pass=0, fail=0;
function check(name,cond,extra=""){ (cond?pass++:fail++); console.log((cond?"PASS ":"FAIL ")+name+(cond?"":"  <-- "+extra)); }

// ===== UI-1: seed change re-drives the counter (ambiguous fixture) =====
(function(){
  const ch=charOf("partial_ambiguous.json");
  seed.value="1"; crpick.value="-1"; render(ch,"partial_ambiguous");
  const c1=String(get("counter").textContent), boxHidden=get("seedbox").hidden;
  seed.value="2"; render(ch,"partial_ambiguous");
  const c2=String(get("counter").textContent);
  check("UI-1 ambiguous shows seedbox", boxHidden===false, "seedbox.hidden="+boxHidden);
  check("UI-1 seed 1 -> counter 1", c1==="1", "got "+c1);
  check("UI-1 seed 2 -> counter 2", c2==="2", "got "+c2);
})();

// find WIN event indices in three_loss for CR-pick tests
const ev3=f5(charOf("three_loss_then_CR.json"));
const winIdx=ev3.map((e,i)=>e[2]==="WIN"?i:-1).filter(i=>i>=0);
const firstWin=winIdx[0], lastWin=winIdx[winIdx.length-1];

// ===== UI-2: valid CR-pick (the real CR proc) -> certain =====
(function(){
  const ch=charOf("three_loss_then_CR.json");
  seed.value="1"; crpick.value=String(lastWin); render(ch,"three_loss");
  const note=get("note").textContent, counter=String(get("counter").textContent);
  check("UI-2 valid CR-pick stays certain", /radiance pull/i.test(note)&&counter==="1", "note="+JSON.stringify(note)+" c="+counter);
})();

// ===== UI-3: impossible CR-pick (first win can never be a CR) -> badAnchor message =====
(function(){
  const ch=charOf("three_loss_then_CR.json");
  crpick.value=String(firstWin); render(ch,"three_loss");
  const note=get("note").textContent;
  check("UI-3 bad CR-pick rejected", /can't have been a Capturing Radiance/i.test(note), "note="+JSON.stringify(note));
  crpick.value="-1";
})();

// ===== UI-8: malicious character name is HTML-escaped (no XSS) =====
(function(){
  const mal='<img src=x onerror=alert(1)>';
  const w=[{type:"character",name:mal,rarity:5,item_id:99999999,timestamp:"2025-01-01T00:00:00Z"}];
  seed.value="1"; crpick.value="-1"; render(w,"xss");
  const html=tbody._html;
  check("UI-8 malicious name escaped (no XSS)", html.includes("&lt;img")&&!/<img/i.test(html), "html="+html.slice(0,140));
})();

// ===== UI-7: multi-UID switch (export with 2 accounts) =====
(function(){
  const uids=JSON.parse(fs.readFileSync("testdata/multi_uid.json","utf8")).user.gi.uids;
  mod._setLoaded(uids,"multi_uid");
  mod.showUid(0); const a=String(get("counter").textContent);
  mod.showUid(1); const b=String(get("counter").textContent);
  check("UI-7 multi-UID switch (uid0=0, uid1=1)", a==="0"&&b==="1", "uid0="+a+" uid1="+b);
})();

// ===== UI-4/5/6: fetch paths (stub global.fetch -> the proxy at WORKER_URL) =====
function stub(routes){ global.fetch=(url,opts)=>{ for(const [re,resp] of routes){ if(re.test(url)) return Promise.resolve(typeof resp==="function"?resp():resp); } return Promise.reject(new Error("unrouted "+url)); }; }
const json=o=>({ok:true,status:200,json:()=>Promise.resolve(o)});
const errResp=(status,o)=>({ok:false,status,json:()=>Promise.resolve(o)});
const LINK="https://hk4e-api-os.hoyoverse.com/event/gacha_info/api/getGachaLog?authkey=xyz";

(async function(){
  // UI-4 success: proxy returns character rows
  stub([[/deno\.net/, ()=>json({ character: charOf("full_converges_to_0.json") })]]);
  get("status").textContent=""; await fetchWishes(LINK);
  check("UI-4 link fetch renders", String(get("counter").textContent)==="0" && !/Couldn't/.test(get("status").textContent),
        "status="+JSON.stringify(get("status").textContent)+" c="+get("counter").textContent);

  // UI-5 bad link -> proxy 400 with error message, surfaced verbatim
  stub([[/deno\.net/, errResp(400,{error:"invalid/expired wish link"})]]);
  await fetchWishes(LINK);
  check("UI-5 bad link -> invalid/expired", /invalid\/expired/i.test(get("status").textContent), "status="+JSON.stringify(get("status").textContent));

  // UI-6 link with no character-banner pulls -> radiance-only guidance
  stub([[/deno\.net/, json({character:[]})]]);
  await fetchWishes(LINK);
  check("UI-6 no char pulls -> radiance-only message", /character-banner/i.test(get("status").textContent), "status="+JSON.stringify(get("status").textContent));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail?1:0);
})();
