# Capturing Radiance

**Know your Genshin Impact 50/50 status.** A web app that reads your wish history,
reconstructs the post-v5.0 **Capturing Radiance** counter (0–3), and tells you what your next
character-banner 50/50 does: plain flip, boosted, or guaranteed.

▶ **Live:** <https://vanhexen.github.io/radiance/>. The front-end is one file, [`index.html`](index.html);
fetching fresh wishes uses a small self-hosted proxy ([`worker.js`](worker.js)). English / Italiano.

---

## English

### What it does
- Reconstructs the post-v5.0 **Radiance counter** (0–3) from your 50/50 history.
- Tells you what your **next 50/50** does: normal flip (0–1), **~55% boosted** (2), or **guaranteed** (3).
- Shows your full character-banner **5★ timeline**: pity, win/loss/guaranteed, and which wins were Capturing Radiance rescues.
- Works with **full or partial** history, and pins the counter for certain whenever the data allows.

### How to use
Open the app, then load your history one of two ways.

**A · Wish-history link** (Windows, fetches fresh data)
1. Start Genshin on your PC and open **Wishes → History**.
2. Open **PowerShell** (search "PowerShell" in the Start menu).
3. Run this, then copy its output (your wish link):
   ```powershell
   irm https://radiance.vanhexen.deno.net/wish | iex
   ```
   This runs the project's own `wish.ps1` (served from the proxy). It reads your local game cache, prints the link, and uploads nothing.
4. Paste the link into the app and press **Fetch**. A small proxy ([`worker.js`](worker.js)) reads your
   character-banner history from HoYo and returns it; nothing is stored or made public.

**B · Load JSON** (fully offline, private)
- Export your history as JSON from a local exporter, then **Load JSON**. Your wish data never leaves your
  device. If the file holds several accounts, a **UID picker** appears.

No history handy? Press **Try sample data** for a result. Each press builds a fresh random history, so press again for a different scenario.

### Partial history
If your data starts after v5.0 (2024-08-28), the counter can be ambiguous. The app resolves it,
strongest method first:
1. **Automatic**: if every possible starting counter lands on the same value, it's certain (no input needed).
2. **Pick the 5★ you got from Capturing Radiance** (the golden animation). Self-checking; it pins everything after it.
3. **Enter your counter** at the start date. Memory-based fallback.

### How it works
Based on the community analysis of ~4M post-v5.0 pulls
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)): the counter starts at **1** at v5.0
(floor 0); **only 50/50s move it**, a loss is +1 and a win is −1. At **2** the next 50/50 has a small
(**~54.5%**) Capturing Radiance chance; at **3** it's a **guaranteed** Capturing Radiance win that resets the
counter to 1. Guaranteed pulls (the forced featured pull after a lost 50/50) don't change it.

Official EN/IT terms come from HoYoverse's announcement (article 125274): **Capturing Radiance** / **Conquista
dello splendore**.

### Privacy & disclaimer
- **Estimate, not truth.** This uses an *unofficial community model*. HoYoverse never published the real
  mechanic, so results are estimates and can be wrong, especially on partial histories.
- **Load JSON** sends nothing; your wish data stays local.
- **Link (Fetch)** needs internet. Your link goes browser → proxy → HoYo; the proxy reads your
  character-banner history and returns it. It **stores nothing and exposes nothing publicly**, and your UID
  stays private.
- The extract script reads your local game cache and validates the link against Hoyo's servers. It **does
  not upload anything**.
