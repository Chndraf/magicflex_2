var translations = {
  id: {
    pageTitle: "MagicFlex - Kuasai CSS Flexbox",
    navHome: "Kembali ke Beranda",
    languageLabel: "Bahasa",
    level: "Level",
    mission: "Misi",
    of: "dari",
    editorTitle: "Editor Buku Sihir",
    reset: "Atur Ulang",
    clearCode: "Atur Ulang",
    restartGame: "Mulai Permainan Baru",
    runCode: "Jalankan Sihir",
    codePlaceholder: "ketik kode di sini...",
    nextQuestion: "Soal Berikutnya",
    finish: "Selesai",
    clearCodeTitle: "Hapus Kode?",
    clearCodeText: "Apakah Anda yakin ingin menghapus kode di soal ini? Anda tidak akan kembali ke soal pertama.",
    confirmClear: "Ya, Hapus",
    codeCleared: "Kode Berhasil Dihapus",
    codeClearedText: "Kode di soal ini telah dihapus. Anda bisa menulis ulang dari awal.",
    welcomeTitle: "Selamat Datang!",
    namePlaceholder: "Masukkan nama Anda",
    absencePlaceholder: "Masukkan nomor absen Anda",
    namePrompt: "Masukkan nama Anda:",
    absencePrompt: "Masukkan nomor absen Anda:",
    startGame: "Mulai Game",
    nameAbsenceRequired: "Nama dan nomor absen wajib diisi!",
    resetWarningTitle: "Peringatan",
    resetWarningText: "Apakah Anda yakin ingin mengatur ulang game?\n\nProgres tersimpan Anda akan hilang dan Anda akan kembali ke awal game.",
    confirmReset: "Ya, Atur Ulang!",
    cancel: "Batal",
    correctTitle: "✨ Jawaban Benar!",
    correctText: "Hebat! Kode CSS kamu sudah tepat. Melanjutkan ke soal berikutnya...",
    incorrectTitle: "Jawaban Salah!",
    incorrectDefault: "Kode CSS kamu belum menghasilkan posisi yang tepat. Coba periksa kembali nilai propertinya.",
    issuesFound: "Ditemukan",
    issuesSuffix: "masalah pada kode kamu:",
    hint: "Petunjuk:",
    tryAdding: "Coba tambahkan:",
    missingColon: "tidak memiliki tanda titik dua (:).",
    missingSemicolon: "kurang tanda titik koma (;) di akhir.",
    propertyMissing: "belum ditulis. Kamu perlu menambahkan properti ini.",
    valueTypo: "nilainya sepertinya salah ketik. Periksa kembali ejaannya!",
    valueIncorrect: "nilainya tidak tepat. Coba nilai yang lain.",
    propertyNotNeeded: "tidak diperlukan untuk soal ini.",
    propertyTypo: "sepertinya salah ketik. Mungkin maksudnya",
    invalidProperty: "tidak dikenali sebagai properti CSS yang valid.",
    resultTitle: "Hasil Kuis",
    performanceExcellent: "Luar Biasa!",
    performanceVeryGood: "Sangat Baik!",
    performanceGood: "Baik!",
    performanceFair: "Cukup Baik!",
    performanceKeepTrying: "Tetap Semangat!",
    yourScore: "Skor kamu:",
    aiLearningAdvice: "Saran Pembelajaran AI",
    aiNextStepsTitle: "Langkah Belajar Selanjutnya",
    getAiFeedback: "Dapatkan Masukan dari Gemini AI ✨",
    playerName: "Nama Siswa:",
    absenceNumber: "Nomor Absen:",
    finalScore: "Skor Akhir",
    totalQuestions: "Total Soal",
    correctAnswers: "Jawaban Benar",
    wrongAnswers: "Belum Dijawab",
    correctQuestions: "Soal Benar",
    wrongQuestions: "Soal Belum Dijawab",
    noCorrectAnswers: "Belum ada jawaban benar",
    allQuestionsCorrect: "Semua soal dijawab dengan benar!",
    playAgain: "Main Lagi",
    backToHome: "← Kembali ke Beranda",
    gameAlreadyCompleted: "🎉 Permainan Sudah Selesai!",
    gameAlreadyCompletedText: "Kamu sudah menyelesaikan permainan ini. Data kamu sudah tersimpan. Ingin main lagi atau kembali ke beranda?",
    shareToWhatsApp: "Bagikan ke WhatsApp",
    sendingAiFeedback: "Mengirim data ke AI dan menganalisis hasilmu...",
    aiResponseError: "Gagal mengambil respons dari AI.",
    aiInvalidServerResponse: "Server AI mengembalikan respons yang tidak valid. Periksa Vercel Function Logs.",
    aiEndpointError: "Endpoint AI gagal diproses",
    aiEmptyResponse: "AI tidak mengembalikan saran pembelajaran.",
    aiErrorTitle: "Kesalahan:",
    tryAgain: "Coba Lagi",
    propertyTypoDetected: "Kemungkinan typo pada properti",
    durationFormat: "{minutes} menit {seconds} detik",
    timeoutTitle: "Sesi Berakhir!",
    timeoutText: '<p style="font-size:1em;">Waktu permainan telah mencapai batas <strong>30 menit</strong> karena halaman ditutup atau ditinggalkan.</p><p style="font-size:0.9em;color:#ef4444;margin-top:8px;">Data kamu tetap tersimpan dengan penanda <strong>"siswa meninggalkan permainan"</strong>.</p>',
    timeoutFallback: "Sesi berakhir! Waktu permainan telah mencapai batas 30 menit. Data kamu tersimpan dengan penanda meninggalkan permainan.",
    restart: "Mulai Ulang",
    cannotAdvanceTitle: "Belum Bisa Lanjut",
    cannotAdvanceText: '<p style="font-size:0.95em;">Kamu harus <strong>menyelesaikan soal saat ini</strong> terlebih dahulu sebelum bisa pindah ke soal lain.</p>',
    aiPrompt: function (quizData) {
      var r = summarizeQuizForAI(quizData);
      var sulit = r.hard.map(function (d) {
        return d.soal + " (" + (d.solved ? "selesai tetapi membutuhkan " + d.percobaan + " percobaan" : "belum selesai, " + d.percobaan + " percobaan") + "; jawaban siswa: " + d.jawabanSiswa + "; jawaban benar: " + d.jawabanBenar + ")";
      }).join("\n") || "(tidak ada)";
      return "Kamu adalah guru CSS Flexbox. Seorang siswa pemula baru menyelesaikan game MagicFlex. Tugasmu menulis materi yang perlu dipelajari siswa, dengan gaya penulisan bahan ajar di sekolah. Kalimat pembuka tentang capaian siswa sudah dibuat oleh sistem, jadi JANGAN menulis kalimat pembuka atau menilai penguasaan siswa.\n\n" +
        "DATA SISWA:\n" +
        "- Skor: " + quizData.score + "% (" + quizData.correctAnswers + " dari " + r.total + " soal selesai)\n" +
        "- Soal yang terasa sulit (sudah dicoba tetapi membutuhkan banyak percobaan atau belum selesai):\n" + sulit + "\n" +
        "- Soal yang belum dicoba: " + r.untouched.length + " soal\n\n" +
        "MATERI YANG PERLU DIJELASKAN (tiap materi diberi label):\n" + flexNotesForAI(r, "id") + "\n\n" +
        "ATURAN BAHASA:\n" +
        "- Gunakan bahasa Indonesia baku dan formal seperti bahan ajar di sekolah. Kalimat jelas dan ringkas (maksimal 20 kata).\n" +
        "- Sapa siswa dengan \"kamu\". Jangan memakai bahasa gaul, seruan, emoji, atau kalimat yang terlalu santai.\n" +
        "- Jangan memakai perumpamaan atau kiasan (misalnya bola menari, portal, meja), slogan, atau kutipan hiasan. Jelaskan langsung dan faktual.\n" +
        "- Istilah teknis seperti sumbu utama dan sumbu silang dijelaskan dalam satu kalimat saat pertama muncul.\n" +
        "- Tulis nama properti dan nilai CSS dengan tanda backtick tunggal. DILARANG memakai blok kode (```). Tulis contoh kode di dalam kalimat.\n\n" +
        "ATURAN ISI:\n" +
        "- Jelaskan semua materi dalam daftar di atas, sesuai urutannya, satu butir per materi. Gunakan hanya informasi dari daftar itu. Jangan membuat butir untuk properti yang tidak ada dalam daftar.\n" +
        "- Jangan menyatakan siswa sudah atau belum menguasai suatu properti, kecuali lewat label di bawah.\n" +
        "- Untuk tiap materi tulis: (1) pengertian dan fungsinya, (2) dua atau tiga nilai yang sering dipakai, (3) satu contoh penerapan beserta hasilnya, misalnya: Contoh: `justify-content: center;` menempatkan item di tengah sumbu utama.\n" +
        "- Jangan memberi tugas seperti \"kerjakan soal Q6\". Nomor soal boleh disebut hanya untuk menunjuk soal yang terasa sulit.\n" +
        "- Label [belum dikerjakan]: siswa belum mengerjakan soal yang memakai properti ini. Tulis bahwa materi ini akan dipelajari pada soal berikutnya. BUKAN kelemahan, jangan menyebut siswa lemah atau bingung.\n" +
        "- Label [perlu diulang]: siswa membutuhkan beberapa kali percobaan pada soal yang memakai properti ini. Tulis bahwa materi ini perlu diulang, boleh menyebut nomor soalnya.\n\n" +
        "FORMAT JAWABAN (ikuti persis, mulai langsung dari judul pertama, tanpa kalimat pembuka, tanpa judul lain, tanpa tabel):\n" +
        "**Materi yang perlu dipelajari**\n" +
        "1. **`nama-properti`**: pengertian, nilai yang sering dipakai, dan contoh penerapan.\n" +
        "2. **`nama-properti`**: pengertian, nilai yang sering dipakai, dan contoh penerapan.\n" +
        "3. **`nama-properti`**: pengertian, nilai yang sering dipakai, dan contoh penerapan. (sesuaikan jumlah butir dengan jumlah materi)\n\n" +
        "**Ringkasan**\n" +
        "Satu kalimat yang menghubungkan materi di atas. Sebut hanya properti yang ada dalam daftar materi. Jangan memakai slogan atau tanda kutip.\n\n" +
        "Total maksimal 150 kata, bahasa Indonesia. Selesaikan semua kalimat sampai tuntas. Jangan merekomendasikan situs lain.";
    },
    // Materi Pembelajaran Section
    materiTitle: "Materi Pembelajaran",
    materiSubtitle: "Kuasai konsep-konsep Flexbox melalui penjelasan praktis dan interaktif",
    startLearning: "Mulai Belajar",
    // Card Descriptions
    justifyContentDesc: "Mengatur perataan item secara horizontal di sepanjang main axis container.",
    alignItemsDesc: "Menentukan perataan item secara vertikal pada cross axis container.",
    flexDirectionDesc: "Mengatur arah susunan item dalam container (baris atau kolom).",
    flexWrapDesc: "Menentukan apakah item akan dibungkus ke baris baru jika ruang tidak cukup.",
    alignSelfDesc: "Mengubah perataan item individual, mengabaikan nilai align-items.",
    flexDesc: "Mengatur fleksibilitas item untuk tumbuh atau menyusut dalam container.",
    alignContentDesc: "Mengatur posisi beberapa baris item pada cross axis saat multi-baris.",
    orderDesc: "Mengubah urutan visual item tanpa mengubah struktur HTML."
  },
  en: {
    pageTitle: "MagicFlex - Master CSS Flexbox",
    navHome: "Back to Home",
    languageLabel: "Language",
    level: "Level",
    mission: "Mission",
    of: "of",
    editorTitle: "Spellbook Editor",
    reset: "Reset",
    clearCode: "Clear Code",
    restartGame: "Start New Game",
    runCode: "Cast Spell",
    codePlaceholder: "type your code here...",
    nextQuestion: "Next Question",
    finish: "Finish",
    clearCodeTitle: "Clear Code?",
    clearCodeText: "Are you sure you want to clear the code for this question? You will not return to the first question.",
    confirmClear: "Yes, Clear",
    codeCleared: "Code Cleared Successfully",
    codeClearedText: "The code for this question has been cleared. You can write it again from scratch.",
    welcomeTitle: "Welcome!",
    namePlaceholder: "Enter your name",
    absencePlaceholder: "Enter your attendance number",
    namePrompt: "Enter your name:",
    absencePrompt: "Enter your attendance number:",
    startGame: "Start Game",
    nameAbsenceRequired: "Name and attendance number are required!",
    resetWarningTitle: "Warning",
    resetWarningText: "Are you sure you want to reset the game?\n\nYour saved progress will be lost and you will return to the start of the game.",
    confirmReset: "Yes, Reset!",
    cancel: "Cancel",
    correctTitle: "✨ Correct Answer!",
    correctText: "Great! Your CSS code is correct. Moving to the next question...",
    incorrectTitle: "❌ Incorrect Answer!",
    incorrectDefault: "Your CSS code has not produced the correct position yet. Check the property values again.",
    issuesFound: "Found",
    issuesSuffix: "issues in your code:",
    hint: "Hint:",
    tryAdding: "Try adding:",
    missingColon: "does not contain a colon (:).",
    missingSemicolon: "is missing a semicolon (;) at the end.",
    propertyMissing: "has not been written. Add this property.",
    valueTypo: "seems to contain a typo. Check the spelling again!",
    valueIncorrect: "has an incorrect value. Try another value.",
    propertyNotNeeded: "is not needed for this question.",
    propertyTypo: "seems to contain a typo. Did you mean",
    invalidProperty: "is not recognized as a valid CSS property.",
    resultTitle: "Quiz Results",
    performanceExcellent: "Excellent!",
    performanceVeryGood: "Very Good!",
    performanceGood: "Good!",
    performanceFair: "Fair",
    performanceKeepTrying: "Keep Trying!",
    yourScore: "Your score:",
    aiLearningAdvice: "AI Learning Advice",
    aiNextStepsTitle: "Your Next Learning Steps",
    getAiFeedback: "Get Feedback from Gemini AI ✨",
    playerName: "Student Name:",
    absenceNumber: "Attendance Number:",
    finalScore: "Final Score",
    totalQuestions: "Total Questions",
    correctAnswers: "Correct Answers",
    wrongAnswers: "Incorrect Answers",
    correctQuestions: "Correct Questions",
    wrongQuestions: "Incorrect Questions",
    noCorrectAnswers: "No correct answers yet",
    allQuestionsCorrect: "All questions answered correctly!",
    playAgain: "Play Again",
    backToHome: "← Back to Home",
    gameAlreadyCompleted: "🎉 Game Already Completed!",
    gameAlreadyCompletedText: "You have already completed this game. Your data has been saved. Would you like to play again or return to the home page?",
    shareToWhatsApp: "Share to WhatsApp",
    sendingAiFeedback: "Sending your data to AI and analyzing your results...",
    aiResponseError: "Failed to get a response from AI.",
    aiInvalidServerResponse: "The AI server returned an invalid response. Check the Vercel Function Logs.",
    aiEndpointError: "The AI endpoint could not process the request",
    aiEmptyResponse: "The AI did not return learning feedback.",
    aiErrorTitle: "Error:",
    tryAgain: "Try Again",
    propertyTypoDetected: "Possible typo in property",
    durationFormat: "{minutes} minute(s) {seconds} second(s)",
    timeoutTitle: "Session Ended!",
    timeoutText: '<p style="font-size:1em;">The game reached its <strong>30-minute</strong> limit because the page was closed or left.</p><p style="font-size:0.9em;color:#ef4444;margin-top:8px;">Your data is saved with the marker <strong>"student left the game"</strong>.</p>',
    timeoutFallback: "Session ended! The game reached its 30-minute limit. Your data is saved with the leaving marker.",
    restart: "Restart",
    cannotAdvanceTitle: "Cannot Continue Yet",
    cannotAdvanceText: '<p style="font-size:0.95em;">You must <strong>complete the current question</strong> before moving to another question.</p>',
    aiPrompt: function (quizData) {
      var r = summarizeQuizForAI(quizData);
      var hard = r.hard.map(function (d) {
        return d.soal + " (" + (d.solved ? "solved but needed " + d.percobaan + " attempts" : "not solved, " + d.percobaan + " attempts") + "; student answer: " + d.jawabanSiswa + "; correct: " + d.jawabanBenar + ")";
      }).join("\n") || "(none)";
      return "You are a CSS Flexbox teacher. A beginner student just finished the MagicFlex game. Write the topics the student should study, in the style of school learning material. The opening sentence about the student's progress is already written by the system, so DO NOT write an opening sentence or judge the student's mastery.\n\n" +
        "STUDENT DATA:\n" +
        "- Score: " + quizData.score + "% (" + quizData.correctAnswers + " of " + r.total + " questions completed)\n" +
        "- Questions that felt hard (tried but needed many attempts or not solved):\n" + hard + "\n" +
        "- Questions not attempted yet: " + r.untouched.length + "\n\n" +
        "TOPICS TO EXPLAIN (each topic has a label):\n" + flexNotesForAI(r, "en") + "\n\n" +
        "LANGUAGE RULES:\n" +
        "- Use formal, textbook-style English. Clear, concise sentences (max 20 words).\n" +
        "- Address the student as \"you\". No slang, exclamations, emojis, or overly casual phrasing.\n" +
        "- No analogies or metaphors (e.g. dancing balls, portals, tables), slogans, or decorative quotes. Explain directly and factually.\n" +
        "- Explain technical terms such as main axis and cross axis in one sentence when first mentioned.\n" +
        "- Wrap CSS property names and values in single backticks. NEVER use code blocks (```). Put code examples inside sentences.\n\n" +
        "CONTENT RULES:\n" +
        "- Explain every topic in the list above, in order, one item per topic. Use only the information in that list. Do not create items for properties that are not in the list.\n" +
        "- Do not state that the student has or has not mastered a property, except through the labels below.\n" +
        "- For each topic write: (1) the definition and purpose, (2) two or three commonly used values, (3) one example with its result, e.g. Example: `justify-content: center;` places items at the center of the main axis.\n" +
        "- Do not assign tasks like \"do question Q6\". Mention a question number only to point at one that felt hard.\n" +
        "- Label [not attempted yet]: the student has not done a question using this property. Say it will be covered in later questions. NOT a weakness, never call the student weak or confused.\n" +
        "- Label [needs review]: the student needed several attempts on a question using this property. Say it needs review; you may mention the question number.\n\n" +
        "ANSWER FORMAT (follow exactly, start directly with the first heading, no opening sentence, no other headings, no tables):\n" +
        "**Topics to study**\n" +
        "1. **`property-name`**: definition, common values, and an example.\n" +
        "2. **`property-name`**: definition, common values, and an example.\n" +
        "3. **`property-name`**: definition, common values, and an example. (match the number of items to the number of topics)\n\n" +
        "**Summary**\n" +
        "One sentence that connects the topics above. Mention only properties that are in the topic list. No slogans or quotation marks.\n\n" +
        "Max 150 words total, in English. Finish every sentence. Do not recommend other websites.";
    },
    // Learning Materials Section
    materiTitle: "Learning Materials",
    materiSubtitle: "Master Flexbox concepts through practical and interactive explanations",
    startLearning: "Start Learning",
    // Card Descriptions
    justifyContentDesc: "Aligns items horizontally along the main axis of the container.",
    alignItemsDesc: "Determines vertical alignment of items along the cross axis of the container.",
    flexDirectionDesc: "Sets the direction of item arrangement in the container (row or column).",
    flexWrapDesc: "Determines whether items will wrap to a new line when space is insufficient.",
    alignSelfDesc: "Changes alignment of individual items, overriding the align-items value.",
    flexDesc: "Sets the flexibility of items to grow or shrink within the container.",
    alignContentDesc: "Aligns multiple lines of items on the cross axis when multi-line.",
    orderDesc: "Changes the visual order of items without modifying the HTML structure."
  },
};

