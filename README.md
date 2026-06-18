# Capturing Radiance Status

A single-file, offline-friendly tool that reads your Genshin Impact wish history
and tells you your current **Capturing Radiance** counter — and whether your next
character-banner 50/50 is a coin flip, boosted, or a guaranteed win.

> The whole app is **`index.html`**. Open it in any browser. No install.

---

## English

### What it does
- Reconstructs the post-v5.0 Capturing Radiance counter (0–3) from your 50/50 history.
- Tells you what your **next 50/50** does: plain flip (0–1), ~54.5% boosted (2), or guaranteed (3).
- Shows your full character-banner 5★ timeline: pity, win / loss / guaranteed, and which wins were radiance rescues.
- Works with **full or partial** history, and pins the counter for certain whenever possible.

### How to use
Open the app, then pick one of three ways to load your history.

#### 1. Wish-history link — fetches fresh data
1. In Genshin, open **Wishes → History** once. This makes the game write a temporary
   authenticated link into its local cache.
2. Get that link. The easiest vetted way is **[stardb.gg/wish](https://stardb.gg/wish)** — it
   shows the exact command for your platform (e.g. a PowerShell line on PC) and hands you the URL.
3. Copy the link, paste it into the app's box, press **Fetch**. stardb imports your history from
   Hoyo, the app reads it back.
   - The link carries a **read-only authkey** that expires in ~24h, and is sent **only to stardb**.

#### 2. UID — after you've imported at least once
1. Do the link import above once (via this app or stardb.gg/wish). That stores your history on stardb.
2. From then on, just type your **9-digit UID** (shown bottom-right in-game) and press **Fetch**.
   Only the UID is sent — no link, no authkey. Note: it reads whatever was last imported, so re-run
   the link import when you want fresh pulls.

#### 3. Load JSON — fully offline
Export your history as a JSON file from stardb.gg/wish, then **Load JSON**. Your wish data stays on
your machine. If the export holds several accounts, a **UID picker** appears.

### Partial history
If your data starts after v5.0 (2024-08-28), the counter may be ambiguous. The app
resolves it, strongest method first:
1. **Automatic** — if every possible starting counter lands on the same value, it's certain (no input).
2. **Pick the 5★ you got from Capturing Radiance** (the golden animation) — self-checking, pins everything after it.
3. **Enter your counter** at the start date — memory-based fallback.

### Privacy
- **Load JSON** processes your wish data fully on your machine — your wish data never leaves it.
- **Link / UID** fetch goes to **stardb.gg only**, over HTTPS (it already hosts your wish history).
  The wish link's authkey is read-only and expires in ~24h.
- Independently of how you load data, the app fetches **character names** from the public
  [genshin-db](https://github.com/theBowja/genshin-db) repo to stay current — **no personal data is sent** there.

### Disclaimer
- **Unofficial fan tool**, not affiliated with or endorsed by HoYoverse.
- The Capturing Radiance counter comes from an **unofficial community model** — HoYoverse has never
  published the exact mechanic. Results are **estimates, not guarantees**; the model can be wrong,
  especially on partial histories.

### The model
Based on the community analysis of ~4M post-v5.0 pulls
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)):
counter starts at 1 at v5.0, floor 0; **only 50/50s move it** (lose +1, win −1);
at 2 the next 50/50 has a small (~54.5%) radiance chance, at 3 it's a guaranteed
radiance win that resets the counter to 1; guaranteed pulls (after a lost 50/50) don't change it.

