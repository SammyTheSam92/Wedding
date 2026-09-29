# Wedding — Vivi & Sam (08.10.2026)

> ⚠️ **Der eigentliche Website-Code liegt NICHT auf `main`.**

Diese Hochzeits-Website wird von GitHub Pages **direkt aus dem Arbeits-Branch**
veröffentlicht, nicht aus `main`. `main` enthält bewusst nur diese Wegweiser-README.

## Wo ist der Code?

Alles (die komplette `index.html`, `fonts/`, `assets/`, `apps-script/`, `firebase/`,
`CNAME`, `SETUP.md` …) liegt auf dem Branch:

```
claude/wedding-website-rebuild-wup7kv
```

## In einer neuen Session den Code holen

Wenn dein Arbeitsordner „leer" wirkt (nur diese README), hol den echten Stand so:

```bash
git fetch origin claude/wedding-website-rebuild-wup7kv
git checkout claude/wedding-website-rebuild-wup7kv
```

Falls die Dateien danach immer noch fehlen (Container-Reset — Branch gesetzt, aber
Working-Tree leer), erzwinge den Abgleich mit dem Remote-Stand:

```bash
git reset --hard origin/claude/wedding-website-rebuild-wup7kv
```

Beim **Anlegen** einer neuen Session auf claude.ai/code: als Branch/Source direkt
`claude/wedding-website-rebuild-wup7kv` auswählen (nicht `main`).

## Wichtig

- **Nicht** einfach `main` als Pages-Quelle einstellen oder blind mergen — GitHub Pages
  deployt aus dem Arbeits-Branch, und die Domain (`www.vivi-sam.com`) kommt aus der
  `CNAME`-Datei dort. Ein unbedachter Umbau kann die Live-Seite oder die RSVP-Anbindung
  stören.
- Einrichtung/Betrieb ist in **`SETUP.md`** (auf dem Arbeits-Branch) beschrieben,
  Architektur-Notizen in **`CLAUDE.md`**.