// Urutan materi mengikuti urutan soal di game (dari yang paling dasar).
var FLEX_ORDER = ["justify-content", "align-items", "flex-direction", "order", "align-self", "flex-wrap", "flex-flow", "align-content"];

// Bahan ajar singkat per properti, supaya penjelasan AI akurat dan tidak mengarang.
var FLEX_NOTES = {
  id: {
    "justify-content": "mengatur posisi item sepanjang sumbu utama (main axis), yaitu arah susunan item. Pada susunan mendatar, item dapat diletakkan di kiri, tengah, atau kanan. Nilai: flex-start, center, flex-end, space-between, space-around, space-evenly.",
    "align-items": "mengatur posisi item pada sumbu silang (cross axis), yaitu arah yang tegak lurus dengan sumbu utama. Pada susunan mendatar, item dapat diletakkan di atas, tengah, atau bawah. Nilai: flex-start, center, flex-end, stretch.",
    "flex-direction": "menentukan arah sumbu utama: row (kiri ke kanan), row-reverse (kanan ke kiri), column (atas ke bawah), column-reverse (bawah ke atas). Pada column, justify-content mengatur posisi atas-bawah dan align-items mengatur posisi kiri-kanan karena kedua sumbu bertukar.",
    "order": "mengubah urutan tampil item tanpa mengubah HTML. Item dengan angka lebih kecil tampil lebih dahulu. Nilai awalnya 0 dan boleh negatif.",
    "align-self": "mengatur posisi satu item saja pada sumbu silang. Untuk item tersebut, nilainya menggantikan align-items milik container.",
    "flex-wrap": "menentukan apakah item boleh pindah ke baris baru saat ruang tidak cukup. nowrap = tetap satu baris, wrap = pindah ke baris baru, wrap-reverse = baris baru muncul ke arah atas.",
    "flex-flow": "singkatan untuk menulis flex-direction dan flex-wrap sekaligus, misalnya flex-flow: column wrap.",
    "align-content": "mengatur jarak antarbaris saat item terbagi ke beberapa baris. Hanya berpengaruh jika flex-wrap: wrap aktif dan jumlah barisnya lebih dari satu."
  },
  en: {
    "justify-content": "positions items along the main axis, the direction of the row. For a horizontal row, items move left, center, or right. Values: flex-start, center, flex-end, space-between, space-around, space-evenly.",
    "align-items": "positions items on the cross axis, the direction perpendicular to the row. For a horizontal row, items move to the top, center, or bottom. Values: flex-start, center, flex-end, stretch.",
    "flex-direction": "changes the main axis: row (left to right), row-reverse (right to left), column (top to bottom), column-reverse (bottom to top). With column, justify-content controls up-down and align-items controls left-right, because the axes swap.",
    "order": "changes the display order of items without touching the HTML. Smaller numbers come first. Default is 0, negatives are allowed.",
    "align-self": "positions ONE item only on the cross axis. For that item it overrides the container's align-items.",
    "flex-wrap": "decides whether items may drop to a new line when there is no room. nowrap = stay on one line, wrap = drop to a new line, wrap-reverse = new lines go upward.",
    "flex-flow": "shorthand to write flex-direction and flex-wrap together, e.g. flex-flow: column wrap.",
    "align-content": "spaces out the lines when items are split into several lines. Only works when flex-wrap: wrap is active and there is more than one line."
  }
};

