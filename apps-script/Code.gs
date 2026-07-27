/**
 * RSVP-Empfänger für die Hochzeits-Website (Vivi & Sam)
 * -----------------------------------------------------
 * Dieses Script gehört in die bestehende Google-Tabelle "Hochzeit".
 * Es legt automatisch einen Reiter "RSVP" an (falls nicht vorhanden)
 * und schreibt jede Rückmeldung als neue Zeile hinein.
 *
 * Einrichtung: siehe SETUP.md, Abschnitt 2.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('RSVP');
    var headers = [
      'Zeitstempel', 'Teilnahme',
      'Name (Du)', 'Menü (Du)', 'Allergien (Du)',
      'Begleitung?', 'Name (Begleitung)', 'Menü (Begleitung)', 'Allergien (Begleitung)',
      'Nachricht'
    ];

    if (!sheet) {
      sheet = ss.insertSheet('RSVP');
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date(),
      data.attendance || '',
      data.guest1_name || '',
      data.guest1_menu || '',
      data.guest1_allergy || '',
      data.plusone || '',
      data.guest2_name || '',
      data.guest2_menu || '',
      data.guest2_allergy || '',
      data.message || ''
    ]);

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

// Optionaler Test: im Apps-Script-Editor "doGet" ausführen und die Web-App-URL im Browser öffnen.
function doGet() {
  return ContentService
    .createTextOutput('RSVP-Endpoint aktiv.')
    .setMimeType(ContentService.MimeType.TEXT);
}
