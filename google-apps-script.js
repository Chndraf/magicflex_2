/**
 * =========================================================================================
 * GOOGLE APPS SCRIPT UNTUK MAGICFLEX
 * =========================================================================================
 * Pasang skrip ini di Extensions > Apps Script pada Google Spreadsheet Anda.
 *
 * LOGIKA:
 * - Waktu habis (1 menit untuk pengujian) saat siswa AKTIF mengerjakan → data TETAP tersimpan.
 * - Siswa MENUTUP/MENINGGALKAN website lalu buka lagi setelah > 1 menit → data DIHAPUS.
 *   (Frontend mengirim action: "delete" ketika mendeteksi skenario ini)
 * - Jika ada bug dan waktu yang dikirim melebihi batas → data DIHAPUS sebagai proteksi.
 * =========================================================================================
 */

var GAME_DURATION_SECONDS = 60;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    var params = e.parameter || {};
    var action = params.action;
    var nama = (params.nama || "").trim();
    // Samakan nomor absen numerik: "01", "001", dan "1" dianggap sebagai "1".
    var absen = normalizeAbsence(params.absen);
    var skor = params.skor || 0;
    var waktuPengerjaan = params.waktuPengerjaan || "N/A";
    var detailJawaban = [];

    if (params.detailJawaban) {
      try {
        detailJawaban = JSON.parse(params.detailJawaban);
      } catch (err) {}
    }

    if (!nama || !absen) {
      return ContentService.createTextOutput("Error: Nama dan absen wajib diisi.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 1. HAPUS DATA: Ketika siswa menutup website dan kembali setelah batas waktu
    if (action === "delete") {
      deleteRowByNamaAbsen(sheet, nama, absen);
      return ContentService.createTextOutput("Data dihapus karena website ditutup dan waktu melebihi batas 1 menit.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 2. PROTEKSI BUG: Jika waktu pengerjaan yang dikirim melebihi batas permainan
    if (isOverGameDuration(waktuPengerjaan)) {
      deleteRowByNamaAbsen(sheet, nama, absen);
      return ContentService.createTextOutput("Data dihapus: bug terdeteksi, waktu melebihi batas 1 menit.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 3. Cari baris siswa berdasarkan Nama dan No Absen
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (
        String(data[i][1]).trim().toLowerCase() === nama.toLowerCase() &&
        normalizeAbsence(data[i][2]) === absen
      ) {
        rowIndex = i + 1;
        break;
      }
    }

    // 4. Jika belum ada buat baris baru, jika sudah ada update
    if (rowIndex === -1) {
      rowIndex = sheet.getLastRow() + 1;
      sheet.getRange(rowIndex, 1, 1, 5).setValues([[new Date(), nama, absen, skor, waktuPengerjaan]]);
    } else {
      sheet.getRange(rowIndex, 1).setValue(new Date());
      sheet.getRange(rowIndex, 4).setValue(skor);
      sheet.getRange(rowIndex, 5).setValue(waktuPengerjaan);
    }

    // 5. Update detail tiap soal (Percobaan, Status, dan Warna)
    var rowData = [];
    var backgrounds = [];

    for (var j = 0; j < detailJawaban.length; j++) {
      var info = detailJawaban[j];
      if (info.tries > 0) {
        var statusText = info.status === "Benar" ? "Selesai" : "Belum Selesai";
        rowData.push(info.tries + " kali percobaan (" + statusText + ")");
        backgrounds.push(info.status === "Benar" ? "#d9ead3" : "#f4cccc");
      } else {
        rowData.push("-");
        backgrounds.push("#ffffff");
      }
    }

    if (rowData.length > 0) {
      sheet.getRange(rowIndex, 6, 1, rowData.length).setValues([rowData]);
      sheet.getRange(rowIndex, 6, 1, backgrounds.length).setBackgrounds([backgrounds]);
    }

    return ContentService.createTextOutput("Sukses").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Menghapus baris siswa dari Spreadsheet berdasarkan Nama dan No Absen
 */
function deleteRowByNamaAbsen(sheet, nama, absen) {
  var data = sheet.getDataRange().getValues();
  for (var r = data.length - 1; r >= 1; r--) {
    if (
    String(data[r][1]).trim().toLowerCase() === nama.toLowerCase() &&
    normalizeAbsence(data[r][2]) === normalizeAbsence(absen)
    ) {
      sheet.deleteRow(r + 1);
    }
  }
}

/**
 * Menormalkan nomor absen numerik.
 * Contoh: "01", "001", dan 1 semuanya menjadi "1".
 * Nomor absen non-numerik tetap disimpan sebagai teks tanpa spasi di awal/akhir.
 */
function normalizeAbsence(absen) {
  var value = String(absen || "").trim();

  if (/^\d+$/.test(value)) {
    return String(parseInt(value, 10));
  }

  return value;
}

/**
 * Memeriksa apakah waktu pengerjaan melebihi batas permainan.
 * Mendukung format Indonesia dan Inggris yang dikirim dari frontend.
 */
function isOverGameDuration(waktuStr) {
  if (!waktuStr || waktuStr === "N/A") return false;

  var minuteMatch = waktuStr.match(/(\d+)\s*(?:menit|minute)/i);
  var secondMatch = waktuStr.match(/(\d+)\s*(?:detik|second)/i);
  var minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  var seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;
  return minutes * 60 + seconds > GAME_DURATION_SECONDS;
}
