var dashboardTranslations = {
  id: {
    title: "MagicFlex - Belajar CSS Flexbox dengan Game Interaktif",
    texts: {
      "Beranda": "Beranda",
      "Tutorial": "Tutorial",
      "Materi": "Materi",
      "Tentang Kami": "Tentang Kami",
      "Ikuti petualangan sihir yang menakjubkan untuk menguasai Flexbox, dari tingkat dasar hingga mahir.": "Ikuti petualangan sihir yang menakjubkan untuk menguasai Flexbox, dari tingkat dasar hingga mahir.",
      "Mulai Petualangan": "Mulai Petualangan",
      "Tutorial Penggunaan MagicFlex": "Tutorial Penggunaan MagicFlex",
      "Pelajari dasar-dasar Flexbox dengan video panduan interaktif kami.": "Pelajari dasar-dasar Flexbox dengan video panduan interaktif kami.",
      "Materi Pembelajaran": "Materi Pembelajaran",
      "Kuasai konsep-konsep Flexbox melalui penjelasan praktis dan interaktif": "Kuasai konsep-konsep Flexbox melalui penjelasan praktis dan interaktif",
      "Mulai Belajar": "Mulai Belajar",
      "Lihat Semua Bahan Ajar": "Lihat Semua Bahan Ajar",
      "© 2026 MagicFlex. Semua hak dilindungi.": "© 2026 MagicFlex. Semua hak dilindungi.",
      heroBackgroundAlt: "Latar Dunia Sihir MagicFlex",
      languageSelectorLabel: "Pilih bahasa",
      aboutDescription: "Website <span class=\"font-bold text-primary\">MagicFlex</span> dibuat sebagai media pembelajaran interaktif untuk memahami <span class=\"italic text-tertiary\">Flexbox CSS</span> dalam dunia sihir."
    }
  },
  en: {
    title: "MagicFlex - Learn CSS Flexbox with an Interactive Game",
    texts: {
      "Beranda": "Home",
      "Tutorial": "Tutorial",
      "Materi": "Learning Materials",
      "Tentang Kami": "About Us",
      "Ikuti petualangan sihir yang menakjubkan untuk menguasai Flexbox, dari tingkat dasar hingga mahir.": "Embark on a magical adventure to master Flexbox, from beginner to advanced.",
      "Mulai Petualangan": "Start the Adventure",
      "Tutorial Penggunaan MagicFlex": "How to Use MagicFlex",
      "Pelajari dasar-dasar Flexbox dengan video panduan interaktif kami.": "Learn the basics of Flexbox with our interactive video guide.",
      "Materi Pembelajaran": "Learning Materials",
      "Kuasai konsep-konsep Flexbox melalui penjelasan praktis dan interaktif": "Master Flexbox concepts through practical, interactive explanations.",
      "Mulai Belajar": "Start Learning",
      "Lihat Semua Bahan Ajar": "View All Learning Materials",
      "© 2026 MagicFlex. Semua hak dilindungi.": "© 2026 MagicFlex. All rights reserved.",
      heroBackgroundAlt: "MagicFlex Magical World Background",
      languageSelectorLabel: "Choose language",
      aboutDescription: "<span class=\"font-bold text-primary\">MagicFlex</span> is an interactive learning platform designed to help you understand <span class=\"italic text-tertiary\">CSS Flexbox</span> in a magical world."
    }
  }
};

function translateDashboard(language) {
  var selectedLanguage = dashboardTranslations[language] ? language : "id";
  var dictionary = dashboardTranslations[selectedLanguage].texts;
  document.documentElement.lang = selectedLanguage;
  document.title = dashboardTranslations[selectedLanguage].title;

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(function (node) {
    if (!node.__dashboardSourceText) {
      node.__dashboardSourceText = node.nodeValue.trim().replace(/\s+/g, " ");
    }

    var sourceText = node.__dashboardSourceText;
    if (!dictionary[sourceText]) return;

    var leadingWhitespace = node.nodeValue.match(/^\s*/)[0];
    var trailingWhitespace = node.nodeValue.match(/\s*$/)[0];
    node.nodeValue = leadingWhitespace + dictionary[sourceText] + trailingWhitespace;
  });

  document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
    element.innerHTML = dictionary[element.dataset.i18nHtml] || element.innerHTML;
  });

  document.querySelectorAll("[data-i18n-alt]").forEach(function (element) {
    element.alt = dictionary[element.dataset.i18nAlt] || element.alt;
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
    element.setAttribute("aria-label", dictionary[element.dataset.i18nAriaLabel] || element.getAttribute("aria-label"));
  });
}
