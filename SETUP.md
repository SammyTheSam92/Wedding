# Einrichtung – Hochzeits-Website (Vivi & Sam)

Diese Anleitung beschreibt die 3 Schritte, die nur **du** im Browser erledigen kannst
(alles andere erledigt Claude im Code). Klick dich einfach durch.

---

## 1. Repo öffentlich machen  →  Website geht live

GitHub Pages funktioniert bei kostenlosen Accounts nur mit einem **öffentlichen** Repo.
Sobald das erledigt ist, wird die Seite bei jedem Push automatisch veröffentlicht.

1. Öffne: <https://github.com/SammyTheSam92/Wedding/settings>
2. Ganz nach unten scrollen bis **„Danger Zone"**.
3. Bei **„Change repository visibility"** auf **„Change visibility"** klicken → **„Make public"**.
4. Zur Bestätigung den Repo-Namen `SammyTheSam92/Wedding` eintippen und bestätigen.

> Hinweis: Der Quellcode (inkl. der beiden Fotos) ist danach öffentlich einsehbar.
> Für die Gäste-Seite selbst ist das ohnehin der Fall – der Passwort-Schutz hält nur
> Neugierige & Suchmaschinen fern, ist aber kein echtes Sicherheitsschloss.

**Danach:** Bescheid geben – Claude stößt den Deploy erneut an und nennt dir die Live-URL
(voraussichtlich `https://sammythesam92.github.io/Wedding/`).

---

## 2. RSVP → Google-Tabelle "Hochzeit"

Damit die Rückmeldungen automatisch in einem neuen Reiter **„RSVP"** deiner
bestehenden Tabelle landen:

1. Öffne deine Google-Tabelle **„Hochzeit"**.
2. Menü **Erweiterungen → Apps Script**.
3. Den vorhandenen Beispielcode löschen und den kompletten Inhalt aus
   [`apps-script/Code.gs`](apps-script/Code.gs) einfügen. **Speichern** (Disketten-Symbol).
4. Oben rechts auf **„Bereitstellen" → „Neue Bereitstellung"**.
5. Beim Zahnrad (Typ auswählen) **„Web-App"** wählen. Einstellungen:
   - **Ausführen als:** *Ich* (dein Konto)
   - **Zugriff:** **„Jeder"** (wichtig – sonst kann die Website nicht schreiben)
6. **„Bereitstellen"** klicken. Beim ersten Mal fragt Google nach Berechtigungen
   → **Zugriff zulassen** (ggf. „Erweitert → …(unsicher)" – das ist dein eigenes Script).
7. Google zeigt eine **Web-App-URL** an (endet auf `/exec`). **Diese URL kopieren
   und Claude schicken** – Claude trägt sie in die Website ein.

---

## 3. Eigene Domain `www.vivi-sam.com` (GoDaddy)

Wird gemacht, sobald die Seite unter der `.github.io`-Adresse läuft.
Bei GoDaddy unter **My Products → Domain `vivi-sam.com` → DNS**:

| Typ   | Name | Wert                          |
|-------|------|-------------------------------|
| CNAME | www  | `sammythesam92.github.io`     |
| A     | @    | `185.199.108.153`             |
| A     | @    | `185.199.109.153`             |
| A     | @    | `185.199.110.153`             |
| A     | @    | `185.199.111.153`             |

Danach trägt Claude die Domain im Repo (CNAME-Datei) und in GitHub Pages ein.
DNS-Änderungen können bis zu 24 h dauern.
