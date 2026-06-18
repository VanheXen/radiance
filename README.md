# Capturing Radiance

**Know your Genshin Impact 50/50 status.** A single-file web app that reads your wish history and
tells you your current **Capturing Radiance** counter — and whether your next character-banner 50/50
is a coin flip, boosted, or a guaranteed win.

▶ **Live:** <https://vanhexen.github.io/radiance/> · the whole app is one file, `index.html`.

---

## English

### What it does
- Reconstructs the post-v5.0 **Capturing Radiance counter** (0–3) from your 50/50 history.
- Tells you what your **next 50/50** does — plain flip (0–1), ~54.5% boosted (2), or guaranteed (3).
- Shows your full character-banner **5★ timeline**: pity, win / loss / guaranteed, and which wins were radiance rescues.
- Works with **full or partial** history, and pins the counter for certain whenever the data allows.

### How to use
Open the app, then load your history one of three ways.

**A · Wish-history link** (Windows — fetches fresh data)
1. Start Genshin on your PC and open **Wishes → History**.
2. Open **PowerShell** (search "PowerShell" in the Start menu).
3. Run this, then copy its output (your wish link):
   ```powershell
   iwr -useb stardb.gg/wish | iex
   ```
4. Paste the link into the app and press **Fetch**. stardb imports your history, the app reads it back.
   - Not on Windows? Use the [stardb-exporter](https://github.com/juliuskreutz/stardb-exporter) or
     [stardb.gg/wish](https://stardb.gg/en/genshin/wish-import).

**B · UID** (after you've imported once)
- Type your **9-digit UID** (bottom-right in-game) and press **Fetch**. Reads what stardb last imported —
  re-run the link import for newer pulls.

**C · Load JSON** (fully offline, private)
- Export your history as JSON (from a local exporter), then **Load JSON**. Your wish data stays on your
  device. If the file holds several accounts, a **UID picker** appears.

### Partial history
If your data starts after v5.0 (2024-08-28), the counter can be ambiguous. The app resolves it,
strongest method first:
1. **Automatic** — if every possible starting counter lands on the same value, it's certain (no input).
2. **Pick the 5★ you got from Capturing Radiance** (the golden animation) — self-checking; pins everything after it.
3. **Enter your counter** at the start date — memory-based fallback.

### How it works
Based on the community analysis of ~4M post-v5.0 pulls
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)): the counter starts at 1 at v5.0
(floor 0); **only 50/50s move it** (lose +1, win −1). At 2 the next 50/50 has a small (~54.5%) radiance
chance; at 3 it's a guaranteed radiance win that resets the counter to 1. Guaranteed pulls (after a lost
50/50) don't change it.

### Privacy & disclaimer
- **Estimate, not truth.** This uses an *unofficial community model* — HoYoverse never published the
  real mechanic. Results are estimates and can be wrong, especially on partial histories.
