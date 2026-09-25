/**
 * CSS Learning Game - Main Game Object
 * A web-based game for learning CSS with timer functionality
 */

// SweetAlert2 compatibility check and fallback
var AlertHelper = {
  hasSweetAlert: false,
  init: function () {
    this.hasSweetAlert = typeof Swal !== "undefined";
  },
  fire: function (options) {
    if (this.hasSweetAlert) {
      return Swal.fire(options);
    } else {
      this.fallbackAlert(options);
      return Promise.resolve();
    }
  },
  fallbackAlert: function (options) {
    // Simple fallback for when SweetAlert2 is not available
    const title = options.title || "";
    const message = options.html || options.text || "";
    alert(title + "\n\n" + message.replace(/<[^>]*>/g, ""));
  },
};

var game = {
  // ===========================================
  // PROPERTIES
  // ===========================================

  // Game state
  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbzV-vlUviLkrjUR7g79-FyolCvr3fjzrmiZ_jSTi43qB2vs7_hFtU7wtVUA05EP-Sd88w/exec",
  language: ["id", "en"].includes(window.location.hash.substring(1))
    ? window.location.hash.substring(1)
    : localStorage.getItem("language") || "id",
  level: parseInt(localStorage.level, 10) || 0,
  answers: (localStorage.answers && JSON.parse(localStorage.answers)) || {},
  solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],
  changed: false,
  clickedCode: null,
  levelRunCounts: (localStorage.levelRunCounts && JSON.parse(localStorage.levelRunCounts)) || {},

  // Time tracking
  gameStartTime: localStorage.getItem("gameStartTime")
    ? parseInt(localStorage.getItem("gameStartTime"), 10)
    : null,

  // Timer properties
  timer: null,
  timerStarted: false,
  timeLeft: localStorage.getItem("timeLeft")
    ? parseInt(localStorage.getItem("timeLeft"), 10)
    : 1800, // 30 menit

  // ===========================================
  // TIMER METHODS
  // ===========================================

  /**
   * Start the game timer
   */
  startTimer: function () {
    if (this.timerStarted) return;

    // Record the game start time if not already set (survives page reload)
    if (!this.gameStartTime) {
      this.gameStartTime = Date.now();
      localStorage.setItem("gameStartTime", this.gameStartTime);
    }

    this.timerStarted = true;
    var timerDisplay = document.getElementById("timer");

    this.timer = setInterval(function () {
      if (game.timeLeft > 0) {
        game.timeLeft--;
        localStorage.setItem("timeLeft", game.timeLeft);

        var minutes = Math.floor(game.timeLeft / 60);
        var seconds = game.timeLeft % 60;
        var display = ` ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (timerDisplay) timerDisplay.textContent = display;
        // Sync mobile timer
        var mobileTimer = document.getElementById("timer-mobile");
        if (mobileTimer) mobileTimer.textContent = display;
      } else {
        // Waktu normal 30 menit habis: simpan hasil data dan akhiri game
        game.endGame();
      }
    }, 1000);
  },

  /**
   * Stop the timer
   */
  stopTimer: function () {
    clearInterval(this.timer);
    localStorage.setItem("timeLeft", this.timeLeft);
  },

  /**
   * Reset timer to initial state
   */
  resetTimer: function () {
    this.timerStarted = false;
    clearInterval(this.timer);
    this.timeLeft = 1800; // 30 menit
    localStorage.removeItem("timeLeft");
    this.gameStartTime = null;
    localStorage.removeItem("gameStartTime");
  },

  /**
   * Menangani kondisi ketika website ditinggalkan/ditutup dan waktu pengerjaan melebihi 30 menit
   * Menghapus data pengerjaan dari Spreadsheet secara otomatis.
   */
  handleTimeout: function () {
    this.stopTimer();
    this.deleteSpreadsheetData();

    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "⏰ Sesi Dibatalkan!",
        html: '<p style="font-size:1em;">Waktu pengerjaan telah melebihi batas <strong>30 menit</strong> karena halaman ditutup atau ditinggalkan.</p><p style="font-size:0.9em;color:#ef4444;margin-top:8px;">Data pengerjaan kamu di spreadsheet telah <strong>dihapus secara otomatis</strong>.</p>',
        confirmButtonText: "🔄 Mulai Ulang",
        allowOutsideClick: false,
        customClass: { confirmButton: "swal2-biru-btn", popup: "swal2-enhanced-popup" },
      }).then(() => {
        this.resetGame();
        localStorage.removeItem("playerName");
        localStorage.removeItem("playerAbsence");
        location.reload();
      });
    } else {
      alert("Sesi Dibatalkan! Waktu pengerjaan melebihi 30 menit karena halaman ditutup. Data kamu di spreadsheet telah dihapus.");
      this.resetGame();
      localStorage.removeItem("playerName");
      localStorage.removeItem("playerAbsence");
      location.reload();
    }
  },

  /**
   * Menghapus data siswa dari Google Spreadsheet
   */
  deleteSpreadsheetData: function () {
    const playerName = localStorage.getItem("playerName");
    const playerAbsence = localStorage.getItem("playerAbsence");
    if (!playerName || !playerAbsence) return Promise.resolve();

    const formData = new URLSearchParams();
    formData.append("action", "delete");
    formData.append("nama", playerName);
    formData.append("absen", playerAbsence);

    return fetch(this.googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }).then(() => {
      console.log("Data pengerjaan berhasil dihapus dari Spreadsheet karena waktu habis.");
    }).catch(err => {
      console.error("Gagal menghapus data dari Spreadsheet:", err);
    });
  },

  // ===========================================
  // GAME FLOW METHODS
  // ===========================================

  /**
   * Initialize and start the game
   */
  start: function () {
    const savedName = localStorage.getItem("playerName");
    const savedAbsence = localStorage.getItem("playerAbsence");

    if (!savedName || !savedAbsence) {
      this.showInputPopup();
      return;
    }

    // Jika siswa menutup website saat bermain dan kembali setelah lebih dari 30 menit:
    // Hapus data pengerjaan dari spreadsheet
    if (this.gameStartTime && Date.now() - this.gameStartTime > 1800 * 1000) {
      this.handleTimeout();
      return;
    }
    if (this.timeLeft <= 0) {
      this.endGame();
      return;
    }

    this.startTimer();
    this.initializeGame();
    this.generateProgressDots();
  },

  /**
   * Initialize game components
   */
  initializeGame: function () {
    // Setup UI
    this.translate();
    this.updateNextLevelBtn();
    $("#level-counter .total").text(levels.length);
    $("#editor").show();
    $("#share").hide();

    this.setHandlers();
    this.loadMenu();
    this.loadLevel(levels[this.level]);
  },

  /**
   * Move to next level
   */
  next: function () {
    this.isAdvancing = false;
    this.level++;
    this.changed = false;
    this.loadLevel(levels[this.level]);
    this.generateProgressDots();
    this.updateNextLevelBtn();
  },

  /**
   * Move to previous level
   */
  prev: function () {
    this.isAdvancing = false;
    this.level--;
    this.changed = false;
    this.loadLevel(levels[this.level]);
    this.generateProgressDots();
    this.updateNextLevelBtn();
  },

  /**
   * End the game and show results
   */
  endGame: function () {
    clearInterval(this.timer);
    this.showResults();
  },

  /**
   * Hapus cache sesi siswa agar kunjungan game berikutnya selalu meminta nama dan nomor absen baru.
   * Preferensi bahasa sengaja tidak dihapus.
   */
  clearStudentSession: function () {
    [
      "playerName",
      "playerAbsence",
      "level",
      "answers",
      "solved",
      "timeLeft",
      "gameStartTime",
      "levelRunCounts",
    ].forEach(function (key) {
      localStorage.removeItem(key);
    });
  },

  /**
   * Simpan data terakhir ke Spreadsheet, lalu bersihkan cache sesi lokal.
   */
  saveAndClearSession: function () {
    if (this.isLeavingGame) return;
    this.isLeavingGame = true;

    this.saveAnswer();
    this.liveSyncData(true);
    this.clearStudentSession();
  },

  /**
   * Reset game to initial state
   */
  resetGame: function () {
    this.resetTimer();
    this.level = 0;
    this.answers = {};
    this.solved = [];
    
    // Tambahkan dua baris ini untuk mereset riwayat percobaan
    this.levelRunCounts = {};
    localStorage.removeItem("levelRunCounts");

    this.loadLevel(levels[0]);
    this.clearStudentSession();
    this.showInputPopup();
  },

  // ===========================================
  // USER INTERFACE METHODS
  // ===========================================

  /**
   * Show player input popup
   */
  // showInputPopup: function () {
  //   const savedName = localStorage.getItem("playerName");
  //   const savedAbsence = localStorage.getItem("playerAbsence");

  //   if (!savedName || !savedAbsence) {
  //     // Check if Swal is available
  //     if (typeof Swal === "undefined") {
  //       console.warn("SweetAlert2 is not loaded, using fallback");
  //       const name = prompt("Enter your name:");
  //       const absence = prompt("Enter your absence number:");
  //       if (name && absence) {
  //         localStorage.setItem("playerName", name);
  //         localStorage.setItem("playerAbsence", absence);
  //         location.reload();
  //       }
  //       return;
  //     }

  //     try {
  //       Swal.fire({
  //         title: "Welcome!",
  //         html: `
  //           <input id="nameInput" class="swal2-input" placeholder="Enter your name" value="${savedName || ""}">
  //           <input id="absenceInput" class="swal2-input" placeholder="Enter your absence number" value="${savedAbsence || ""}">
  //         `,
  //         confirmButtonText: "Start Game",
  //         focusConfirm: false,
  //         allowOutsideClick: false,
  //         customClass: {
  //           confirmButton: "swal2-biru-btn",
  //         },
  //         preConfirm: () => {
  //           const playerName = document.getElementById("nameInput").value;
  //           const playerAbsence = document.getElementById("absenceInput").value;

  //           if (!playerName || !playerAbsence) {
  //             Swal.showValidationMessage(
  //               "Name and absence number are required!",
  //             );
  //             return false;
  //           }

  //           localStorage.setItem("playerName", playerName);
  //           localStorage.setItem("playerAbsence", playerAbsence);
  //           location.reload();
  //           return true;
  //         },
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.initializeGame();
  //         }
  //       });
  //     } catch (e) {
  //       console.error("Error with SweetAlert2:", e);
  //       const name = prompt("Enter your name:");
  //       const absence = prompt("Enter your absence number:");
  //       if (name && absence) {
  //         localStorage.setItem("playerName", name);
  //         localStorage.setItem("playerAbsence", absence);
  //         location.reload();
  //       }
  //     }
  //   } else {
  //     this.initializeGame();
  //   }
  // },

  showInputPopup: function () {
    const savedName = localStorage.getItem("playerName");
    const savedAbsence = localStorage.getItem("playerAbsence");

    if (!savedName || !savedAbsence) {
      if (typeof Swal === "undefined") {
        const name = prompt(t("namePrompt", game.language));
        const absence = prompt(t("absencePrompt", game.language));
        if (name && absence) {
          localStorage.setItem("playerName", name);
          localStorage.setItem("playerAbsence", absence);
          game.liveSyncData();
          game.startTimer();
          game.initializeGame();
          game.generateProgressDots();
        }
        return;
      }

      try {
        Swal.fire({
          title: t("welcomeTitle", game.language),
          html: `
            <input id="nameInput" class="swal2-input" placeholder="${t("namePlaceholder", game.language)}" value="${savedName || ""}">
            <input id="absenceInput" class="swal2-input" placeholder="${t("absencePlaceholder", game.language)}" value="${savedAbsence || ""}">
          `,
          confirmButtonText: t("startGame", game.language),
          focusConfirm: false,
          allowOutsideClick: false,
          customClass: {
            confirmButton: "swal2-biru-btn",
          },
          preConfirm: () => {
            const playerName = document.getElementById("nameInput").value;
            const playerAbsence = document.getElementById("absenceInput").value;

            if (!playerName || !playerAbsence) {
              Swal.showValidationMessage(
                t("nameAbsenceRequired", game.language),
              );
              return false;
            }

            localStorage.setItem("playerName", playerName);
            localStorage.setItem("playerAbsence", playerAbsence);
            game.liveSyncData();
            return true;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.startTimer();
            this.initializeGame();
            this.generateProgressDots();
          }
        });
      } catch (e) {
        const name = prompt(t("namePrompt", game.language));
        const absence = prompt(t("absencePrompt", game.language));
        if (name && absence) {
          localStorage.setItem("playerName", name);
          localStorage.setItem("playerAbsence", absence);
          game.liveSyncData();
          game.startTimer();
          game.initializeGame();
          game.generateProgressDots();
        }
      }
    } else {
      this.initializeGame();
    }
  },

  /**
   * Show game results with SweetAlert2
   */
  // showResults: function () {
  //   const playerName = localStorage.getItem("playerName") || "Unknown";
  //   const playerAbsence = localStorage.getItem("playerAbsence") || "-";
  //   const totalQuestions = levels.length;
  //   const correctAnswers = this.solved.length;
  //   const wrongAnswers = totalQuestions - correctAnswers;
  //   const score = Math.round((correctAnswers / totalQuestions) * 100);

  //   // Determine performance level and styling
  //   let performanceLevel = "";
  //   let performanceColor = "";
  //   let performanceIcon = "";

  //   if (score >= 90) {
  //     performanceLevel = "Excellent!";
  //     performanceColor = "#10b981";
  //     performanceIcon = "🌟";
  //   } else if (score >= 80) {
  //     performanceLevel = "Very Good!";
  //     performanceColor = "#3b82f6";
  //     performanceIcon = "🎯";
  //   } else if (score >= 70) {
  //     performanceLevel = "Good!";
  //     performanceColor = "#8b5cf6";
  //     performanceIcon = "👍";
  //   } else if (score >= 60) {
  //     performanceLevel = "Fair";
  //     performanceColor = "#f59e0b";
  //     performanceIcon = "📈";
  //   } else {
  //     performanceLevel = "Keep Trying!";
  //     performanceColor = "#ef4444";
  //     performanceIcon = "💪";
  //   }

  //   // Check if Swal is available
  //   if (typeof Swal === "undefined") {
  //     console.warn("SweetAlert2 is not loaded for results, using fallback");
  //     const resultText = `QUIZ RESULTS\n\nPlayer: ${playerName}\nAbsence: ${playerAbsence}\nScore: ${score}%\nCorrect: ${correctAnswers}/${totalQuestions}`;
  //     alert(resultText);
  //     this.saveResults(score);
  //     return;
  //   }
  //   try {
  //     const correctDetails =
  //       this.solved.length > 0
  //         ? `<div class="question-list correct-list">${this.solved
  //             .map(
  //               (q) =>
  //                 `<div class="question-item correct-item">
  //                 <span class="question-icon">✅</span>
  //                 <span class="question-text">${q}</span>
  //             </div>`,
  //             )
  //             .join("")}</div>`
  //         : '<div class="empty-state">No correct answers</div>';

  //     const wrongDetails =
  //       totalQuestions > 0
  //         ? `<div class="question-list wrong-list">${levels
  //             .map((level) => level.name)
  //             .filter((name) => !this.solved.includes(name))
  //             .map(
  //               (q) =>
  //                 `<div class="question-item wrong-item">
  //                     <span class="question-icon">❌</span>
  //                     <span class="question-text">${q}</span>
  //                 </div>`,
  //             )
  //             .join("")}</div>`
  //         : '<div class="empty-state">All questions answered correctly!</div>';

  //     Swal.fire({
  //       title: `${performanceIcon} Quiz Results`,
  //       html: `
  //             <style>
  //                 .performance-badge {
  //                     background: linear-gradient(135deg, ${performanceColor}20, ${performanceColor}35);
  //                     border: 2px solid ${performanceColor};
  //                     border-radius: 25px;
  //                     padding: 12px 20px;
  //                     margin: 15px 0;
  //                     text-align: center;
  //                     font-weight: bold;
  //                     color: ${performanceColor};
  //                     font-size: 1.1em;
  //                     text-shadow: 0 0 10px ${performanceColor}40;
  //                     box-shadow: 0 0 20px ${performanceColor}15;
  //                 }
  //             </style>
              
  //             <div class="results-container">
  //                 <div class="performance-badge">
  //                     ${performanceLevel} Your score: ${score}%
  //                 </div>
                  
  //                 <div class="player-info">
  //                     <div class="player-row">
  //                         <span class="player-label"> Player Name:</span>
  //                         <span class="player-value">${playerName}</span>
  //                     </div>
  //                     <div class="player-row">
  //                         <span class="player-label"> Absence Number:</span>
  //                         <span class="player-value">${playerAbsence}</span>
  //                     </div>
  //                 </div>
                  
  //                 <div class="stats-grid">
  //                     <div class="stat-card">
  //                         <div class="stat-value score-value">${score}%</div>
  //                         <div class="stat-label">Final Score</div>
  //                     </div>
  //                     <div class="stat-card">
  //                         <div class="stat-value total-value">${totalQuestions}</div>
  //                         <div class="stat-label">Total Questions</div>
  //                     </div>
  //                     <div class="stat-card">
  //                         <div class="stat-value correct-value">${correctAnswers}</div>
  //                         <div class="stat-label">Correct Answers</div>
  //                     </div>
  //                     <div class="stat-card">
  //                         <div class="stat-value wrong-value">${wrongAnswers}</div>
  //                         <div class="stat-label">Wrong Answers</div>
  //                     </div>
  //                 </div>
                  
  //                 <div class="section-divider"></div>
                  
  //                 <div class="section-title correct-title">✅ Correct Questions (${correctAnswers})</div>
  //                 ${correctDetails}
                  
  //                 <div class="section-title wrong-title">❌ Wrong Questions (${wrongAnswers})</div>
  //                 ${wrongDetails}
  //             </div>
  //         `,
  //       showCancelButton: true,
  //       focusConfirm: false,
  //       allowOutsideClick: false,
  //       confirmButtonText: "🔄 Play Again",
  //       cancelButtonText: "📤 Share Results",
  //       customClass: {
  //         confirmButton: "swal2-krem-btn",
  //         cancelButton: "swal2-biru-btn",
  //         popup: "swal2-enhanced-popup",
  //       },
  //       preConfirm: () => this.resetGame(),
  //     }).then((result) => {
  //       if (result.isDismissed) {
  //         this.shareResults({
  //           playerName,
  //           playerAbsence,
  //           score,
  //           totalQuestions,
  //           correctAnswers,
  //           wrongAnswers,
  //           performanceLevel,
  //           correctDetails: this.solved.join(", ") || "None",
  //           wrongDetails:
  //             levels
  //               .map((level) => level.name)
  //               .filter((name) => !this.solved.includes(name))
  //               .join(", ") || "None",
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.error("Error showing results with SweetAlert2:", e);
  //     const resultText = `QUIZ RESULTS\n\nPlayer: ${playerName}\nAbsence: ${playerAbsence}\nScore: ${score}%\nCorrect: ${correctAnswers}/${totalQuestions}`;
  //     alert(resultText);
  //     this.saveResults(score);
  //   }
  // },

/**
   * Show game results with SweetAlert2
   */
  showResults: function () {
    const playerName = localStorage.getItem("playerName") || "Unknown";
    const playerAbsence = localStorage.getItem("playerAbsence") || "-";
    const totalQuestions = levels.length;
    const correctAnswers = this.solved.length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    let performanceLevel = "";
    let performanceColor = "";
    let performanceIcon = "";

    if (score >= 90) {
      performanceLevel = t("performanceExcellent", this.language);
      performanceColor = "#10b981";
      performanceIcon = "🌟";
    } else if (score >= 80) {
      performanceLevel = t("performanceVeryGood", this.language);
      performanceColor = "#3b82f6";
      performanceIcon = "🎯";
    } else if (score >= 70) {
      performanceLevel = t("performanceGood", this.language);
      performanceColor = "#8b5cf6";
      performanceIcon = "👍";
    } else if (score >= 60) {
      performanceLevel = t("performanceFair", this.language);
      performanceColor = "#f59e0b";
      performanceIcon = "📈";
    } else {
      performanceLevel = t("performanceKeepTrying", this.language);
      performanceColor = "#ef4444";
      performanceIcon = "💪";
    }

    // Hitung waktu pengerjaan (maksimal 30 menit jika selesai tepat waktu)
    let waktuPengerjaan = "30 menit 00 detik";
    if (this.gameStartTime) {
      const elapsedMs = Date.now() - this.gameStartTime;
      const totalSeconds = Math.min(Math.floor(elapsedMs / 1000), 1800);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      waktuPengerjaan = `${mins} menit ${secs < 10 ? "0" : ""}${secs} detik`;
    }

    // KIRIM DATA OTOMATIS KE SPREADSHEET (Tetap Berjalan)
    this.autoSaveData({ playerName, playerAbsence, score, waktuPengerjaan });

    // Data yang akan dikirim ke Prompt AI
    const quizDataForAI = {
      score,
      correctAnswers,
      wrongAnswers,
      performanceLevel,
      wrongDetails: levels.map(level => level.name).filter(name => !this.solved.includes(name)).join(", ") || "None"
    };

    if (typeof Swal === "undefined") {
      alert(`QUIZ RESULTS\n\nPlayer: ${playerName}\nScore: ${score}%`);
      return;
    }

    try {
      const correctDetails =
        this.solved.length > 0
          ? `<div class="question-list correct-list">${this.solved.map((q) => `<div class="question-item correct-item"><span class="question-icon">✅</span><span class="question-text">${q}</span></div>`).join("")}</div>`
          : '<div class="empty-state">' + t("noCorrectAnswers", this.language) + '</div>';

      const wrongDetails =
        totalQuestions > 0
          ? `<div class="question-list wrong-list">${levels.map((level) => level.name).filter((name) => !this.solved.includes(name)).map((q) => `<div class="question-item wrong-item"><span class="question-icon">❌</span><span class="question-text">${q}</span></div>`).join("")}</div>`
          : '<div class="empty-state">' + t("allQuestionsCorrect", this.language) + '</div>';

      Swal.fire({
        title: `${t("resultTitle", this.language)}`,
        html: `
              <style>
                  .performance-badge { background: linear-gradient(135deg, ${performanceColor}20, ${performanceColor}35); border: 2px solid ${performanceColor}; border-radius: 25px; padding: 12px 20px; margin: 15px 0; text-align: center; font-weight: bold; color: ${performanceColor}; font-size: 1.1em; }
              </style>
              
              <div class="results-container">
                  <div class="performance-badge">${performanceLevel} ${t("yourScore", this.language)} ${score}%</div>
                  
                  <div class="ai-feedback-container" style="margin: 15px 0; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                          <h3 style="margin: 0; font-size: 1.1em; color: #334155;">${t("aiLearningAdvice", this.language)}</h3>
                      </div>
                      <div id="ai-feedback-content"></div>
                  </div>

                  <div class="player-info">
                      <div class="player-row"><span class="player-label"> ${t("playerName", this.language)}</span><span class="player-value">${playerName}</span></div>
                      <div class="player-row"><span class="player-label"> ${t("absenceNumber", this.language)}</span><span class="player-value">${playerAbsence}</span></div>
                  </div>
                  
                  <div class="stats-grid">
                      <div class="stat-card"><div class="stat-value score-value">${score}%</div><div class="stat-label">${t("finalScore", this.language)}</div></div>
                      <div class="stat-card"><div class="stat-value total-value">${totalQuestions}</div><div class="stat-label">${t("totalQuestions", this.language)}</div></div>
                      <div class="stat-card"><div class="stat-value correct-value">${correctAnswers}</div><div class="stat-label">${t("correctAnswers", this.language)}</div></div>
                      <div class="stat-card"><div class="stat-value wrong-value">${wrongAnswers}</div><div class="stat-label">${t("wrongAnswers", this.language)}</div></div>
                  </div>
                  
                  <div class="section-divider"></div>
                  <button id="btn-share-results" type="button" style="width: 100%; margin-bottom: 16px; padding: 10px 16px; border: 0; border-radius: 8px; background: #2563eb; color: #ffffff; cursor: pointer; font-weight: 700;">${t("shareToWhatsApp", this.language)}</button>
                  <div class="section-title correct-title">✅ ${t("correctQuestions", this.language)} (${correctAnswers})</div>${correctDetails}
                  <div class="section-title wrong-title">❌ ${t("wrongQuestions", this.language)} (${wrongAnswers})</div>${wrongDetails}
              </div>
          `,
        focusConfirm: false,
        allowOutsideClick: false,
        showDenyButton: true,
        confirmButtonText: t("playAgain", this.language),
        denyButtonText: t("backToHome", this.language),
        customClass: {
          confirmButton: "swal2-krem-btn",
          denyButton: "swal2-biru-btn",
          popup: "swal2-enhanced-popup",
        },
        didOpen: () => {
          // Masukan Gemini dibuat otomatis saat hasil kuis dibuka.
          game.handleAIFeedbackRequest(quizDataForAI);

          // Tombol berbagi berada di dalam popup agar hasil kuis tidak tertutup.
          const shareButton = document.getElementById("btn-share-results");
          if (shareButton) {
            shareButton.addEventListener("click", function () {
              game.shareResults(score);
            });
          }
        },
        preConfirm: () => this.resetGame(),
      }).then((result) => {
        if (result.isDenied) {
          this.clearStudentSession();
          window.location.href = "index.html";
        }
      });
    } catch (e) {
      console.error("Error showing results:", e);
    }
  },

  /**
   * Handle AI Feedback Request Flow
   */
  handleAIFeedbackRequest: function(quizData) {
    const _0xkey = ['QUl6YVN', '5QUZDNllJcnN3SHRr', 'cWFTWElzT1kx', 'c2VFaXVGNll', 'OOWJV'];
    const apiKey = atob(_0xkey.join(''));
    this.fetchAIFeedback(apiKey, quizData);
  },

  /**
   * Fetch AI Feedback from Gemini API
   */
  fetchAIFeedback: async function(apiKey, quizData) {
    const feedbackContent = document.getElementById('ai-feedback-content');
    if (!feedbackContent) return;

    feedbackContent.innerHTML = '<div style="text-align: center; color: #64748b; padding: 15px;">' + t("sendingAiFeedback", this.language) + '</div>';

    const promptText = t("aiPrompt", this.language)(quizData);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || t("aiResponseError", this.language));

      const aiText = data.candidates[0].content.parts[0].text;
      const oneParagraphText = aiText.replace(/\s*\n+\s*/g, " ").trim();
      const formattedText = oneParagraphText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      feedbackContent.innerHTML = `<div style="font-size: 0.95em; line-height: 1.6; color: #334155;">${formattedText}</div>`;
      
    } catch (error) {
      feedbackContent.innerHTML = `
        <div style="color: #ef4444; font-size: 0.9em; margin-bottom: 10px; padding: 10px; background: #fee2e2; border-radius: 8px;">❌ <strong>${t("aiErrorTitle", this.language)}</strong> ${error.message}</div>
        <button id="btn-get-ai-feedback-retry" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%;">${t("tryAgain", this.language)}</button>
      `;
      document.getElementById('btn-get-ai-feedback-retry').addEventListener('click', () => {
        this.handleAIFeedbackRequest(quizData);
      });
    }
  },

  /**
   * Share results via WhatsApp only
   */
  shareResults: function (score) {
    const shareText = this.language === "en"
      ? `I scored ${score}% in the MagicFlex CSS game! Can you beat my score?`
      : `Saya mendapat skor ${score}% di game CSS MagicFlex! Ayo coba kalahkan skorku!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  },

  /**
   * Mengirim data ke Google Sheets secara otomatis (Background)
   */
  autoSaveData: function (quizData) {
    // Format detailJawaban sebagai objek {tries, status} agar sesuai dengan Apps Script
    const detailJawaban = levels.map(level => {
      const levelId = level.name;
      const tries = this.levelRunCounts ? (this.levelRunCounts[levelId] || 0) : 0;
      const isSolved = this.solved.includes(levelId);
      return {
        tries: tries,
        status: isSolved ? "Benar" : "Salah"
      };
    });

    const formData = new URLSearchParams();
    formData.append("nama", quizData.playerName);
    formData.append("absen", quizData.playerAbsence);
    formData.append("skor", quizData.score);
    formData.append("waktuPengerjaan", quizData.waktuPengerjaan || "N/A");
    formData.append("detailJawaban", JSON.stringify(detailJawaban));

    fetch(this.googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }).then(() => {
      console.log("Data berhasil terkirim otomatis ke Spreadsheet");
    }).catch((error) => {
      console.error("Gagal mengirim data:", error);
    });
  },
  /**
   * Generate progress dots with numbers and sync with level navigation
   */
  generateProgressDots: function () {
    const self = this;
    const totalLevels = levels.length;
    const $progressGrid = $("#progressGrid");
    $progressGrid.empty(); // bersihkan dulu

    for (let i = 0; i < totalLevels; i++) {
      const $dot = $("<span/>")
        .addClass("progress-dot")
        .attr("data-level", i)
        .text(i + 1);

      // status solved / current
      if (this.solved.indexOf(levels[i].name) !== -1) {
        $dot.addClass("solved");
      }
      if (i === this.level) {
        $dot.addClass("current");
      }

      // klik pindah level (blokir jika soal sebelumnya belum solved)
      $dot.on("click", function (e) {
        e.stopPropagation();

        // Cek apakah user bisa pindah ke level ini
        // User hanya bisa mundur ke level yang sudah solved, atau tetap di level saat ini
        // Tidak bisa maju melewati level yang belum solved
        if (i > self.level) {
          // Cek semua level dari current sampai target-1 harus solved
          var canAdvance = true;
          for (var k = self.level; k < i; k++) {
            if ($.inArray(levels[k].name, self.solved) === -1) {
              canAdvance = false;
              break;
            }
          }
          if (!canAdvance) {
            if (typeof Swal !== "undefined") {
              Swal.fire({
                icon: "warning",
                title: "⚠️ Belum Bisa Lanjut",
                html: '<p style="font-size:0.95em;">Kamu harus <strong>menyelesaikan soal saat ini</strong> terlebih dahulu sebelum bisa pindah ke soal lain.</p>',
                confirmButtonText: "OK",
                customClass: { confirmButton: "swal2-biru-btn", popup: "swal2-enhanced-popup" },
              });
            }
            return;
          }
        }

        self.saveAnswer();
        self.level = i;
        self.loadLevel(levels[i]);
        self.generateProgressDots();
      });

      $progressGrid.append($dot);
    }

    // sinkronkan indikator level teks "Mission X of Y"
    $("#level-indicator .current").text(this.level + 1);
    $("#level-indicator .total").text(totalLevels);

    // sinkronkan juga counter global jika ada (yang di header)
    $("#level-counter .current").text(this.level + 1);
    $("#level-counter .total").text(totalLevels);

    // update state tombol prev/next (kelas disabled sudah dipakai di code lama)
    if (this.level === 0) {
      $(".arrow.left").addClass("disabled");
    } else {
      $(".arrow.left").removeClass("disabled");
    }
    if (this.level === totalLevels - 1) {
      $(".arrow.right").addClass("disabled");
    } else {
      $(".arrow.right").removeClass("disabled");
    }

    this.updateNextLevelBtn();
  },

  /**
   * Update text and icon of the Next Level / Finish button
   */
  updateNextLevelBtn: function () {
    var textEl = document.getElementById("nextLevelText");
    var iconEl = document.getElementById("nextLevelIcon");
    if (!textEl || !iconEl) return;

    if (this.level >= levels.length - 1) {
      textEl.textContent = t("finish", this.language);
      iconEl.textContent = "check_circle";
    } else {
      textEl.textContent = t("nextQuestion", this.language);
      iconEl.textContent = "arrow_forward";
    }
  },

  // ===========================================
  // LEVEL MANAGEMENT METHODS
  // ===========================================

  /**
   * Load and display level menu
   */
  loadMenu: function () {
    levels.forEach((level, i) => {
      const levelMarker = $("<span/>")
        .addClass("level-marker")
        .attr({ "data-level": i, title: level.name })
        .text(i + 1);

      if ($.inArray(level.name, this.solved) !== -1) {
        levelMarker.addClass("solved");
      }

      levelMarker.appendTo("#levels");
    });

    this.bindMenuEvents();
  },

  /**
   * Bind menu-related events
   */
  bindMenuEvents: function () {
    // Level marker clicks
    $(".level-marker").on("click", function () {
      game.saveAnswer();
      const level = $(this).attr("data-level");
      game.level = parseInt(level, 10);
      game.loadLevel(levels[level]);
    });

    // Level indicator click
    $("#level-indicator").on("click", function () {
      $("#levelsWrapper").toggle();
      $("#instructions .tooltip").remove();
    });

    // Arrow navigation
    $(".arrow.left").on("click", function () {
      if (!$(this).hasClass("disabled")) {
        game.saveAnswer();
        game.prev();
        game.generateProgressDots();
      }
    });

    $(".arrow.right").on("click", async function () {
      if (!$(this).hasClass("disabled") && !game.isAdvancing) {
        const levelId = levels[game.level].name;

        game.levelRunCounts = game.levelRunCounts || {};
        if (!game.levelRunCounts[levelId] || game.changed) {
          game.levelRunCounts[levelId] = (game.levelRunCounts[levelId] || 0) + 1;
          localStorage.setItem("levelRunCounts", JSON.stringify(game.levelRunCounts));
        }

        await game.check();
        const isSolved = $.inArray(levelId, game.solved) !== -1;

        if (!isSolved) {
          game.tryagain();
          game.showErrorNotification();
          game.liveSyncData();
          return;
        }

        game.isAdvancing = true;
        $(".frog").addClass("animated bounceOutUp");
        $(".arrow, #next, #nextLevelBtn").addClass("disabled");

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "✨ Jawaban Benar!",
            text: "Hebat! Kode CSS kamu sudah tepat. Melanjutkan ke soal berikutnya...",
            timer: 1600,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: { popup: "swal2-enhanced-popup" },
          });
        }

        setTimeout(function () {
          game.isAdvancing = false;
          game.saveAnswer();
          game.liveSyncData();

          if (game.level >= levels.length - 1) {
            game.endGame();
          } else {
            game.next();
            game.generateProgressDots();
          }
        }, 1600);
      }
    });
  },

  /**
   * Load specific level
   */
  loadLevel: function (level) {
    // Reset UI
    $("#editor").show();
    $("#share").hide();
    $("#background, #pond").removeClass("wrap").attr("style", "").empty();
    $("#levelsWrapper").hide();

    // Update level indicators
    $(".level-marker")
      .removeClass("current")
      .eq(this.level)
      .addClass("current");
    $("#level-counter .current").text(this.level + 1);
    $("#level-indicator .total").text(levels.length);

    // Set level content
    this.updateNextLevelBtn();
    $("#before").text(level.before);
    $("#after").text(level.after);
    this.isAdvancing = false;
    $("#next").removeClass("animated animation disabled");
    $("#nextLevelBtn").removeClass("disabled");

    // Fade-in instructions
    var $instructions = $("#instructions");
    $instructions.addClass("level-fade-out");
    setTimeout(function () {
      var instructions = getLevelInstruction(level, game.language);
      $instructions.html(instructions);
      $instructions.removeClass("level-fade-out");
      game.loadDocs();
    }, 150);

    // Update navigation arrows
    $(".arrow.disabled").removeClass("disabled");
    if (this.level === 0) $(".arrow.left").addClass("disabled");
    if (this.level === levels.length - 1)
      $(".arrow.right").addClass("disabled");

    // Load saved answer
    const answer = this.answers[level.name];
    $("#code").val(answer).focus();

    this.setupLevelUI(level);
    this.check();
    this.updateNextLevelBtn();
  },

  /**
   * Setup level-specific UI elements
   */
  setupLevelUI: function (level) {
    const lines = Object.keys(level.style).length;
    $("#code")
      .height(20 * lines)
      .data("lines", lines);

    // Create game board
    const colors = { g: "green", r: "red", y: "yellow" };
    const string = level.board;

    for (let i = 0; i < string.length; i++) {
      const c = string.charAt(i);
      const color = colors[c];

      // Create lilypad
      const lilypad = $("<div/>")
        .addClass("lilypad " + color)
        .css("animation-delay", (i * 0.08) + "s")
        .data("color", color);
      $("<div/>").addClass("bg").appendTo(lilypad);
      $("#background").append(lilypad);

      // Create frog
      const frog = $("<div/>")
        .addClass("frog " + color)
        .css("animation-delay", (i * 0.08) + "s")
        .data("color", color);
      $("<div/>").addClass("bg animated pulse infinite").appendTo(frog);
      $("#pond").append(frog);
    }

    // Apply level classes
    if (level.classes) {
      for (const rule in level.classes) {
        $(rule).addClass(level.classes[rule]);
      }
    }

    // Apply initial styles
    const selector = level.selector || "";
    $("#background " + selector).css(level.style);

    this.changed = false;
    this.applyStyles();
  },

  // ===========================================
  // EVENT HANDLERS
  // ===========================================

  /**
   * Set up all event handlers
   */
  setHandlers: function () {
    // Setelah Play Again, initializeGame() dipanggil lagi. Bersihkan semua
    // handler lama terlebih dahulu agar satu klik hanya diproses satu kali.
    this.unbindHandlers();
    this.bindGameEvents();
    this.bindUIEvents();
    this.bindWindowEvents();
  },

  /**
   * Lepaskan handler yang dapat terpasang ulang ketika game dimulai kembali.
   */
  unbindHandlers: function () {
    $("#next, #nextLevelBtn, #labelReset, #labelSettings, .language-button, .level-marker, .arrow, #level-indicator, #code, #editor")
      .off();
    $(window).off("pagehide hashchange");
    $("body").off("click");
  },

  /**
   * Bind game-specific events
   */
  bindGameEvents: function () {
    // Next button (Cast Spell)
    // $("#next").on("click", function () {
    //   $("#code").focus();

    //   if ($(this).hasClass("disabled")) {
    //     if (!$(".frog").hasClass("animated")) {
    //       game.tryagain();
    //     }
    //     return;
    //   }

    //   $(this).removeClass("animated animation");
    //   $(".frog").addClass("animated bounceOutUp");
    //   $(".arrow, #next").addClass("disabled");

    //   setTimeout(function () {
    //     if (game.level >= levels.length - 1) {
    //       game.endGame();
    //     } else {
    //       game.next();
    //     }
    //   }, 2000);
    // });

    // // Next Level / Finish button
    // $("#nextLevelBtn").on("click", function () {
    //   game.saveAnswer();
    //   if (game.level >= levels.length - 1) {
    //     game.endGame();
    //   } else {
    //     game.next();
    //     game.generateProgressDots();
    //   }
    // });

    // // Code input events
    // $("#code")
    //   .on("keydown", this.handleCodeKeydown.bind(this))
    //   .on("input", this.debounce(this.check.bind(this), 500))
    //   .on("input", function () {
    //     game.changed = true;
    //     $("#next").removeClass("animated animation").addClass("disabled");
    //   });

    // // Animation end event
    // $("#editor").on(
    //   "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
    //   function () {
    //     $(this).removeClass();
    //   },
    // );
    // Tombol Cast Spell (Dihitung sebagai uji coba, menguji visual CSS, dan mencatat data pengujian ke spreadsheet)
    $("#next").off("click").on("click", async function () {
      $("#code").focus();

      // 1. Tambah hitungan percobaan (tries) setiap kali tombol Cast Spell diklik
      const levelId = levels[game.level].name;
      game.levelRunCounts = game.levelRunCounts || {};
      game.levelRunCounts[levelId] = (game.levelRunCounts[levelId] || 0) + 1;
      localStorage.setItem("levelRunCounts", JSON.stringify(game.levelRunCounts));

      // 2. Jalankan & terapkan kode CSS secara visual untuk pengujian
      await game.check();
      game.changed = false;

      // 3. Rekam data pengujian (tries, status saat ini, waktu) ke Spreadsheet
      game.liveSyncData();
    });

    // Next Level / Finish button (Validasi apakah jawaban benar sebelum lanjut)
    $("#nextLevelBtn").on("click", async function () {
      if ($(this).hasClass("disabled") || game.isAdvancing) return;

      const levelId = levels[game.level].name;

      // Jika user langsung klik tombol lanjut tanpa cast spell atau ada perubahan kode, catat percobaan
      game.levelRunCounts = game.levelRunCounts || {};
      if (!game.levelRunCounts[levelId] || game.changed) {
        game.levelRunCounts[levelId] = (game.levelRunCounts[levelId] || 0) + 1;
        localStorage.setItem("levelRunCounts", JSON.stringify(game.levelRunCounts));
      }

      // Evaluasi kode terkini
      await game.check();
      const isSolved = $.inArray(levelId, game.solved) !== -1;

      if (!isSolved) {
        // Jika jawaban belum benar: getarkan editor & tampilkan peringatan kesalahan
        game.tryagain();
        game.showErrorNotification();
        game.liveSyncData();
        return;
      }

      // Jika jawaban benar: tampilkan validasi sukses & animasi sebelum lanjut
      game.isAdvancing = true;
      $(".frog").addClass("animated bounceOutUp");
      $(".arrow, #next, #nextLevelBtn").addClass("disabled");

      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "success",
          title: t("correctTitle", game.language),
          text: t("correctText", game.language),
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: { popup: "swal2-enhanced-popup" },
        });
      }

      setTimeout(function () {
        game.isAdvancing = false;
        game.saveAnswer();
        game.liveSyncData();

        if (game.level >= levels.length - 1) {
          game.endGame();
        } else {
          game.next();
          game.generateProgressDots();
        }
      }, 1600);
    });

    // Code input events
    $("#code")
      .on("keydown", this.handleCodeKeydown.bind(this))
      // PENYEBAB AUTO-RUN DIHAPUS DARI SINI
      // (Sebelumnya ada baris: .on("input", this.debounce(this.check.bind(this), 500))
      .on("input", function () {
        game.changed = true;
        // Pastikan tombol "Cast Spell" selalu bisa diklik setelah mengetik
        $("#next").removeClass("animated animation disabled");
      });

    // Animation end event
    $("#editor").on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        $(this).removeClass();
      },
    );
  },

  /**
   * Bind UI events
   */
  bindUIEvents: function () {
    // Reset button
    $("#labelReset").on("click", function () {
      Swal.fire({
        title: t("resetWarningTitle", game.language),
        text: t("resetWarningText", game.language),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("confirmReset", game.language),
        cancelButtonText: t("cancel", game.language),
        customClass: {
          confirmButton: "swal2-krem-btn",
          cancelButton: "swal2-biru-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          game.resetGame();
          $(".level-marker").removeClass("solved");
        }
      });
    });

    // Settings button
    $("#labelSettings").on("click", function () {
      $("#levelsWrapper").hide();
      $("#instructions .tooltip").remove();
    });

    // Language selector
    $(".language-button").on("click", function () {
      game.setLanguage($(this).data("language"));
    });

    // Tooltip events
    $("body").on("click", function () {
      $(".tooltip").hide();
      clickedCode = null;
    });
  },

  /**
   * Bind window events
   */
  bindWindowEvents: function () {
    $(window)
      .on("pagehide", function () {
        game.saveAndClearSession();
      })
      .on("hashchange", function () {
        var languageFromHash = window.location.hash.substring(1);
        if (["id", "en"].includes(languageFromHash)) {
          game.setLanguage(languageFromHash, true);
        }
      });
  },

  /**
   * Handle keydown events in code editor
   */
  handleCodeKeydown: function (e) {
    if (e.keyCode === 13) {
      // Enter key
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        this.check();
        $("#next").click();
        return;
      }

      const max = $(e.target).data("lines");
      const code = $(e.target).val();
      const trim = code.trim();
      const codeLength = code.split("\n").length;
      const trimLength = trim.split("\n").length;

      if (codeLength >= max) {
        if (codeLength === trimLength) {
          e.preventDefault();
          // $("#next").click();
        } else {
          $("#code").focus().val("").val(trim);
        }
      }
    }
  },

  // ===========================================
  // GAME LOGIC METHODS
  // ===========================================

  /**
   * Apply CSS styles to the pond
   */
  applyStyles: function () {
    const level = levels[this.level];
    const code = $("#code").val();
    const selector = level.selector || "";
    $("#pond " + selector).attr("style", code);
    this.saveAnswer();
  },

  // /**
  //  * Check if current solution is correct
  //  */
  // check: async function () {
  //   if (!document.startViewTransition) {
  //     this.applyStyles();
  //     this.compare();
  //     return;
  //   }

  //   const transition = document.startViewTransition(() => this.applyStyles());
  //   try {
  //     await transition.finished;
  //   } finally {
  //     this.compare();
  //   }
  // },

  // /**
  //  * Compare frog and lilypad positions
  //  */
  // compare: function () {
  //   const level = levels[this.level];
  //   const lilypads = {};
  //   const frogs = {};
  //   let correct = true;

  //   // Get frog positions
  //   $(".frog").each(function () {
  //     const position = $(this).position();
  //     position.top = Math.floor(position.top);
  //     position.left = Math.floor(position.left);

  //     const key = JSON.stringify(position);
  //     const val = $(this).data("color");
  //     frogs[key] = val;
  //   });

  //   // Check if frogs match lilypads
  //   $(".lilypad").each(function () {
  //     const position = $(this).position();
  //     position.top = Math.floor(position.top);
  //     position.left = Math.floor(position.left);

  //     const key = JSON.stringify(position);
  //     const val = $(this).data("color");

  //     if (!(key in frogs) || frogs[key] !== val) {
  //       correct = false;
  //     }
  //   });

  //   // Update UI based on correctness
  //   if (correct) {
  //     if ($.inArray(level.name, this.solved) === -1) {
  //       this.solved.push(level.name);
  //     }
  //     $("[data-level=" + this.level + "]").addClass("solved");
  //     $("#next").removeClass("disabled").addClass("animated animation");
  //   } else {
  //     this.changed = true;
  //     $("#next").removeClass("animated animation").addClass("disabled");
  //   }
  // },

  /**
   * Check if current solution is correct and apply visual styles
   */
  check: async function () {
    try {
      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => this.applyStyles());
        await transition.finished;
      } else {
        this.applyStyles();
      }
    } catch (e) {
      this.applyStyles();
    } finally {
      this.compare();
    }
  },

  /**
   * Compare frog and lilypad positions
   */
  // compare: function () {
  //   const level = levels[this.level];
  //   const lilypads = {};
  //   const frogs = {};
  //   let correct = true;

  //   $(".frog").each(function () {
  //     const position = $(this).position();
  //     position.top = Math.floor(position.top);
  //     position.left = Math.floor(position.left);
  //     frogs[JSON.stringify(position)] = $(this).data("color");
  //   });

  //   $(".lilypad").each(function () {
  //     const position = $(this).position();
  //     position.top = Math.floor(position.top);
  //     position.left = Math.floor(position.left);
  //     const key = JSON.stringify(position);
  //     const val = $(this).data("color");

  //     if (!(key in frogs) || frogs[key] !== val) {
  //       correct = false;
  //     }
  //   });

  //   if (correct) {
  //     if ($.inArray(level.name, this.solved) === -1) {
  //       this.solved.push(level.name);
  //     }
  //     $("[data-level=" + this.level + "]").addClass("solved");
  //     $("#next").removeClass("disabled").addClass("animated animation");
  //   } else {
  //     // Menghapus dari daftar 'solved' jika jawaban diubah menjadi salah
  //     const index = $.inArray(level.name, this.solved);
  //     if (index !== -1) {
  //       this.solved.splice(index, 1);
  //       $("[data-level=" + this.level + "]").removeClass("solved");
  //     }
  //     this.changed = true;
  //     $("#next").removeClass("animated animation").addClass("disabled");
  //   }

  //   // 2. LANGSUNG REKAM/UPDATE KE SPREADSHEET
  //   this.liveSyncData();
  // },
  compare: function () {
    const level = levels[this.level];
    const lilypads = {};
    const frogs = {};
    let correct = true;

    $(".frog").each(function () {
      const position = $(this).position();
      position.top = Math.floor(position.top);
      position.left = Math.floor(position.left);
      frogs[JSON.stringify(position)] = $(this).data("color");
    });

    $(".lilypad").each(function () {
      const position = $(this).position();
      position.top = Math.floor(position.top);
      position.left = Math.floor(position.left);
      const key = JSON.stringify(position);
      const val = $(this).data("color");

      if (!(key in frogs) || frogs[key] !== val) {
        correct = false;
      }
    });

    if (correct) {
      if ($.inArray(level.name, this.solved) === -1) {
        this.solved.push(level.name);
      }
      $("[data-level=" + this.level + "]").addClass("solved");
      $("#next").removeClass("disabled").addClass("animated animation");
    } else {
      const index = $.inArray(level.name, this.solved);
      if (index !== -1) {
        this.solved.splice(index, 1);
        $("[data-level=" + this.level + "]").removeClass("solved");
      }
      $("#next").removeClass("animated animation").addClass("disabled");
    }
  },
  
  /**
   * Sinkronisasi data real-time ke Spreadsheet
   */
  liveSyncData: function (keepalive) {
    const playerName = localStorage.getItem("playerName");
    const playerAbsence = localStorage.getItem("playerAbsence");
    if (!playerName || !playerAbsence) return;
    
    const score = Math.round((this.solved.length / levels.length) * 100);
    
    // Hitung waktu pengerjaan secara live (di-cap maksimal 30 menit)
    let waktuPengerjaan = "N/A";
    if (this.gameStartTime) {
      const elapsedMs = Date.now() - this.gameStartTime;
      const totalSeconds = Math.min(Math.floor(elapsedMs / 1000), 1800);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      waktuPengerjaan = `${mins} menit ${secs < 10 ? "0" : ""}${secs} detik`;
    }
    
    const detailJawaban = levels.map(level => {
        const levelId = level.name;
        const tries = this.levelRunCounts ? (this.levelRunCounts[levelId] || 0) : 0;
        const isSolved = this.solved.includes(levelId);
        return {
            tries: tries,
            status: isSolved ? "Benar" : "Salah"
        };
    });

    const formData = new URLSearchParams();
    formData.append("nama", playerName);
    formData.append("absen", playerAbsence);
    formData.append("skor", score);
    formData.append("waktuPengerjaan", waktuPengerjaan);
    formData.append("detailJawaban", JSON.stringify(detailJawaban));

    fetch(this.googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
      keepalive: Boolean(keepalive),
    }).catch(err => console.error("Sync error:", err));
  },

  /**
   * Save current answer
   */
  saveAnswer: function () {
    const level = levels[this.level];
    this.answers[level.name] = $("#code").val();
  },

  /**
   * Show try again animation
   */
  tryagain: function () {
    $("#editor").addClass("animated shake");
  },

  /**
   * Analisis kode user dan tampilkan notifikasi error yang detail
   */
  showErrorNotification: function () {
    if (typeof Swal === "undefined") return;

    var userCode = $("#code").val().trim();
    var level = levels[this.level];
    var expectedStyle = level.style;
    var errorMessages = [];
    var hints = [];

    // 1. Cek jika kode kosong
    if (userCode === "") {
      Swal.fire({
        icon: "error",
        title: "❌ Kode Kosong!",
        html: '<p style="font-size:0.95em;">Kamu belum mengetikkan kode CSS apapun.</p><p style="font-size:0.85em;color:#94a3b8;margin-top:8px;">Baca instruksi di atas dan tulis properti CSS yang diminta.</p>',
        confirmButtonText: "OK, Saya Coba",
        customClass: { confirmButton: "swal2-biru-btn", popup: "swal2-enhanced-popup" },
      });
      return;
    }

    // 2. Parse kode user menjadi key-value pairs
    var userProps = {};
    var lines = userCode.split("\n");
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li].trim();
      if (line === "") continue;

      // Cek apakah ada titik dua
      if (line.indexOf(":") === -1) {
        errorMessages.push('<code style="color:#f97316;">' + game.escapeHtml(line) + '</code> ' + t("missingColon", game.language));
        continue;
      }

      var parts = line.split(":");
      var prop = parts[0].trim();
      var val = parts.slice(1).join(":").trim();

      // Cek apakah ada titik koma di akhir
      if (!val.endsWith(";")) {
        errorMessages.push('<code style="color:#f97316;">' + game.escapeHtml(prop) + '</code> ' + t("missingSemicolon", game.language));
      }

      // Hapus titik koma untuk perbandingan
      val = val.replace(/;$/, "").trim();
      userProps[prop] = val;
    }

    // 3. Bandingkan dengan expected style
    var expectedKeys = Object.keys(expectedStyle);
    var validCSSProperties = ["justify-content", "align-items", "flex-direction", "flex-wrap", "flex-flow", "align-content", "align-self", "order", "flex-shrink", "flex-basis"];

    for (var ei = 0; ei < expectedKeys.length; ei++) {
      var expectedProp = expectedKeys[ei];
      var expectedVal = expectedStyle[expectedProp];

      if (!(expectedProp in userProps)) {
        // Properti yang dibutuhkan tidak ada
        errorMessages.push('<code style="color:#60a5fa;">' + expectedProp + '</code> ' + t("propertyMissing", game.language));
        hints.push('<code>' + expectedProp + ': ...;</code>');
      } else if (userProps[expectedProp] !== expectedVal) {
        // Nilainya salah - cek apakah mungkin typo
        var userVal = userProps[expectedProp];
        var similarity = game.stringSimilarity(userVal, expectedVal);

        if (similarity > 0.5 && similarity < 1) {
          errorMessages.push('<code style="color:#60a5fa;">' + expectedProp + '</code>: <code style="color:#ef4444;">' + game.escapeHtml(userVal) + '</code> ' + t("valueTypo", game.language));
        } else {
          errorMessages.push('<code style="color:#60a5fa;">' + expectedProp + '</code>: <code style="color:#ef4444;">' + game.escapeHtml(userVal) + '</code> ' + t("valueIncorrect", game.language));
        }
      }
    }

    // 4. Cek properti yang tidak diperlukan
    var userKeys = Object.keys(userProps);
    for (var ui = 0; ui < userKeys.length; ui++) {
      var userProp = userKeys[ui];
      if (!(userProp in expectedStyle)) {
        // Cek apakah properti valid tapi tidak diperlukan
        var isValidCSS = validCSSProperties.indexOf(userProp) !== -1;
        if (isValidCSS) {
          errorMessages.push('<code style="color:#fbbf24;">' + game.escapeHtml(userProp) + '</code> ' + t("propertyNotNeeded", game.language));
        } else {
          // Kemungkinan typo pada nama properti
          var bestMatch = "";
          var bestScore = 0;
          for (var vi = 0; vi < validCSSProperties.length; vi++) {
            var score = game.stringSimilarity(userProp, validCSSProperties[vi]);
            if (score > bestScore) {
              bestScore = score;
              bestMatch = validCSSProperties[vi];
            }
          }
          if (bestScore > 0.5) {
            errorMessages.push('<code style="color:#ef4444;">' + game.escapeHtml(userProp) + '</code> ' + t("propertyTypo", game.language) + ' <code style="color:#10b981;">' + bestMatch + '</code>?');
          } else {
            errorMessages.push('<code style="color:#ef4444;">' + game.escapeHtml(userProp) + '</code> ' + t("invalidProperty", game.language));
          }
        }
      }
    }

    // 5. Tampilkan popup error
    if (errorMessages.length === 0) {
      errorMessages.push(t("incorrectDefault", game.language));
    }

    var errorHtml = '<div style="text-align:left;max-height:300px;overflow-y:auto;">';
    errorHtml += '<div style="font-size:0.9em;color:#cbd5e1;margin-bottom:12px;">' + t("issuesFound", game.language) + ' <strong style="color:#f87171;">' + errorMessages.length + '</strong> ' + t("issuesSuffix", game.language) + '</div>';
    errorHtml += '<ul style="list-style:none;padding:0;margin:0;">';
    for (var mi = 0; mi < errorMessages.length; mi++) {
      errorHtml += '<li style="background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;padding:8px 12px;margin-bottom:6px;border-radius:0 8px 8px 0;font-size:0.88em;line-height:1.5;">' + errorMessages[mi] + '</li>';
    }
    errorHtml += '</ul>';
    if (hints.length > 0) {
      errorHtml += '<div style="margin-top:12px;padding:10px;background:rgba(96,165,250,0.1);border-radius:8px;border:1px solid rgba(96,165,250,0.2);">';
      errorHtml += '<div style="font-size:0.85em;color:#60a5fa;font-weight:bold;margin-bottom:4px;">' + t("hint", game.language) + '</div>';
      errorHtml += '<div style="font-size:0.85em;color:#94a3b8;">' + t("tryAdding", game.language) + ' ' + hints.join(", ") + '</div>';
      errorHtml += '</div>';
    }
    errorHtml += '</div>';

    Swal.fire({
      icon: "error",
      title: t("incorrectTitle", game.language),
      html: errorHtml,
      confirmButtonText: "OK, Saya Perbaiki",
      customClass: { confirmButton: "swal2-biru-btn", popup: "swal2-enhanced-popup" },
      width: 500,
    });
  },

  /**
   * Hitung kemiripan dua string (0-1) untuk deteksi typo
   */
  stringSimilarity: function (s1, s2) {
    if (s1 === s2) return 1;
    if (!s1 || !s2) return 0;
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var longer = s1.length > s2.length ? s1 : s2;
    var shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1;
    var editDist = game.editDistance(longer, shorter);
    return (longer.length - editDist) / longer.length;
  },

  /**
   * Levenshtein edit distance
   */
  editDistance: function (s1, s2) {
    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
      var lastVal = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          var newVal = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
          }
          costs[j - 1] = lastVal;
          lastVal = newVal;
        }
      }
      if (i > 0) costs[s2.length] = lastVal;
    }
    return costs[s2.length];
  },

  /**
   * Escape HTML untuk mencegah XSS
   */
  escapeHtml: function (str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Load CSS documentation tooltips
   */
  loadDocs: function () {
    $("#instructions code").each(function () {
      const code = $(this);
      const text = code.text();

      if (text in docs) {
        code.addClass("help");

        code.on("click", function (e) {
          e.stopPropagation();

          if ($(".tooltip").length !== 0 && clickedCode === code) {
            $(".tooltip").remove();
            return;
          }

          $("#levelsWrapper").hide();
          $(".tooltip").remove();

          const html = docs[text][game.language] || docs[text].id;

          // Ambil posisi elemen <code> di layar
          const offset = code.offset();
          const tooltipX = offset.left;
          const tooltipY = offset.top + code.outerHeight() + 10;

          // Append ke body supaya tidak terbatasi container
          $('<div class="tooltip"></div>')
            .html(html)
            .css({
              top: tooltipY + "px",
              left: tooltipX + "px",
              position: "absolute",
            })
            .appendTo("body");

          $(".tooltip code").on("click", function (event) {
            const pName = text;
            let pValue = event.target.textContent.split(" ")[0];
            pValue = game.getDefaultPropVal(pValue);
            game.writeCSS(pName, pValue);
            game.changed = true;
            $("#next").removeClass("animated animation disabled");
          });

          clickedCode = code;
        });
      }
    });
  },

  /**
   * Get default property value
   */
  getDefaultPropVal: function (pValue) {
    if (pValue === "<integer>") return "0";
    if (pValue === "<flex-direction>") return "row nowrap";
    return pValue;
  },

  /**
   * Write CSS to editor
   */
  writeCSS: function (pName, pValue) {
    const tokens = $("#code")
      .val()
      .trim()
      .split(/[\n:;]+/)
      .filter((i) => i);
    const keywords = Object.keys(docs);
    let content = "";
    let filled = false;

    if (keywords.includes(pValue)) return;

    tokens.forEach((token, i) => {
      const trimmedToken = token.trim();
      if (!keywords.includes(trimmedToken)) return;

      const append = content !== "" ? "\n" : "";
      if (trimmedToken === pName && !filled) {
        filled = true;
        content += append + trimmedToken + ": " + pValue + ";";
      } else if (i + 1 < tokens.length) {
        const val = !keywords.includes(tokens[i + 1].trim())
          ? tokens[i + 1].trim()
          : "";
        content += append + trimmedToken + ": " + val + ";";
      }
    });

    if (!filled) {
      content += content !== "" ? "\n" : "";
      content += pName + ": " + pValue + ";";
    }

    $("#code").val(content).focus();
  },

  /**
   * Change language and retain the selected language for the next visit.
   */
  setLanguage: function (language, skipHashUpdate) {
    if (!["id", "en"].includes(language)) return;

    this.language = language;
    localStorage.setItem("language", language);

    if (!skipHashUpdate && window.location.hash !== "#" + language) {
      window.location.hash = language;
      return;
    }

    this.translate();
    this.loadLevel(levels[this.level]);
  },

  /**
   * Translate interface to selected language.
   */
  translate: function () {
    document.title = t("pageTitle", this.language);
    $("html").attr("lang", this.language);
    $("[data-i18n]").each(function () {
      $(this).text(t($(this).data("i18n"), game.language));
    });
    $("[data-i18n-placeholder]").each(function () {
      $(this).attr("placeholder", t($(this).data("i18n-placeholder"), game.language));
    });

    $(".language-button")
      .removeClass("bg-primary-container text-on-primary-container")
      .addClass("text-on-surface-variant");
    $(".language-button[data-language='" + this.language + "']")
      .removeClass("text-on-surface-variant")
      .addClass("bg-primary-container text-on-primary-container");

    const level = levels[this.level];
    $("#instructions").html(getLevelInstruction(level, this.language));
    this.loadDocs();
  },

  /**
   * Debounce function to limit execution frequency
   */
  debounce: function (func, wait, immediate) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
};

// ===========================================
// INITIALIZATION
// ===========================================

function initializeGame() {
  // Initialize AlertHelper
  AlertHelper.init();

  console.log("📦 Checking dependencies...");
  console.log("jQuery available:", typeof jQuery !== "undefined" ? "✓" : "✗");
  console.log("Swal available:", typeof Swal !== "undefined" ? "✓" : "✗");

  // Wait for SweetAlert2 to load before starting the game
  let checkCount = 0;
  const maxChecks = 100; // 100 * 100ms = 10 seconds

  function startGameWhenReady() {
    if (typeof Swal !== "undefined") {
      // SweetAlert2 is loaded
      AlertHelper.hasSweetAlert = true;
      console.log("✓ SweetAlert2 loaded successfully");
      game.start();
    } else if (checkCount < maxChecks) {
      checkCount++;
      // Wait 100ms and try again
      setTimeout(startGameWhenReady, 100);
    } else {
      // Timeout - SweetAlert2 might not be available
      console.warn(
        "⚠ SweetAlert2 did not load within 10 seconds, using fallback",
      );
      AlertHelper.hasSweetAlert = false;
      game.start();
    }
  }

  startGameWhenReady();
}

// Check if jQuery is ready
if (typeof jQuery !== "undefined") {
  $(document).ready(initializeGame);
} else {
  // Fallback if jQuery doesn't load
  console.error("⚠ jQuery not found, waiting...");
  window.addEventListener("load", initializeGame);
}