// Soal dianggap "butuh beberapa kali percobaan" bila dijalankan sebanyak ini atau lebih.
var HARD_TRIES = 3;

// Ringkas data kuis untuk prompt AI dan kartu hasil. Materi yang perlu dipelajari ada dua jenis:
//  - hardProps: properti di soal yang belum selesai / butuh beberapa kali percobaan (perlu diulang)
//  - newProps : properti yang belum pernah dikerjakan siswa sama sekali (belum dikerjakan)
// Properti yang sudah dikerjakan lancar (mastered) tidak pernah masuk daftar materi, sehingga
// daftar "sudah dikuasai" dan daftar "perlu dipelajari" tidak akan pernah beririsan.
// allClear = semua soal selesai dan tidak ada soal yang butuh HARD_TRIES percobaan atau lebih
// (artinya setiap soal selesai dalam 1-2 percobaan).
function summarizeQuizForAI(quizData) {
  var hard = [], untouched = [], hardProps = [], mastered = {}, newProps = [];
  var solvedCount = 0, totalTries = 0;
  function propsOf(d) {
    return d.jawabanBenar.split("; ").map(function (p) { return p.split(":")[0].trim(); });
  }
  function byOrder(a, b) { return FLEX_ORDER.indexOf(a) - FLEX_ORDER.indexOf(b); }
  function unique(p, i, all) { return all.indexOf(p) === i; }

  quizData.perQuestionDetails.forEach(function (d) {
    var solved = d.status === "Benar";
    if (solved) solvedCount++;
    totalTries += d.percobaan || 0;
    if (!solved && d.percobaan === 0) {
      untouched.push(d);
    } else if (!solved || d.percobaan >= HARD_TRIES) {
      hard.push({
        soal: d.soal,
        solved: solved,
        percobaan: d.percobaan,
        jawabanSiswa: d.jawabanSiswa.replace(/\s+/g, " ").slice(0, 80),
        jawabanBenar: d.jawabanBenar
      });
      hardProps = hardProps.concat(propsOf(d));
    } else {
      propsOf(d).forEach(function (p) { mastered[p] = true; });
    }
  });
  hardProps = hardProps.filter(unique).sort(byOrder);
  untouched.forEach(function (d) {
    propsOf(d).forEach(function (p) {
      if (!mastered[p] && hardProps.indexOf(p) === -1) newProps.push(p);
    });
  });
  newProps = newProps.filter(unique).sort(byOrder);
  var masteredProps = Object.keys(mastered).filter(function (p) { return hardProps.indexOf(p) === -1; }).sort(byOrder);
  var total = quizData.perQuestionDetails.length;
  return {
    hard: hard,
    untouched: untouched.map(function (d) { return d.soal; }),
    hardProps: hardProps,
    newProps: newProps,
    masteredProps: masteredProps,
    total: total,
    solvedCount: solvedCount,
    totalTries: totalTries,
    allClear: total > 0 && solvedCount === total && hard.length === 0
  };
}

