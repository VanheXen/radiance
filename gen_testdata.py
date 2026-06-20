#!/usr/bin/env python3
"""Generate labeled wish-history fixtures for the radiance calculator.

Outputs testdata/<scenario>.json (Load-JSON shape: rows with name/rarity/item_id)
plus testdata/EXPECTED.md with the counter/certainty each file should produce.
Dev tool, not part of the portable app.

Scenario tokens (character-banner 5★ outcomes, in order):
  W = won 50/50 (featured char)
  L = lost 50/50 (standard char) -> next featured 5★ is the guarantee
  G = guaranteed featured 5★ (must follow an L)
Dates before 2024-08-28 are pre-v5.0 (don't move the radiance counter).
"""
import json, os, random, datetime

random.seed(42)
OUT = "testdata"
V50 = "2024-08-28"
FEATURED = [("Mavuika",10000106),("Furina",10000089),("Neuvillette",10000087),
            ("Arlecchino",10000096),("Clorinde",10000098),("Lyney",10000084)]
STANDARD = [("Mona",10000041),("Qiqi",10000035),("Jean",10000003),
            ("Keqing",10000042),("Diluc",10000016)]
FILL4 = [("Bennett",10000032,4,"character"),("Xingqiu",10000025,4,"character")]
FILL3 = [("Cool Steel",11301,3,"weapon"),("Harbinger of Dawn",11302,3,"weapon")]

# ---- the radiance model (mirror of the HTML), used to LABEL expected output ----
STD = {n for n,_ in STANDARD}
def events_from(char):
    out=[]; guaranteed=False; since=0
    for p in char:
        since+=1
        if not (p["type"]=="character" and p["rarity"]==5): continue
        ts=p["timestamp"][:10]; name=p["name"]; pity=since; since=0
        if guaranteed: out.append((ts,name,"GUARANTEE",pity)); guaranteed=False; continue
        if name in STD: out.append((ts,name,"LOSS",pity)); guaranteed=True
        else: out.append((ts,name,"WIN",pity))
    return out
def radiance(events, start=1):
    c=start
    for ts,name,res,pity in events:
        if ts<V50: continue
        if res=="GUARANTEE": pass
        elif res=="WIN": c = 1 if c in (2,3) else max(0,c-1)
        else:
            if c==3: raise ValueError("impossible")
            c+=1
    return c
def feasible(events):
    out=[]
    for s in range(4):
        try: out.append((s, radiance(events,s)))
        except ValueError: pass
    return out

# ---- fixture builder ----
class Builder:
    def __init__(self, start_dt):
        self.char=[]; self.dt=start_dt; self.pid=0
    def _add(self, name, item_id, rarity, typ):
        self.char.append({"type":typ,"id":str(self.pid),"name":name,
                          "rarity":rarity,"item_id":item_id,
                          "timestamp":self.dt.strftime("%Y-%m-%dT%H:%M:%SZ")})
        self.pid+=1; self.dt+=datetime.timedelta(minutes=3)
    def five(self, kind, date):
        if kind=="F":                                 # filler-only block (no 5★)
            self.dt = datetime.datetime(*date, 12, 0, 0)
            for _ in range(10):
                n,i,r,t = random.choice(FILL3+FILL4); self._add(n,i,r,t)
            return
        self.dt = datetime.datetime(*date, 12, 0, 0)
        pity = random.randint(65,82)
        for _ in range(pity-1):                       # filler pulls set the 5★ pity
            n,i,r,t = random.choice(FILL3+FILL4); self._add(n,i,r,t)
        if kind=="L": name,iid = random.choice(STANDARD)
        else:         name,iid = random.choice(FEATURED)
        self._add(name,iid,5,"character")
    def export(self, uid):
        return {"user":{"gi":{"uids":[{"uid":uid,"verified":True,"private":True,
                "wishes":{"beginner":[],"standard":[],"character":self.char,
                          "weapon":[],"chronicled":[]}}]}}}

