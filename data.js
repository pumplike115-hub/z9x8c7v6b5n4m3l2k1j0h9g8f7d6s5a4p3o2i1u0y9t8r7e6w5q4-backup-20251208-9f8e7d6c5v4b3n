// ===== DATA CONFIGURATION =====
// วิธีใส่ข้อมูล:
// - code: รหัสเรื่อง (จำเป็น)
// - actress: ชื่อนักแสดง (ถ้าไม่มีใส่ "" หรือไม่ต้องใส่)
// - cover: URL รูปปก (ถ้าไม่มีใส่ "" หรือไม่ต้องใส่)
// - link: URL ลิงค์ไปหน้าอื่น (ถ้าไม่มีใส่ "" หรือไม่ต้องใส่)
// - rank: อันดับ 1, 2, 3 (ใส่เฉพาะ 3 อันดับแรก)
//
// ตัวอย่าง:
// { code: "ABC-123", actress: "ชื่อนักแสดง", cover: "https://...", link: "https://...", rank: 1 },
// { code: "XYZ-999", actress: "ชื่อนักแสดง", cover: "https://..." },
// { code: "DEF-456" },  // มีแค่โค๊ด ไม่มีรูป ไม่มีนักแสดง

const data = [
    // ===== TOP 3 RANKING =====
    { code: "SSIS-402", actress: "Yamate Ria", cover: "https://img72.pixhost.to/images/45/283985539_i523757.jpg", link: "", rank: 1 },
    { code: "ROYD-002", actress: "Fukada Eimi", cover: "https://img41.pixhost.to/images/327/145626660_i431829.jpg", link: "", rank: 2 },
    { code: "STARS-928", actress: "Ogura Yuna", cover: "https://img90.pixhost.to/images/601/395876705_i583565.jpg", link: "", rank: 3 },

    // ===== GALLERY ITEMS (มีรูป) =====
    { code: "SQIS-001", actress: "นักแสดงหลายคน", cover: "https://img23.pixhost.to/images/254/82220960_i378010.jpg", link: "" },
    { code: "STARS-682", actress: "Ogura Yuna", cover: "https://img76.pixhost.to/images/121/303726392_i536103.jpg", link: "" },
    { code: "DASS-360", actress: "Tachibana Mary", cover: "https://img94.pixhost.to/images/492/454612206_i597679.jpg", link: "" },
    { code: "DVAJ-633", actress: "Totsuki Ruisa", cover: "https://img90.pixhost.to/images/601/395877059_i583761.jpg", link: "" },
    { code: "DASS-414", actress: "Yumino Rimu", cover: "https://img96.pixhost.to/images/464/479026683_i607141.jpg", link: "" },
    { code: "EBWH-001", actress: "Fujimori Riho", cover: "https://img88.pixhost.to/images/286/367209851_i571326.jpg", link: "" },
    { code: "WAAA-576", actress: "Shiromine Miu", cover: "https://img1.pixhost.to/images/8425/637316681_i652088.jpg", link: "" },
    { code: "IPZZ-119", actress: "Sakura Momo, Ano Yuzuko", cover: "https://img89.pixhost.to/images/1025/385035212_i580406.jpg", link: "" },
    { code: "HMN-612", actress: "Mitani Akane", cover: "https://img0.pixhost.to/images/20/518868896_i618804.jpg", link: "" },
    { code: "MIDE-975", actress: "Takahashi Shouko", cover: "https://img62.pixhost.to/images/57/239774429_i498380.jpg", link: "" },
    { code: "SDMM-167", actress: "นักแสดงหลายคน", cover: "https://img95.pixhost.to/images/137/462049305_i601058.jpg", link: "" },
    { code: "MEYD-532", actress: "Kirishima Reona", cover: "https://img34.pixhost.to/images/372/120090138_i408928.jpg", link: "" },
    { code: "NUKA-73", actress: "Iori Tomoyo", cover: "https://img86.pixhost.to/images/466/562636080_i630360.jpg", link: "" },
    { code: "PFES-057", actress: "Sano Yuma", cover: "https://img94.pixhost.to/images/873/458417639_i598571.jpg", link: "" },
    { code: "LULU-324", actress: "Aoi Yurika", cover: "https://img98.pixhost.to/images/219/494097200_i610937.jpg", link: "" },
    { code: "MIAB-385", actress: "Tsujii Honoka", cover: "https://img5.pixhost.to/images/2992/568878341_i631976.jpg", link: "" },
    { code: "ROE-019", actress: "Ichikawa Kyouko", cover: "https://img63.pixhost.to/images/58/245159712_i502132.jpg", link: "" },
    { code: "DASS-551", actress: "Fujimori Riho", cover: "https://img86.pixhost.to/images/466/562637235_i631043.jpg", link: "" },
    { code: "IPZZ-023", actress: "Akari Tsumugi", cover: "https://img85.pixhost.to/images/42/345281939_i560223.jpg", link: "" },
    { code: "IPX-900", actress: "Sakura Momo", cover: "https://img74.pixhost.to/images/58/292733255_i529300.jpg", link: "" },
    { code: "AVOP-014", actress: "Akai Mitsuki", cover: "https://img10.pixhost.to/images/62/43206393_i240083.jpg", link: "" },
    { code: "IPX-608", actress: "Kuriyama Rio", cover: "https://img50.pixhost.to/images/203/187047007_i468093.jpg", link: "" },
    { code: "MIAB-154", actress: "Hatano Yui", cover: "https://img95.pixhost.to/images/137/462047564_i600289.jpg", link: "" },
    { code: "MIMK-159", actress: "Itsukaichi Mei", cover: "https://img95.pixhost.to/images/494/465638777_i603073.jpg", link: "" },
    { code: "MIDV-818", actress: "Arata Arina", cover: "https://img97.pixhost.to/images/278/500227399_i612647.jpg", link: "" },
    { code: "HND-991", actress: "Maeda Momoko", cover: "https://img55.pixhost.to/images/64/208897508_i482684.jpg", link: "" },
    { code: "DVMM-258", actress: "", cover: "https://img1.pixhost.to/images/6579/612396887_i645340.jpg", link: "" },
    { code: "WAAA-065", actress: "Maeda Momoko", cover: "https://img55.pixhost.to/images/64/208898524_i483078.jpg", link: "" },
    { code: "SKMJ-652", actress: "Tachibana Kyouka, Miike Koharu", cover: "https://img1.pixhost.to/images/6938/618123435_i647234.jpg", link: "" },
    { code: "SDMM-207", actress: "", cover: "https://img1.pixhost.to/images/8786/641742799_i654351.jpg", link: "" },
    { code: "SHKD-897", actress: "Fukada Eimi", cover: "https://img41.pixhost.to/images/56/143334224_i430437.jpg", link: "" },
    { code: "DVMM-276", actress: "นักแสดงหลายคน", cover: "https://img1.pixhost.to/images/7685/628281296_i650009.jpg", link: "" },
    { code: "PPPD-340", actress: "Julia", cover: "https://img10.pixhost.to/images/47/42984336_i257576.jpg", link: "" },
    { code: "CAWD-630", actress: "Shitara Yuuhi", cover: "https://img94.pixhost.to/images/129/450567367_i595576.jpg", link: "" },
    { code: "SONE-740", actress: "Sasakura Aya", cover: "https://img1.pixhost.to/images/5115/589061275_i638795.jpg", link: "" },
    { code: "ABP-123", actress: "Sakai Momoka", cover: "https://img10.pixhost.to/images/84/43564632_i233158.jpg", link: "" },
    { code: "GVH-549", actress: "Totsuki Ruisa", cover: "https://img87.pixhost.to/images/426/357610350_i567202.jpg", link: "" },
    { code: "SSIS-586", actress: "Saika Kawakita", cover: "https://img87.pixhost.to/images/426/357610350_i567202.jpg", link: "" },

    // ===== CODE ONLY (ไม่มีรูป) =====
    { code: "IKUIKU-012", actress: "", cover: "", link: "" },
    { code: "OREC-473", actress: "", cover: "", link: "" },
    { code: "MFCS-018", actress: "", cover: "", link: "" },
    { code: "SSNI-663", actress: "", cover: "", link: "" },
    { code: "MDON-084", actress: "", cover: "", link: "" },
    { code: "CAWD-044", actress: "", cover: "", link: "" },
    { code: "carribeancom 071415-920", actress: "", cover: "", link: "" },
    { code: "ran ichinose", actress: "ran ichinose", cover: "", link: "" },
    { code: "Momoka Sakai(酒井ももか) 080815_130", actress: "Momoka Sakai", cover: "", link: "" },
    { code: "SKMJ-652", actress: "นักแสดงหลายคน", cover: "", link: "" },
    { code: "CWPBD-112", actress: "Mitsuki Akai", cover: "", link: "" },
];