// Daftar materi: maksimal 2 properti "perlu diulang", sisanya "belum dikerjakan" (total 3).
// Bisa kosong, misalnya saat soal yang tersisa hanya memakai properti yang sudah dikuasai.
var FLEX_LABELS = {
  id: { hard: "perlu diulang", fresh: "belum dikerjakan" },
  en: { hard: "needs review", fresh: "not attempted yet" }
};
function flexTopics(summary) {
  return summary.hardProps.slice(0, 2).map(function (p) { return { prop: p, kind: "hard" }; })
    .concat(summary.newProps.map(function (p) { return { prop: p, kind: "fresh" }; })).slice(0, 3);
}
function flexNotesForAI(summary, language) {
  var labels = FLEX_LABELS[language] || FLEX_LABELS.id;
  var notes = FLEX_NOTES[language] || FLEX_NOTES.id;
  return flexTopics(summary).map(function (it) {
    return "- `" + it.prop + "` [" + labels[it.kind] + "]: " + notes[it.prop];
  }).join("\n");
}

// Teks tetap untuk bagian yang dibuat oleh kode (bukan AI), supaya selalu sesuai dengan data siswa.
var AI_TEXT = {
  id: {
    done: function (n, total) { return "Kamu telah menyelesaikan " + n + " dari " + total + " soal."; },
    mastered: function (list) { return "Properti yang sudah kamu kuasai: " + list + "."; },
    keepGoing: "Teruskan belajar dengan tekun.",
    topicsHeading: "Materi yang perlu dipelajari",
    summaryHeading: "Ringkasan",
    summaryFallback: "Materi di atas perlu dipelajari agar tata letak Flexbox dapat diatur dengan tepat.",
    noTopics: "Soal yang tersisa memakai properti yang sudah kamu kuasai. Selesaikan soal tersebut untuk menuntaskan semua misi.",
    masteryIntro: function (total, tries, avg) {
      return "Selamat, kamu sudah menguasai konsep Flexbox. Kamu menyelesaikan " + total + " soal dengan total " + tries + " percobaan, rata-rata " + avg + " percobaan per soal.";
    },
    nextHeading: "Langkah belajar selanjutnya",
    nextSteps: [
      "**`flex-grow`, `flex-shrink`, dan `flex-basis`**: melengkapi Flexbox dengan pengaturan item yang dapat tumbuh dan menyusut sesuai ruang yang tersedia. Properti ini belum dibahas pada 25 soal MagicFlex.",
      "**CSS Grid**: mengatur tata letak dua dimensi (baris dan kolom sekaligus), cocok untuk kerangka halaman dan galeri. Grid dan Flexbox sering dipakai bersamaan.",
      "**Layout responsif**: berlatih membuat tampilan yang menyesuaikan ukuran layar, misalnya dengan media query, lalu menerapkannya pada navbar atau kartu produk sederhana."
    ]
  },
  en: {
    done: function (n, total) { return "You have completed " + n + " of " + total + " questions."; },
    mastered: function (list) { return "Properties you have mastered: " + list + "."; },
    keepGoing: "Keep studying steadily.",
    topicsHeading: "Topics to study",
    summaryHeading: "Summary",
    summaryFallback: "The topics above are worth studying so that Flexbox layouts can be controlled precisely.",
    noTopics: "The remaining questions use properties you have already mastered. Complete them to finish all missions.",
    masteryIntro: function (total, tries, avg) {
      return "Congratulations, you have mastered the Flexbox concepts. You completed " + total + " questions with " + tries + " attempts in total, an average of " + avg + " attempts per question.";
    },
    nextHeading: "Next learning steps",
    nextSteps: [
      "**`flex-grow`, `flex-shrink`, and `flex-basis`**: complete your Flexbox knowledge by controlling how items grow and shrink to fill the available space. These properties were not covered in the 25 MagicFlex questions.",
      "**CSS Grid**: arrange layouts in two dimensions (rows and columns at once), suited to page structures and galleries. Grid and Flexbox are often used together.",
      "**Responsive layouts**: practice building pages that adapt to screen size, for example with media queries, then apply it to a simple navbar or product card."
    ]
  }
};
function aiTextFor(language) { return AI_TEXT[language] || AI_TEXT.id; }
function backtickList(props) {
  return props.map(function (p) { return "`" + p + "`"; }).join(", ");
}