# scenario = list of (token, (year,month,day))
SCENARIOS = {
 "full_converges_to_0": [           # pre-5.0 pull + two wins -> counter 0, certain
    ("W",(2024,6,10)), ("W",(2024,9,5)), ("W",(2024,11,2)) ],
 "three_loss_then_CR": [            # win drops to 0, then 3 losses -> guaranteed CR
    ("W",(2024,9,1)),
    ("L",(2024,10,1)),("G",(2024,10,8)),
    ("L",(2024,11,1)),("G",(2024,11,7)),
    ("L",(2024,12,1)),("G",(2024,12,6)),
    ("W",(2025,1,2)) ],            # this win is the CR proc (counter was 3)
 "partial_ambiguous": [            # starts post-5.0, too few events -> needs seed
    ("W",(2025,3,1)), ("L",(2025,4,1)),("G",(2025,4,9)) ],
 "partial_converges": [            # starts post-5.0 but two early wins -> counter 0, certain
    ("W",(2025,3,1)), ("W",(2025,3,20)), ("L",(2025,5,1)),("G",(2025,5,9)) ],
 "boundary_guarantee": [           # loss pre-5.0, its guarantee lands post-5.0
    ("L",(2024,8,20)), ("G",(2024,9,2)), ("W",(2025,1,1)) ],
 "two_CR_cycles": [                # two full 3-loss -> CR cycles, full history
    ("W",(2024,7,1)), ("W",(2024,9,1)),
    ("L",(2024,10,1)),("G",(2024,10,8)),("L",(2024,11,1)),("G",(2024,11,8)),
    ("L",(2024,12,1)),("G",(2024,12,8)),("W",(2025,1,1)),   # CR #1 -> counter 1
    ("W",(2025,2,1)),                                       # -> 0
    ("L",(2025,3,1)),("G",(2025,3,8)),("L",(2025,4,1)),("G",(2025,4,8)),
    ("L",(2025,5,1)),("G",(2025,5,8)),("W",(2025,6,1)) ],   # CR #2 -> counter 1
 "alternating_low": [              # full history, win/loss alternation stays near 0
    ("W",(2024,7,1)),
    ("W",(2024,9,1)),("L",(2024,10,1)),("G",(2024,10,8)),
    ("W",(2024,11,1)),("L",(2024,12,1)),("G",(2024,12,8)),("W",(2025,1,1)) ],
 "loss_pending": [                 # full history ending on a fresh loss (guarantee not yet pulled)
    ("W",(2024,7,1)),("W",(2024,9,1)),("L",(2025,1,1)) ],
 "no_fives": [                     # pulls but no 5★ at all -> nothing to compute
    ("F",(2024,9,1)),("F",(2025,1,1)) ],
 "cr_eligible_c2": [               # reach counter 2, then win a 50/50 -> CR-eligible (non-guaranteed) branch
    ("W",(2024,7,1)),                                       # pre-5.0
    ("L",(2024,9,1)),("G",(2024,9,9)),                     # counter 1->2, then forced guarantee
    ("W",(2024,11,1)) ],                                   # 50/50 win AT counter 2 -> "✦ radiance?"
 "export_charmap_path": [          # written WITHOUT inline name/rarity -> forces CHARMAP[item_id] lookup
    ("W",(2024,7,1)),("W",(2024,9,1)),("W",(2024,11,1)) ],
}
STRIP = {"export_charmap_path"}   # serialize these without name/rarity (item_id-only shape)

os.makedirs(OUT, exist_ok=True)
lines=["# Test fixtures: expected radiance results\n",
       "Load each via the app's **Load JSON** button.\n"]
uid=810000001
for name, toks in SCENARIOS.items():
    b=Builder(datetime.datetime(2024,1,1))
    for tok,date in toks: b.five(tok,date)
    ev=events_from(b.char)                            # label from the full inline rows
    if name in STRIP:                                 # then drop inline name/rarity for the export-shape file
        b.char=[{k:v for k,v in p.items() if k not in ("name","rarity")} for p in b.char]
    json.dump(b.export(uid), open(f"{OUT}/{name}.json","w"))
    earliest=min((e[0] for e in ev), default="-")
    partial = earliest>V50
    if not ev:                                        # no 5★ at all
        verdict = "no character-banner 5★; app shows 'nothing to compute'"
        cov = "n/a"
    elif not partial:                                 # app uses the known start (1) for full history
        verdict = f"counter **{radiance(ev,1)}**, certain (full history)"
        cov = "full (reaches pre-v5.0)"
    else:
        feas=feasible(ev); finals=sorted({c for _,c in feas})
        cov = f"partial (starts {earliest}); feasible starts {[s for s,_ in feas]}"
        verdict = (f"counter **{finals[0]}**, certain (converges)" if len(finals)==1
                   else f"ambiguous - feasible finals {finals}, needs seed or CR-pick")
    lines.append(f"\n## {name}.json  (uid {uid})")
    lines.append(f"- coverage: {cov}")
    lines.append(f"- **expected: {verdict}**")
    uid+=1

# multi-UID export: two accounts in one file -> app should show a UID picker
def mk(seq):
    b=Builder(datetime.datetime(2024,1,1))
    for t,d in seq: b.five(t,d)
    return b.char
def wishes(char): return {"beginner":[],"standard":[],"character":char,"weapon":[],"chronicled":[]}
acc0=mk([("W",(2024,7,1)),("W",(2024,9,1)),("W",(2024,11,1))])                       # counter 0
acc1=mk([("W",(2024,7,1)),("W",(2024,8,30)),                                          # post-5.0 win -> counter 0
         ("L",(2024,10,1)),("G",(2024,10,9)),("L",(2024,11,1)),("G",(2024,11,9)),
         ("L",(2024,12,1)),("G",(2024,12,9)),("W",(2025,1,2))])                       # 3 losses then CR -> 1
multi={"user":{"gi":{"uids":[
  {"uid":820000001,"verified":True,"private":True,"wishes":wishes(acc0)},
  {"uid":820000002,"verified":True,"private":True,"wishes":wishes(acc1)}]}}}
json.dump(multi, open(f"{OUT}/multi_uid.json","w"))
lines.append("\n## multi_uid.json  (uids 820000001, 820000002)")
lines.append("- two accounts in one export -> app shows a **UID picker**")
lines.append("- **expected: 820000001 -> counter 0; 820000002 -> counter 1**")

open(f"{OUT}/EXPECTED.md","w",encoding="utf-8").write("\n".join(lines))
print("wrote", len(SCENARIOS), "fixtures + EXPECTED.md to", OUT+"/")
for f in sorted(os.listdir(OUT)): print("  ", f)
