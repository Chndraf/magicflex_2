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
    var sessionId = params.sessionId || "";  // Session ID dari frontend
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

    // 1. TIDAK LAGI MENGHAPUS DATA: Simpan data dengan penanda meninggalkan permainan
    if (action === "delete") {
      // Action delete tidak lagi digunakan, tapi tetap dikembalikan sukses untuk kompatibilitas
      return ContentService.createTextOutput("Data dipertahankan dengan penanda meninggalkan permainan.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 2. PROTEKSI BUG: Jika waktu pengerjaan yang dikirim melebihi batas permainan
    if (isOverGameDuration(waktuPengerjaan)) {
      return ContentService.createTextOutput("Data ditolak: waktu melebihi batas 1 menit.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 3. Cari baris dengan sessionId yang sama (update sesi yang sedang berjalan)
    var rowIndex = -1;
    
    if (sessionId) {
      // Cari baris dengan sessionId yang sama
      for (var i = 1; i < data.length; i++) {
        var existingSessionId = String(data[i][30] || "");  // Kolom 31 (index 30) untuk sessionId
        if (existingSessionId === sessionId) {
          rowIndex = i + 1;
          break;
        }
      }
    }

    // 4. Jika tidak ketemu (sesi baru), buat baris baru
    if (rowIndex === -1) {
      rowIndex = sheet.getLastRow() + 1;
      sheet.getRange(rowIndex, 1, 1, 5).setValues([[new Date(), nama, absen, skor, waktuPengerjaan]]);
      // Simpan sessionId di kolom 31 (hidden column untuk internal tracking)
      sheet.getRange(rowIndex, 31).setValue(sessionId);
    } else {
      // Update baris yang sudah ada (sesi yang sama) dalam satu batch
      sheet.getRange(rowIndex, 1, 1, 5).setValues([[new Date(), nama, absen, skor, waktuPengerjaan]]);
    }
    
    // 5. Jika ada penanda "siswa meninggalkan permainan", set warna merah pada kolom waktu
    if (waktuPengerjaan.indexOf("siswa meninggalkan permainan") !== -1) {
      sheet.getRange(rowIndex, 5).setFontColor("#ff0000");
    } else {
      sheet.getRange(rowIndex, 5).setFontColor("#000000");
    }

    // 6. Update detail tiap soal (Percobaan, Status, dan Warna)
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

/**
 * Convert waktu pengerjaan string ke detik untuk perbandingan.
 * Format: "X menit Y detik" atau "X minute(s) Y second(s)"
 */
function parseWaktuToSeconds(waktuStr) {
  if (!waktuStr || waktuStr === "N/A") return 0;
  
  var minuteMatch = waktuStr.match(/(\d+)\s*(?:menit|minute)/i);
  var secondMatch = waktuStr.match(/(\d+)\s*(?:detik|second)/i);
  var minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  var seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;
  return minutes * 60 + seconds;
}