// Kalimat pembuka: jumlah soal selesai dan properti yang dikuasai, dibuat dari data (bukan oleh AI).
function aiOpeningText(summary, language) {
  var x = aiTextFor(language);
  var text = x.done(summary.solvedCount, summary.total);
  if (summary.masteredProps.length) text += " " + x.mastered(backtickList(summary.masteredProps));
  return text + " " + x.keepGoing;
}

// Teks untuk siswa yang sudah mahir (semua soal selesai, tiap soal 1-2 percobaan). Tanpa AI.
function aiMasteryText(summary, language) {
  var x = aiTextFor(language);
  var avg = (summary.totalTries / summary.total).toFixed(1);
  if (language !== "en") avg = avg.replace(".", ",");
  return x.masteryIntro(summary.total, summary.totalTries, avg) + "\n\n" +
    "**" + x.nextHeading + "**\n" +
    x.nextSteps.map(function (step, i) { return (i + 1) + ". " + step; }).join("\n");
}

// Teks bila tidak ada materi yang perlu dipelajari tetapi masih ada soal tersisa. Tanpa AI.
function aiNoTopicsText(summary, language) {
  return aiOpeningText(summary, language) + "\n\n" + aiTextFor(language).noTopics;
}

// Rapikan jawaban AI supaya SELALU sinkron dengan data:
//  - kalimat pembuka dari AI dibuang (pembuka dibuat oleh aiOpeningText),
//  - butir untuk properti di luar daftar materi dibuang,
//  - materi yang tidak dibahas AI diisi dari FLEX_NOTES,
//  - Ringkasan yang menyebut properti di luar daftar diganti kalimat tetap.
function sanitizeAIBody(aiText, topics, language) {
  var lang = AI_TEXT[language] ? language : "id";
  var x = AI_TEXT[lang];
  var allowed = {};
  topics.forEach(function (tp) { allowed[tp.prop] = true; });

  var itemsByProp = {}, summaryLines = [], current = null, inSummary = false;
  String(aiText || "").split(/\n+/).forEach(function (raw) {
    var line = raw.trim();
    if (!line) return;
    if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      inSummary = /ringkasan|summary/i.test(line);
      current = null;
      return;
    }
    var item = line.match(/^(?:\d+[.)]|[-*•])\s+(.*)$/);
    if (item && !inSummary) {
      var head = item[1].match(/`([a-z][a-z-]*)`/);
      var prop = head ? head[1] : null;
      current = null;
      if (prop && allowed[prop] && !itemsByProp[prop]) {
        itemsByProp[prop] = item[1];
        current = prop;
      }
      return;
    }
    if (inSummary) summaryLines.push(line);
    else if (current) itemsByProp[current] += " " + line;
  });

  // Penilaian penguasaan hanya boleh dibuat oleh kode. Teks AI yang memuat klaim itu diganti teks tetap.
  var masteryClaim = /nguasai|dikuasai|\bkuasai|mahir|master/i;

  var items = topics.map(function (tp, i) {
    var body = itemsByProp[tp.prop];
    if (!body || masteryClaim.test(body)) {
      var note = FLEX_NOTES[lang][tp.prop] || "";
      body = "**`" + tp.prop + "`**: " + note.charAt(0).toUpperCase() + note.slice(1);
    }
    return (i + 1) + ". " + body;
  });

  var summary = summaryLines.join(" ").trim();
  var tokens = summary.match(/`[a-z][a-z-]*`/g) || [];
  var offList = tokens.some(function (tk) {
    var p = tk.slice(1, -1);
    return FLEX_ORDER.indexOf(p) !== -1 && !allowed[p];
  });
  if (!summary || offList || masteryClaim.test(summary)) summary = x.summaryFallback;

  return "**" + x.topicsHeading + "**\n" + items.join("\n") + "\n\n**" + x.summaryHeading + "**\n" + summary;
}