- **Load JSON** sends nothing; your wish data stays local.
- **Link / UID** need internet and go through **stardb.gg**. Submitting a link **imports your history to
  stardb, making it publicly readable by anyone who knows your UID** (stardb's policy). stardb's *private*
  toggle does **not** hide the wish API — only deleting your wishes on stardb does.
- The extract script (`stardb.gg/wish` / stardb-exporter) is safe by itself: it reads your local game
  cache and validates the link against Hoyo's servers — it **does not upload anything**. Exposure happens
  only when you give the link to stardb.
- **Character names** are fetched from the public [genshin-db](https://github.com/theBowja/genshin-db)
  repo regardless of method — **no personal data** is sent there.
- **Fully private?** Use **Load JSON** with a file from a local exporter, or run `index.html` offline.

### Credits
- [genshin-db](https://github.com/theBowja/genshin-db) by theBowja — character names, rarities, IDs.
- [stardb.gg](https://stardb.gg) — wish import and the public API used by link/UID fetch.
- Capturing Radiance model — [u/OneBST's ~4M-pull analysis](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), refined by u/benjaminhsieh.
- Soft/hard pity & drop-rate model — Cgg / [genshin-wishes.com](https://genshin-wishes.com), [HoYoLAB analysis](https://www.hoyolab.com/article/497840).
- **Genshin Impact** © HoYoverse. Unofficial fan tool, not affiliated with or endorsed by HoYoverse.

### Development
`index.html` is the only file you ship — everything else is dev tooling.
```
python run_tests.py     # regenerate fixtures + run all tests
python gen_testdata.py  # just regenerate testdata/ fixtures
node test_model.js      # model + branch coverage vs the real app code
node test_ui.js         # interactive UI paths (DOM-stubbed)
```

---

## Italiano

### Cosa fa
- Ricostruisce il **contatore Capturing Radiance** post-v5.0 (0–3) dalla storia dei tuoi 50/50.
- Dice cosa farà il **prossimo 50/50** — testa o croce (0–1), potenziato ~54.5% (2), o garantito (3).
- Mostra la **cronologia 5★** completa del banner personaggio: pity, vinto / perso / garantito, e quali vittorie sono state salvataggi radiance.
- Funziona con storia **completa o parziale**, e fissa il contatore con certezza quando i dati lo permettono.

### Come si usa
Apri l'app, poi carica la cronologia in uno dei tre modi.

**A · Link della cronologia wish** (Windows — scarica dati aggiornati)
1. Avvia Genshin sul PC e apri **Wish → Cronologia**.
2. Apri **PowerShell** (cerca "PowerShell" nel menu Start).
3. Esegui questo, poi copia l'output (il tuo link wish):
   ```powershell
   iwr -useb stardb.gg/wish | iex
   ```
4. Incolla il link nell'app e premi **Fetch**. stardb importa la cronologia e l'app la rilegge.
   - Non sei su Windows? Usa [stardb-exporter](https://github.com/juliuskreutz/stardb-exporter) o
     [stardb.gg/wish](https://stardb.gg/en/genshin/wish-import).

**B · UID** (dopo aver importato almeno una volta)
- Scrivi il tuo **UID a 9 cifre** (in basso a destra nel gioco) e premi **Fetch**. Legge l'ultimo import su
  stardb — riesegui l'import via link per pull più recenti.

**C · Load JSON** (completamente offline, privato)
- Esporta la cronologia come JSON (da un exporter locale), poi **Load JSON**. I dati restano sul tuo
  dispositivo. Se il file contiene più account, compare un **selettore UID**.

### Storia parziale
Se i dati iniziano dopo la v5.0 (28-08-2024), il contatore può essere ambiguo. L'app lo risolve, dal metodo
più affidabile:
1. **Automatico** — se ogni possibile contatore iniziale porta allo stesso valore, è certo (nessun input).
2. **Scegli il 5★ ottenuto da Capturing Radiance** (l'animazione dorata) — si auto-verifica; fissa tutto ciò che viene dopo.
3. **Inserisci il contatore** alla data d'inizio — ripiego basato sulla memoria.

### Come funziona
Basato sull'analisi della community di ~4M pull post-v5.0
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)): il contatore parte da 1 alla v5.0
(minimo 0); **solo i 50/50 lo muovono** (perso +1, vinto −1). A 2 il prossimo 50/50 ha una piccola
probabilità (~54.5%) di radiance; a 3 è una vincita radiance garantita che riporta il contatore a 1. I
pull garantiti (dopo un 50/50 perso) non lo cambiano.

### Privacy e avvertenze
- **Stime, non verità.** Usa un *modello non ufficiale della community* — HoYoverse non ha mai pubblicato
  il meccanismo reale. I risultati sono stime e possono sbagliare, soprattutto con cronologie parziali.
- **Load JSON** non invia nulla; i dati restano in locale.
- **Link / UID** richiedono internet e passano da **stardb.gg**. Inviare un link **importa la cronologia
  su stardb, rendendola leggibile pubblicamente da chiunque conosca il tuo UID** (policy di stardb). Il
  toggle *private* di stardb **non** nasconde l'API dei wish — solo cancellare i wish su stardb lo fa.
- Lo script di estrazione (`stardb.gg/wish` / stardb-exporter) è sicuro di per sé: legge la cache locale del
  gioco e valida il link contro i server di Hoyo — **non carica nulla**. L'esposizione avviene solo quando
  dai il link a stardb.
- I **nomi dei personaggi** vengono scaricati dal repo pubblico [genshin-db](https://github.com/theBowja/genshin-db)
  in ogni caso — **nessun dato personale** viene inviato lì.
- **Totale privacy?** Usa **Load JSON** con un file da un exporter locale, o esegui `index.html` offline.

### Crediti
- [genshin-db](https://github.com/theBowja/genshin-db) di theBowja — nomi, rarità, ID dei personaggi.
- [stardb.gg](https://stardb.gg) — import dei wish e l'API pubblica usata dal fetch via link/UID.
- Modello Capturing Radiance — [analisi su ~4M pull di u/OneBST](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), affinata da u/benjaminhsieh.
- Modello soft/hard pity e drop-rate — Cgg / [genshin-wishes.com](https://genshin-wishes.com), [analisi HoYoLAB](https://www.hoyolab.com/article/497840).
- **Genshin Impact** © HoYoverse. Strumento fan non ufficiale, non affiliato né approvato da HoYoverse.

### Sviluppo
`index.html` è l'unico file da distribuire — tutto il resto è strumentazione di sviluppo.
```
python run_tests.py     # rigenera le fixture + esegue tutti i test
python gen_testdata.py  # rigenera solo le fixture in testdata/
node test_model.js      # modello + copertura dei rami sul codice reale
node test_ui.js         # percorsi UI interattivi (DOM simulato)
```