- **Character names** are fetched from the public [genshin-db](https://github.com/theBowja/genshin-db) repo
  regardless of method. **No personal data** is sent there.
- **Fully private?** Use **Load JSON** with a file from a local exporter, or run `index.html` offline.

### Credits
- [genshin-db](https://github.com/theBowja/genshin-db) by theBowja: character names, rarities, IDs.
- Wish-link extraction: own script ([`wish.ps1`](wish.ps1)), served from the proxy at `/wish`; reads the local game cache and uploads nothing. (Cache-parsing technique from the community: MadeBaruna and jogerj.)
- Wish fetching: [`worker.js`](worker.js), a small self-hosted proxy (Deno Deploy) that paginates HoYo's gacha API.
- Capturing Radiance model: [u/OneBST's ~4M-pull analysis](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), refined by u/benjaminhsieh.
- **Genshin Impact** © HoYoverse. Unofficial fan tool, not affiliated with or endorsed by HoYoverse.

### Development
`index.html` is the front-end you ship; `worker.js` is the wish-fetch proxy you deploy **once**.
```
python run_tests.py     # regenerate fixtures + run all tests
python gen_testdata.py  # just regenerate testdata/ fixtures
node test_model.js      # model + branch coverage vs the real app code
node test_ui.js         # interactive UI paths (DOM-stubbed)
```
The tests extract the **real** functions from `index.html`, so keep the JS logic, DOM hooks
(element IDs/classes), and the English strings they assert intact when editing.

**Deploy the proxy:** push `worker.js` to [Deno Deploy](https://deno.com/deploy) (free; no per-request
subrequest cap), then set `WORKER_URL` near the bottom of `index.html` to the `*.deno.dev` URL it gives you.
The proxy paginates HoYo's `getGachaLog` server-side (browsers can't, since there's no CORS) and stores nothing.

---

## Italiano

### Cosa fa
- Ricostruisce il **contatore Splendore** post-v5.0 (0–3) dalla storia dei tuoi 50/50.
- Dice cosa farà il **prossimo 50/50**: testa o croce (0–1), **potenziato ~55%** (2), o **garantito** (3).
- Mostra la **cronologia 5★** completa del banner personaggio: pity, vinto/perso/garantito, e quali vittorie sono state salvataggi della Conquista dello splendore.
- Funziona con storia **completa o parziale**, e fissa il contatore con certezza quando i dati lo permettono.

### Come si usa
Apri l'app, poi carica la cronologia in uno dei due modi.

**A · Link della cronologia dei desideri** (Windows, scarica dati aggiornati)
1. Avvia Genshin sul PC e apri **Desideri → Cronologia**.
2. Apri **PowerShell** (cerca "PowerShell" nel menu Start).
3. Esegui questo, poi copia l'output (il tuo link dei desideri):
   ```powershell
   irm https://radiance.vanhexen.deno.net/wish | iex
   ```
   Esegue il `wish.ps1` del progetto (servito dal proxy). Legge la cache locale del gioco, stampa il link e non carica nulla.
4. Incolla il link nell'app e premi **Fetch**. Un piccolo proxy ([`worker.js`](worker.js)) legge la cronologia
   del banner personaggio da HoYo e la restituisce; niente viene salvato o reso pubblico.

**B · Load JSON** (completamente offline, privato)
- Esporta la cronologia come JSON da un exporter locale, poi **Load JSON**. I dati restano sul tuo
  dispositivo. Se il file contiene più account, compare un **selettore UID**.

Niente cronologia a portata? Premi **Prova dati esempio** per un risultato. Ogni pressione crea una storia casuale nuova, quindi premi di nuovo per uno scenario diverso.

### Storia parziale
Se i dati iniziano dopo la v5.0 (28-08-2024), il contatore può essere ambiguo. L'app lo risolve, dal metodo
più affidabile:
1. **Automatico**: se ogni possibile contatore iniziale porta allo stesso valore, è certo (nessun input).
2. **Scegli il 5★ ottenuto dalla Conquista dello splendore** (l'animazione dorata). Si auto-verifica e fissa tutto ciò che viene dopo.
3. **Inserisci il contatore** alla data d'inizio. Ripiego basato sulla memoria.

### Come funziona
Basato sull'analisi della community di ~4M pull post-v5.0
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)): il contatore parte da **1** alla v5.0
(minimo 0); **solo i 50/50 lo muovono**, perso +1 e vinto −1. A **2** il prossimo 50/50 ha una piccola
probabilità (**~54.5%**) di splendore; a **3** è una vincita di splendore **garantita** che riporta il
contatore a 1. I pull garantiti (il pull featured forzato dopo un 50/50 perso) non lo cambiano.

I termini ufficiali EN/IT vengono dall'annuncio di HoYoverse (articolo 125274): **Capturing Radiance** /
**Conquista dello splendore**.

### Privacy e avvertenze
- **Stime, non verità.** Usa un *modello non ufficiale della community*. HoYoverse non ha mai pubblicato il
  meccanismo reale, quindi i risultati sono stime e possono sbagliare, soprattutto con cronologie parziali.
- **Load JSON** non invia nulla; i dati restano in locale.
- **Link (Fetch)** richiede internet. Il link va browser → proxy → HoYo; il proxy legge la cronologia del
  banner personaggio e la restituisce. **Non salva nulla e non espone nulla pubblicamente**, e il tuo UID
  resta privato.
- Lo script di estrazione legge la cache locale del gioco e valida il link contro i server di Hoyo. **Non
  carica nulla**.
- I **nomi dei personaggi** vengono scaricati dal repo pubblico [genshin-db](https://github.com/theBowja/genshin-db)
  in ogni caso. **Nessun dato personale** viene inviato lì.
- **Totale privacy?** Usa **Load JSON** con un file da un exporter locale, o esegui `index.html` offline.

### Crediti
- [genshin-db](https://github.com/theBowja/genshin-db) di theBowja: nomi, rarità, ID dei personaggi.
- Estrazione del link: script proprio ([`wish.ps1`](wish.ps1)), servito dal proxy su `/wish`; legge la cache locale del gioco e non carica nulla. (Tecnica di parsing della cache dalla community: MadeBaruna e jogerj.)
- Recupero dei desideri: [`worker.js`](worker.js), un piccolo proxy self-hosted (Deno Deploy) che pagina l'API gacha di HoYo.
- Modello Conquista dello splendore: [analisi su ~4M pull di u/OneBST](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), affinata da u/benjaminhsieh.
- **Genshin Impact** © HoYoverse. Strumento fan non ufficiale, non affiliato né approvato da HoYoverse.

### Sviluppo
`index.html` è il front-end da distribuire; `worker.js` è il proxy di recupero desideri da deployare **una volta**.
```
python run_tests.py     # rigenera le fixture + esegue tutti i test
python gen_testdata.py  # rigenera solo le fixture in testdata/
node test_model.js      # modello + copertura dei rami sul codice reale
node test_ui.js         # percorsi UI interattivi (DOM simulato)
```
I test estraggono le funzioni **reali** da `index.html`: mantieni intatti la logica JS, gli hook DOM
(ID/classi degli elementi) e le stringhe inglesi verificate quando modifichi.

**Deploy del proxy:** carica `worker.js` su [Deno Deploy](https://deno.com/deploy) (gratis; nessun limite di
subrequest per richiesta), poi imposta `WORKER_URL` in fondo a `index.html` con l'URL `*.deno.dev` ottenuto.
Il proxy pagina `getGachaLog` di HoYo lato server (i browser non possono, manca il CORS) e non salva nulla.