function t(key, language) {
  var selectedLanguage = translations[language] ? language : "id";
  return translations[selectedLanguage][key] || translations.id[key] || key;
}

var levelInstructionsEn = {
  Q1: "<p>Welcome to MagicFlex! Place the magic ball in the portal on the right with <code>justify-content</code>. This property aligns items horizontally. For example, <code>justify-content: flex-end;</code> moves an item to the right.</p>",
  Q2: "<p>Use <code>justify-content</code> again to place these magic balls in their portals. Try values such as <code>flex-start</code>, <code>flex-end</code>, <code>center</code>, <code>space-between</code>, or <code>space-around</code>.</p>",
  Q3: "<p>Place all three magic balls in their portals using <code>justify-content</code>. The portals have extra space around them. Click <code>justify-content</code> if you need help.</p>",
  Q4: "<p>The magic portals have moved to the corner. Use <code>justify-content</code> so the magic balls have equal space between them.</p>",
  Q5: "<p>Use <code>align-items</code> to move the magic balls to the bottom of the room. This property aligns items vertically. Try <code>flex-start</code>, <code>flex-end</code>, <code>center</code>, <code>baseline</code>, or <code>stretch</code>.</p>",
  Q6: "<p>Move the magic ball exactly to the center of the room by combining <code>justify-content</code> and <code>align-items</code>.</p>",
  Q7: "<p>Move the magic balls into their portals by combining <code>justify-content</code> and <code>align-items</code>. The portals have plenty of space around them.</p>",
  Q8: "<p>Align the magic balls with their portals using <code>flex-direction</code>. This property defines the direction of items: <code>row</code>, <code>row-reverse</code>, <code>column</code>, or <code>column-reverse</code>.</p>",
  Q9: "<p>Place the magic balls into the vertical portals using <code>flex-direction</code>. Remember that <code>column</code> arranges items from top to bottom.</p>",
  Q10: "<p>Place the magic balls in their portals. You need both <code>flex-direction</code> and <code>justify-content</code>. When the direction is reversed, start and end are reversed too.</p>",
  Q11: "<p>Move the magic balls into their portals using <code>flex-direction</code> and <code>justify-content</code>. With a column direction, <code>justify-content</code> controls vertical placement and <code>align-items</code> controls horizontal placement.</p>",
  Q12: "<p>Place the magic balls in their portals using <code>flex-direction</code> and <code>justify-content</code>.</p>",
  Q13: "<p>Move the magic balls into their portals using <code>flex-direction</code>, <code>justify-content</code>, and <code>align-items</code>.</p>",
  Q14: "<p>Reversing a row or column is not always enough. Use the <code>order</code> property on an individual item to rearrange the magic balls. Items have an order of 0 by default.</p>",
  Q15: "<p>Use <code>order</code> to send the red magic ball into its portal.</p>",
  Q16: "<p>Use <code>align-self</code> on an individual item. It accepts the same values as <code>align-items</code>, but applies only to that item.</p>",
  Q17: "<p>Combine <code>order</code> and <code>align-self</code> to place the magic balls in the correct positions.</p>",
  Q18: "<p>All magic balls are squeezed into one row. Spread them out with <code>flex-wrap</code>. Use <code>nowrap</code>, <code>wrap</code>, or <code>wrap-reverse</code>.</p>",
  Q19: "<p>Arrange these magic balls into three neat columns by combining <code>flex-direction</code> and <code>flex-wrap</code>.</p>",
  Q20: "<p><code>flex-flow</code> is shorthand for <code>flex-direction</code> and <code>flex-wrap</code>. Use it to solve the previous challenge. For example: <code>flex-flow: row wrap;</code>.</p>",
  Q21: "<p>The magic balls are spread across the room, but their portals are grouped at the top. Use <code>align-content</code> to control the spacing between multiple flex lines. It has no effect when there is only one line.</p>",
  Q22: "<p>The portals are now grouped at the bottom. Use <code>align-content</code> to move the magic balls there.</p>",
  Q23: "<p>Combine <code>flex-direction</code> and <code>align-content</code> to guide the magic balls into the portal arrangement.</p>",
  Q24: "<p>Place the magic balls into this portal arrangement using the Flexbox properties you have learned: <code>justify-content</code>, <code>align-items</code>, <code>flex-direction</code>, <code>order</code>, <code>align-self</code>, <code>flex-wrap</code>, <code>flex-flow</code>, and <code>align-content</code>.</p>",
  Q25: "<p>Final Magic Exam! The magic balls are scattered across dimensions. Use a complex combination of Flexbox properties to place them in the correct portals. You may need <code>flex-direction</code>, <code>flex-wrap</code>, <code>justify-content</code>, <code>align-items</code>, <code>align-content</code> and <code>order</code>.</p>",
};

function getLevelInstruction(level, language) {
  return language === "en" ? levelInstructionsEn[level.name] : level.instructions.id;
}
