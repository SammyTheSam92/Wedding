/**
 * RSVP-Empfänger für die Hochzeits-Website (Vivi & Sam)
 * -----------------------------------------------------
 * Dieses Script gehört in die bestehende Google-Tabelle "Hochzeit".
 * Es legt automatisch einen Reiter "RSVP" an (falls nicht vorhanden)
 * und schreibt jede Rückmeldung als neue Zeile hinein.
 *
 * Menü ist in Gänge aufgeteilt: Vorspeise + Hauptspeise je Person.
 * Nachspeise ist fix (vegetarisch, für alle) und wird nicht abgefragt.
 *
 * Einrichtung / Update: siehe SETUP.md, Abschnitt 2.
 */

// Feld-Reihenfolge + Spaltenüberschriften. Neue Felder einfach hier ergänzen.
var FIELDS = [
  ['timestamp',        'Zeitstempel'],
  ['attendance',       'Teilnahme'],
  ['guest1_name',      'Name (Du)'],
  ['guest1_starter',   'Vorspeise (Du)'],
  ['guest1_main',      'Hauptspeise (Du)'],
  ['guest1_allergy',   'Allergien (Du)'],
  ['plusone',          'Begleitung?'],
  ['guest2_name',      'Name (Begleitung)'],
  ['guest2_starter',   'Vorspeise (Begleitung)'],
  ['guest2_main',      'Hauptspeise (Begleitung)'],
  ['guest2_allergy',   'Allergien (Begleitung)'],
  ['message',          'Nachricht']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('RSVP');
    if (!sheet) {
      sheet = ss.insertSheet('RSVP');
      sheet.appendRow(FIELDS.map(function (f) { return f[1]; }));
      sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow(FIELDS.map(function (f) { return data[f[0]] || ''; }));
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput('RSVP-Endpoint aktiv.')
    .setMimeType(ContentService.MimeType.TEXT);
}
