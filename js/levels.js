var levels = [
  {
    name: "Q1",
    instructions: {
      id: "<p>Selamat datang di MagicFlex, sebuah game di mana kamu menempatkan bola sihir dengan menulis kode CSS! Tempatkan bola sihir ini ke portal sihir di sebelah kanan dengan menggunakan properti <code>justify-content</code>, yang menyelaraskan item secara horizontal dan menerima nilai-nilai berikut:</p><ul><li><code>flex-start</code>: Item menyelaras ke sisi kiri kontainer.</li><li><code>flex-end</code>: Item menyelaras ke sisi kanan kontainer.</li><li><code>center</code>: Item menyelaras di tengah kontainer.</li><li><code>space-between</code>: Item ditampilkan dengan jarak yang sama di antara mereka.</li><li><code>space-around</code>: Item ditampilkan dengan jarak yang sama di sekitar mereka.</li></ul><p>Contohnya, <code>justify-content: flex-end;</code> akan memindahkan bola sihir ke kanan.</p>",
    },
    board: "g",
    style: { "justify-content": "flex-end" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q2",
    instructions: {
      id: "<p>Gunakan <code>justify-content</code> lagi untuk menempatkan bola-bola sihir ini ke portalnya. Ingat bahwa properti CSS ini menyelaraskan item secara horizontal dan menerima nilai-nilai berikut:</p><ul><li><code>flex-start</code>: Item menyelaras ke sisi kiri kontainer.</li><li><code>flex-end</code>: Item menyelaras ke sisi kanan kontainer.</li><li><code>center</code>: Item menyelaras di tengah kontainer.</li><li><code>space-between</code>: Item ditampilkan dengan jarak yang sama di antara mereka.</li><li><code>space-around</code>: Item ditampilkan dengan jarak yang sama di sekitar mereka.</li></ul>",
    },
    board: "gy",
    style: { "justify-content": "center" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q3",
    instructions: {
      id: "<p>Tempatkan ketiga bola sihir ke dalam portal menggunakan <code>justify-content</code>. Kali ini, portal sihir memiliki banyak ruang kosong di sekitarnya.</p><p>Jika kamu lupa kemungkinan nilai untuk suatu properti, kamu dapat mengklik nama properti untuk melihatnya. Coba klik pada <code>justify-content</code>.</p>",
    },
    board: "gyr",
    style: { "justify-content": "space-around" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q4",
    instructions: {
      id: "<p>Sekarang portal sihir bergeser ke sudut ruangan. Gunakan <code>justify-content</code> agar bola sihir memiliki jarak yang sama di antara mereka.</p>",
    },
    board: "gyr",
    style: { "justify-content": "space-between" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q5",
    instructions: {
      id: "<p>Sekarang gunakan <code>align-items</code> untuk memindahkan bola sihir ke bagian bawah ruangan sihir. Properti CSS ini menyelaraskan item secara vertikal dan menerima nilai-nilai berikut:</p><ul><li><code>flex-start</code>: Item menyelaras ke bagian atas kontainer.</li><li><code>flex-end</code>: Item menyelaras ke bagian bawah kontainer.</li><li><code>center</code>: Item menyelaras di pusat vertikal kontainer.</li><li><code>baseline</code>: Item ditampilkan pada baseline kontainer.</li><li><code>stretch</code>: Item diregangkan untuk menyesuaikan kontainer.</li></ul>",
    },
    board: "gyr",
    style: { "align-items": "flex-end" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q6",
    instructions: {
      id: "<p>Arahkan bola sihir tepat ke tengah ruangan sihir menggunakan kombinasi <code>justify-content</code> dan <code>align-items</code>.</p>",
    },
    board: "g",
    style: { "justify-content": "center", "align-items": "center" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q7",
    instructions: {
      id: "<p>Bola-bola sihir perlu berpindah ruangan lagi, kali ini portal memiliki banyak ruang di sekitarnya. Gunakan kombinasi <code>justify-content</code> dan <code>align-items</code>.</p>",
    },
    board: "gyr",
    style: { "justify-content": "space-around", "align-items": "flex-end" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q8",
    instructions: {
      id: "<p>Bola sihir perlu disejajarkan dengan urutan portalnya menggunakan <code>flex-direction</code>. Properti CSS ini mendefinisikan arah item ditempatkan dalam kontainer, dan menerima nilai-nilai berikut:</p><ul><li><code>row</code>: Item ditempatkan sama dengan arah teks.</li><li><code>row-reverse</code>: Item ditempatkan berlawanan dengan arah teks.</li><li><code>column</code>: Item ditempatkan dari atas ke bawah.</li><li><code>column-reverse</code>: Item ditempatkan dari bawah ke atas.</li></ul>",
    },
    board: "gyr",
    style: { "flex-direction": "row-reverse" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q9",
    instructions: {
      id: "<p>Tempatkan bola sihir ke portal yang berbentuk kolom (menurun) menggunakan <code>flex-direction</code>. Properti CSS ini mendefinisikan arah item ditempatkan dalam kontainer, dan menerima nilai-nilai berikut:</p><ul><li><code>row</code>: Item ditempatkan sama dengan arah teks.</li><li><code>row-reverse</code>: Item ditempatkan berlawanan dengan arah teks.</li><li><code>column</code>: Item ditempatkan dari atas ke bawah.</li><li><code>column-reverse</code>: Item ditempatkan dari bawah ke atas.</li></ul>",
    },
    board: "gyr",
    style: { "flex-direction": "column" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q10",
    instructions: {
      id: "<p>Tempatkan bola sihir ke portalnya masing-masing. Meskipun terlihat dekat, kamu butuh <code>flex-direction</code> dan <code>justify-content</code> untuk memindahkannya.</p><p>Perhatikan bahwa ketika kamu mengatur arah ke baris atau kolom terbalik, nilai start dan end juga ikut terbalik.</p>",
    },
    board: "gyr",
    style: { "flex-direction": "row-reverse", "justify-content": "flex-end" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q11",
    instructions: {
      id: "<p>Arahkan bola sihir ke portalnya menggunakan <code>flex-direction</code> dan <code>justify-content</code>.</p><p>Perhatikan bahwa ketika arah flex adalah kolom, <code>justify-content</code> berubah fungsinya menjadi penentu arah vertikal dan <code>align-items</code> menjadi horizontal.</p>",
    },
    board: "gyr",
    style: { "flex-direction": "column", "justify-content": "flex-end" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q12",
    instructions: {
      id: "<p>Tempatkan bola sihir ke portalnya menggunakan <code>flex-direction</code> dan <code>justify-content</code>.</p>",
    },
    board: "gyr",
    style: {
      "flex-direction": "column-reverse",
      "justify-content": "space-between",
    },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q13",
    instructions: {
      id: "<p>Pindahkan bola sihir ke portalnya menggunakan <code>flex-direction</code>, <code>justify-content</code>, dan <code>align-items</code>.</p>",
    },
    board: "gyr",
    style: {
      "flex-direction": "row-reverse",
      "justify-content": "center",
      "align-items": "flex-end",
    },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q14",
    instructions: {
      id: "<p>Terkadang membalikkan urutan baris atau kolom kontainer saja tidak cukup. Dalam kasus ini, kita dapat menerapkan properti <code>order</code> pada elemen individual. Secara default, item memiliki nilai 0, tetapi kita dapat menggunakan properti ini untuk mengaturnya ke angka positif atau negatif (-2, -1, 0, 1, 2).</p><p>Gunakan properti <code>order</code> untuk mengatur ulang bola sihir agar sesuai dengan warna portalnya.</p>",
    },
    board: "gyr",
    selector: "> :nth-child(2)",
    classes: { "#galaxy, #background": "wrap" },
    style: { order: "2" },
    before: "#galaxy {\n  display: flex;\n}\n\n.yellow {\n",
    after: "}",
  },
  {
    name: "Q15",
    instructions: {
      id: "<p>Gunakan properti <code>order</code> untuk mengirim bola sihir merah masuk ke portalnya.</p>",
    },
    board: "gggrg",
    selector: "> :nth-child(4)",
    classes: { "#galaxy, #background": "wrap" },
    style: { order: "-1" },
    before: "#galaxy {\n  display: flex;\n}\n\n.red {\n",
    after: "}",
  },
  {
    name: "Q16",
    instructions: {
      id: "<p>Properti lain yang dapat kamu terapkan pada elemen individual adalah <code>align-self</code>. Properti ini menerima nilai yang sama dengan <code>align-items</code> dan nilainya berlaku khusus untuk item tertentu.</p>",
    },
    board: "ggygg",
    selector: "> :nth-child(3)",
    style: { "align-self": "flex-end" },
    before:
      "#galaxy {\n  display: flex;\n  align-items: flex-start;\n}\n\n.yellow {\n",
    after: "}",
  },
  {
    name: "Q17",
    instructions: {
      id: "<p>Kombinasikan <code>order</code> dengan <code>align-self</code> untuk menempatkan bola sihir ke posisinya.</p>",
    },
    board: "ygygg",
    selector: "> .yellow",
    style: { "align-self": "flex-end", order: "2" },
    before:
      "#galaxy {\n  display: flex;\n  align-items: flex-start;\n}\n\n.yellow {\n",
    after: "}",
  },
  {
    name: "Q18",
    instructions: {
      id: "<p>Oh tidak! Semua bola sihir terjepit di satu baris portal. Sebarkan mereka menggunakan properti <code>flex-wrap</code>, yang menerima nilai-nilai berikut:</p><ul><li><code>nowrap</code>: Setiap item disesuaikan dengan satu baris.</li><li><code>wrap</code>: Item membungkus ke baris tambahan.</li><li><code>wrap-reverse</code>: Item membungkus ke baris tambahan secara terbalik.</li></ul>",
    },
    board: "ygggggr",
    style: { "flex-wrap": "wrap" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q19",
    instructions: {
      id: "<p>Susun bola-bola sihir ini menjadi tiga kolom yang rapi menggunakan kombinasi <code>flex-direction</code> dan <code>flex-wrap</code>.</p>",
    },
    board: "gggggrrrrryyyyy",
    style: { "flex-direction": "column", "flex-wrap": "wrap" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q20",
    instructions: {
      id: "<p>Dua properti <code>flex-direction</code> dan <code>flex-wrap</code> sangat sering digunakan bersama, sehingga properti singkat <code>flex-flow</code> dibuat untuk menggabungkannya. Properti ini menerima nilai dari dua properti tersebut yang dipisahkan oleh spasi.</p><p>Misalnya, kamu dapat menggunakan <code>flex-flow: row wrap</code> untuk mengatur baris dan membungkusnya.</p><p>Coba gunakan <code>flex-flow</code> untuk menyelesaikan level sebelumnya.</p>",
    },
    board: "gggggrrrrryyyyy",
    style: { "flex-flow": "column wrap" },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q21",
    instructions: {
      id: "<p>Bola sihir tersebar di seluruh ruangan, tetapi portalnya berkumpul di bagian atas. Kamu bisa menggunakan <code>align-content</code> untuk mengatur bagaimana beberapa baris dipisahkan satu sama lain. Properti ini menerima nilai-nilai berikut:</p><ul><li><code>flex-start</code>: Baris dikemas di bagian atas kontainer.</li><li><code>flex-end</code>: Baris dikemas di bagian bawah kontainer.</li><li><code>center</code>: Baris dikemas di pusat vertikal kontainer.</li><li><code>space-between</code>: Baris ditampilkan dengan jarak yang sama di antara mereka.</li><li><code>space-around</code>: Baris ditampilkan dengan jarak yang sama di sekitar mereka.</li><li><code>stretch</code>: Baris diregangkan untuk menyesuaikan kontainer.</li></ul><p>Ingat, <code>align-content</code> menentukan jarak antar baris, sedangkan <code>align-items</code> menentukan posisi elemen di dalam baris tersebut. Jika hanya ada satu baris, <code>align-content</code> tidak akan memberikan efek apa pun.</p>",
    },
    board: "ggggggggggggggg",
    classes: { "#pond, #background": "wrap" },
    style: { "align-content": "flex-start" },
    before: "#galaxy {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}",
  },
  {
    name: "Q22",
    instructions: {
      id: "<p>Sekarang portal sihirnya berkumpul di bagian bawah. Gunakan <code>align-content</code> untuk memindahkan bola sihir ke sana.</p>",
    },
    board: "ggggggggggggggg",
    classes: { "#pond, #background": "wrap" },
    style: { "align-content": "flex-end" },
    before: "#galaxy {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}",
  },
  {
    name: "Q23",
    instructions: {
      id: "<p>Kombinasikan <code>flex-direction</code> dan <code>align-content</code> untuk mengarahkan barisan bola sihir masuk ke susunan portalnya.</p>",
    },
    board: "rgggyrgggyrgggy",
    classes: { "#pond, #background": "wrap" },
    style: { "flex-direction": "column-reverse", "align-content": "center" },
    before: "#galaxy {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}",
  },
  {
    name: "Q24",
    instructions: {
      id: "<p>Tempatkan bola sihir ke susunan portal ini menggunakan properti CSS yang telah kamu pelajari:</p><ul><li><code>justify-content</code></li><li><code>align-items</code></li><li><code>flex-direction</code></li><li><code>order</code></li><li><code>align-self</code></li><li><code>flex-wrap</code></li><li><code>flex-flow</code></li><li><code>align-content</code></li></ul>",
    },
    board: "rggggyy",
    style: {
      "flex-direction": "column-reverse",
      "flex-wrap": "wrap-reverse",
      "align-content": "space-between",
      "justify-content": "center",
    },
    before: "#galaxy {\n  display: flex;\n",
    after: "}",
  },
  {
    name: "Q25",
    instructions: {
      id: "<p>Ujian Sihir Terakhir! Bola-bola sihir telah tersebar di berbagai dimensi. Gunakan kombinasi properti yang kompleks untuk memasukkan mereka ke portal yang tepat. Perhatikan bahwa beberapa bola sihir memiliki gravitasi berbeda dan memerlukan perlakuan khusus.</p><p>Properti yang mungkin kamu perlukan: <code>flex-direction</code>, <code>flex-wrap</code>, <code>justify-content</code>, <code>align-items</code>, <code>align-content</code> dan <code>order</code>.</p>",
    },
    board: "rrggggbbyyyy",
    style: {
      "flex-direction": "row-reverse",
      "flex-wrap": "wrap-reverse",
      "align-content": "flex-end",
      "justify-content": "space-around",
      "align-items": "stretch",
    },
    before: "#galaxy {\n  display: flex;\n  height: 400px;\n",
    after: "}",
  },
];