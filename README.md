# Capturing Radiance Status

A single-file, offline-friendly tool that reads your Genshin Impact wish history
and tells you your current **Capturing Radiance** counter — and whether your next
character-banner 50/50 is a coin flip, boosted, or a guaranteed win.

> The whole app is **`radiance.html`**. Open it in any browser. No install.

---

## English

### What it does
- Reconstructs the post-v5.0 Capturing Radiance counter (0–3) from your 50/50 history.
- Tells you what your **next 50/50** does: plain flip (0–1), ~54.5% boosted (2), or guaranteed (3).
- Shows your full character-banner 5★ timeline: pity, win / loss / guaranteed, and which wins were radiance rescues.
- Works with **full or partial** history, and pins the counter for certain whenever possible.

### How to use
Open `radiance.html`, then either:
1. **Paste your wish-history link** (from stardb.gg/wish or the in-game export) → **Fetch**.
2. **Type a UID** that's already imported to stardb → **Fetch**.
3. **Load JSON** — a stardb export file, fully offline.

If an export holds several accounts, a **UID picker** appears.

### Partial history
If your data starts after v5.0 (2024-08-28), the counter may be ambiguous. The app
resolves it, strongest method first:
1. **Automatic** — if every possible starting counter lands on the same value, it's certain (no input).
2. **Pick the 5★ you got from Capturing Radiance** (the golden animation) — self-checking, pins everything after it.
3. **Enter your counter** at the start date — memory-based fallback.

### Privacy
- **Load JSON** is fully local — nothing leaves your machine.
- **Link / UID** fetch goes to **stardb.gg only**, over HTTPS (it already hosts your wish history).
  The wish link's authkey is read-only and expires in ~24h.
- Character data auto-updates from the public [genshin-db](https://github.com/theBowja/genshin-db) repo.

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
`radiance.html` is the only file you ship. Everything else is dev tooling.

---

## Italiano

### Cosa fa
- Ricostruisce il contatore Capturing Radiance post-v5.0 (0–3) dalla storia dei tuoi 50/50.
- Ti dice cosa farà il **prossimo 50/50**: testa o croce (0–1), potenziato ~54.5% (2), o vincita garantita (3).
- Mostra la cronologia completa dei 5★ del banner personaggio: pity, vinto / perso / garantito, e quali vittorie sono state salvataggi radiance.
- Funziona con storia **completa o parziale**, e fissa il contatore con certezza quando possibile.

### Come si usa
Apri `radiance.html`, poi:
1. **Incolla il link della cronologia dei wish** (da stardb.gg/wish o l'export in-game) → **Fetch**.
2. **Scrivi un UID** già importato su stardb → **Fetch**.
3. **Load JSON** — un file export di stardb, completamente offline.

Se un export contiene più account, compare un **selettore UID**.

### Storia parziale
Se i dati iniziano dopo la v5.0 (28-08-2024), il contatore può essere ambiguo. L'app
lo risolve, dal metodo più affidabile:
1. **Automatico** — se ogni possibile contatore iniziale porta allo stesso valore, è certo (nessun input).
2. **Scegli il 5★ ottenuto da Capturing Radiance** (l'animazione dorata) — si auto-verifica e fissa tutto ciò che viene dopo.
3. **Inserisci il contatore** alla data d'inizio — ripiego basato sulla memoria.

### Privacy
- **Load JSON** è completamente locale — niente lascia il tuo dispositivo.
- Il fetch da **Link / UID** va **solo a stardb.gg**, via HTTPS (ospita già la tua cronologia).
  L'authkey del link è di sola lettura e scade in ~24h.
- I dati dei personaggi si aggiornano dal repo pubblico [genshin-db](https://github.com/theBowja/genshin-db).

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
`radiance.html` è l'unico file da distribuire. Tutto il resto è strumentazione di sviluppo.