### Credits & sources
This tool stands on others' work:
- **[genshin-db](https://github.com/theBowja/genshin-db)** by theBowja — character names, rarities, and IDs (the embedded/auto-updated charmap).
- **[stardb.gg](https://stardb.gg)** — wish-history import and the public API the link/UID fetch uses.
- **Capturing Radiance model** — the community analysis of ~4M post-v5.0 pulls by [u/OneBST](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), refined by u/benjaminhsieh.
- **Soft/hard pity & drop-rate model** — Cgg / [genshin-wishes.com](https://genshin-wishes.com), [HoYoLAB statistical analysis](https://www.hoyolab.com/article/497840).
- **Genshin Impact** © HoYoverse. Game names and data belong to them; this is an unofficial fan tool, not affiliated with or endorsed by HoYoverse.

### Development
```
python run_tests.py     # regenerate fixtures + run all tests
python gen_testdata.py  # just regenerate testdata/ fixtures
node test_model.js      # model + branch coverage vs real app code
node test_ui.js         # interactive UI paths (DOM-stubbed)
```
`index.html` is the only file you ship. Everything else is dev tooling.

---

## Italiano

### Cosa fa
- Ricostruisce il contatore Capturing Radiance post-v5.0 (0–3) dalla storia dei tuoi 50/50.
- Ti dice cosa farà il **prossimo 50/50**: testa o croce (0–1), potenziato ~54.5% (2), o vincita garantita (3).
- Mostra la cronologia completa dei 5★ del banner personaggio: pity, vinto / perso / garantito, e quali vittorie sono state salvataggi radiance.
- Funziona con storia **completa o parziale**, e fissa il contatore con certezza quando possibile.

### Come si usa
Apri l'app, poi scegli uno dei tre modi per caricare la tua cronologia.

#### 1. Link della cronologia wish — scarica dati aggiornati
1. In Genshin, apri **Wish → Cronologia** una volta. Così il gioco scrive un link autenticato
   temporaneo nella sua cache locale.
2. Recupera quel link. Il modo più semplice e verificato è **[stardb.gg/wish](https://stardb.gg/wish)**:
   mostra il comando esatto per la tua piattaforma (es. una riga PowerShell su PC) e ti dà l'URL.
3. Copia il link, incollalo nella casella dell'app, premi **Fetch**. stardb importa la cronologia da
   Hoyo e l'app la rilegge.
   - Il link contiene un **authkey di sola lettura** che scade in ~24h, ed è inviato **solo a stardb**.

#### 2. UID — dopo averlo importato almeno una volta
1. Esegui l'import via link sopra almeno una volta (con questa app o stardb.gg/wish). Così la
   cronologia viene salvata su stardb.
2. Da quel momento, basta scrivere il tuo **UID a 9 cifre** (in basso a destra nel gioco) e premere
   **Fetch**. Viene inviato solo l'UID — nessun link, nessun authkey. Nota: legge l'ultimo import,
   quindi riesegui l'import via link quando vuoi i pull aggiornati.

#### 3. Load JSON — completamente offline
Esporta la cronologia come file JSON da stardb.gg/wish, poi **Load JSON**. I dati dei wish restano sul
tuo dispositivo. Se l'export contiene più account, compare un **selettore UID**.

### Storia parziale
Se i dati iniziano dopo la v5.0 (28-08-2024), il contatore può essere ambiguo. L'app
lo risolve, dal metodo più affidabile:
1. **Automatico** — se ogni possibile contatore iniziale porta allo stesso valore, è certo (nessun input).
2. **Scegli il 5★ ottenuto da Capturing Radiance** (l'animazione dorata) — si auto-verifica e fissa tutto ciò che viene dopo.
3. **Inserisci il contatore** alla data d'inizio — ripiego basato sulla memoria.

### Privacy
- **Load JSON** elabora i dati dei wish interamente sul tuo dispositivo — i dati dei wish non lo lasciano.
- Il fetch da **Link / UID** va **solo a stardb.gg**, via HTTPS (ospita già la tua cronologia).
  L'authkey del link è di sola lettura e scade in ~24h.
- Indipendentemente da come carichi i dati, l'app scarica i **nomi dei personaggi** dal repo pubblico
  [genshin-db](https://github.com/theBowja/genshin-db) per restare aggiornata — **nessun dato personale** viene inviato lì.

### Avvertenze
- **Strumento fan non ufficiale**, non affiliato né approvato da HoYoverse.
- Il contatore Capturing Radiance deriva da un **modello non ufficiale della community** — HoYoverse non
  ha mai pubblicato il meccanismo esatto. I risultati sono **stime, non garanzie**; il modello può
  sbagliare, soprattutto con cronologie parziali.

### Il modello
Basato sull'analisi della community di ~4M pull post-v5.0
([reddit](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/)):
il contatore parte da 1 alla v5.0, minimo 0; **solo i 50/50 lo muovono** (perso +1, vinto −1);
a 2 il prossimo 50/50 ha una piccola probabilità (~54.5%) di radiance, a 3 è una
vincita radiance garantita che riporta il contatore a 1; i pull garantiti (dopo un 50/50 perso) non lo cambiano.

### Crediti e fonti
Questo strumento si basa sul lavoro di altri:
- **[genshin-db](https://github.com/theBowja/genshin-db)** di theBowja — nomi, rarità e ID dei personaggi (la charmap integrata e auto-aggiornata).
- **[stardb.gg](https://stardb.gg)** — import della cronologia wish e l'API pubblica usata dal fetch via link/UID.
- **Modello Capturing Radiance** — l'analisi della community su ~4M pull post-v5.0 di [u/OneBST](https://www.reddit.com/r/Genshin_Impact/comments/1hd1sqa/), affinata da u/benjaminhsieh.
- **Modello soft/hard pity e drop-rate** — Cgg / [genshin-wishes.com](https://genshin-wishes.com), [analisi statistica HoYoLAB](https://www.hoyolab.com/article/497840).
- **Genshin Impact** © HoYoverse. Nomi e dati di gioco appartengono a loro; questo è uno strumento fan non ufficiale, non affiliato né approvato da HoYoverse.

### Sviluppo
```
python run_tests.py     # rigenera le fixture + esegue tutti i test
python gen_testdata.py  # rigenera solo le fixture in testdata/
node test_model.js      # modello + copertura dei rami sul codice reale
node test_ui.js         # percorsi UI interattivi (DOM simulato)
```
`index.html` è l'unico file da distribuire. Tutto il resto è strumentazione di sviluppo.
