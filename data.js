var databaseIsObfuscated = false;
var verificationToken = "t28=";

var sourceData = [
    {
        "c": "SSIS-402",
        "a": "Yamate Ria",
        "cv": "https://img72.pixhost.to/images/45/283985539_i523757.jpg",
        "lk": "",
        "r": 1
    },
    {
        "c": "ROYD-002",
        "a": "Fukada Eimi",
        "cv": "https://img41.pixhost.to/images/327/145626660_i431829.jpg",
        "lk": "",
        "r": 2
    },
    {
        "c": "STARS-928",
        "a": "Ogura Yuna",
        "cv": "https://img90.pixhost.to/images/601/395876705_i583565.jpg",
        "lk": "",
        "r": 3
    },
    {
        "c": "SQIS-001",
        "a": "นักแสดงหลายคน",
        "cv": "https://img23.pixhost.to/images/254/82220960_i378010.jpg",
        "lk": ""
    },
    {
        "c": "STARS-682",
        "a": "Ogura Yuna",
        "cv": "https://img76.pixhost.to/images/121/303726392_i536103.jpg",
        "lk": ""
    },
    {
        "c": "DASS-360",
        "a": "Tachibana Mary",
        "cv": "https://img94.pixhost.to/images/492/454612206_i597679.jpg",
        "lk": ""
    },
    {
        "c": "DVAJ-633",
        "a": "Totsuki Ruisa",
        "cv": "https://img90.pixhost.to/images/601/395877059_i583761.jpg",
        "lk": ""
    },
    {
        "c": "DASS-414",
        "a": "Yumino Rimu",
        "cv": "https://img96.pixhost.to/images/464/479026683_i607141.jpg",
        "lk": ""
    },
    {
        "c": "EBWH-001",
        "a": "Fujimori Riho",
        "cv": "https://img88.pixhost.to/images/286/367209851_i571326.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-576",
        "a": "Shiromine Miu",
        "cv": "https://img1.pixhost.to/images/8425/637316681_i652088.jpg",
        "lk": ""
    },
    {
        "c": "IPZZ-119",
        "a": "Sakura Momo, Ano Yuzuko",
        "cv": "https://img89.pixhost.to/images/1025/385035212_i580406.jpg",
        "lk": ""
    },
    {
        "c": "HMN-612",
        "a": "Mitani Akane",
        "cv": "https://img0.pixhost.to/images/20/518868896_i618804.jpg",
        "lk": ""
    },
    {
        "c": "MIDE-975",
        "a": "Takahashi Shouko",
        "cv": "https://img62.pixhost.to/images/57/239774429_i498380.jpg",
        "lk": ""
    },
    {
        "c": "MEYD-532",
        "a": "Kirishima Reona",
        "cv": "https://img34.pixhost.to/images/372/120090138_i408928.jpg",
        "lk": ""
    },
    {
        "c": "PFES-057",
        "a": "Sano Yuma",
        "cv": "https://img94.pixhost.to/images/873/458417639_i598571.jpg",
        "lk": ""
    },
    {
        "c": "LULU-324",
        "a": "Aoi Yurika",
        "cv": "https://img98.pixhost.to/images/219/494097200_i610937.jpg",
        "lk": ""
    },
    {
        "c": "MIAB-385",
        "a": "Tsujii Honoka",
        "cv": "https://img5.pixhost.to/images/2992/568878341_i631976.jpg",
        "lk": ""
    },
    {
        "c": "DASS-551",
        "a": "Fujimori Riho",
        "cv": "https://img86.pixhost.to/images/466/562637235_i631043.jpg",
        "lk": ""
    },
    {
        "c": "IPZZ-023",
        "a": "Akari Tsumugi",
        "cv": "https://img85.pixhost.to/images/42/345281939_i560223.jpg",
        "lk": ""
    },
    {
        "c": "IPX-900",
        "a": "Sakura Momo",
        "cv": "https://img74.pixhost.to/images/58/292733255_i529300.jpg",
        "lk": ""
    },
    {
        "c": "AVOP-014",
        "a": "Akai Mitsuki",
        "cv": "https://img10.pixhost.to/images/62/43206393_i240083.jpg",
        "lk": ""
    },
    {
        "c": "MIAB-154",
        "a": "Hatano Yui",
        "cv": "https://img95.pixhost.to/images/137/462047564_i600289.jpg",
        "lk": ""
    },
    {
        "c": "MIMK-159",
        "a": "Itsukaichi Mei",
        "cv": "https://img95.pixhost.to/images/494/465638777_i603073.jpg",
        "lk": ""
    },
    {
        "c": "HND-991",
        "a": "Maeda Momoko",
        "cv": "https://img55.pixhost.to/images/64/208897508_i482684.jpg",
        "lk": ""
    },
    {
        "c": "DVMM-258",
        "a": "นักแสดงหลายคน",
        "cv": "https://img1.pixhost.to/images/6579/612396887_i645340.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-065",
        "a": "Maeda Momoko",
        "cv": "https://img55.pixhost.to/images/64/208898524_i483078.jpg",
        "lk": ""
    },
    {
        "c": "SKMJ-652",
        "a": "Tachibana Kyouka, Miike Koharu",
        "cv": "https://img1.pixhost.to/images/6938/618123435_i647234.jpg",
        "lk": ""
    },
    {
        "c": "SHKD-897",
        "a": "Fukada Eimi",
        "cv": "https://img41.pixhost.to/images/56/143334224_i430437.jpg",
        "lk": ""
    },
    {
        "c": "DVMM-276",
        "a": "นักแสดงหลายคน",
        "cv": "https://img1.pixhost.to/images/7685/628281296_i650009.jpg",
        "lk": ""
    },
    {
        "c": "PPPD-340",
        "a": "Julia",
        "cv": "https://img10.pixhost.to/images/47/42984336_i257576.jpg",
        "lk": ""
    },
    {
        "c": "CAWD-630",
        "a": "Shitara Yuuhi",
        "cv": "https://img94.pixhost.to/images/129/450567367_i595576.jpg",
        "lk": ""
    },
    {
        "c": "SONE-740",
        "a": "Sasakura Aya",
        "cv": "https://img1.pixhost.to/images/5115/589061275_i638795.jpg",
        "lk": ""
    },
    {
        "c": "GVH-549",
        "a": "Totsuki Ruisa",
        "cv": "https://img87.pixhost.to/images/426/357610350_i567202.jpg",
        "lk": ""
    },
    {
        "c": "SSIS-586",
        "a": "Saika Kawakita",
        "cv": "https://img82.pixhost.to/images/0/330687764_i552068.jpg",
        "lk": ""
    },
    {
        "c": "NDRA-059",
        "a": "Mihara Honoka",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ndra059/ndra059pl.jpg",
        "lk": ""
    },
    {
        "c": "MXGS-705",
        "a": "Kinami Hina",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/h_068mxgs705/h_068mxgs705pl.jpg",
        "lk": ""
    },
    {
        "c": "IKUIKU-012",
        "a": "Otori Miyu",
        "cv": "https://www.xnxxx.ch/wp-content/uploads/2025/01/%E0%B8%9B%E0%B8%81-xnxxx_%E0%B9%90%E0%B9%91_%E0%B9%92%E0%B9%94_%E0%B9%92%E0%B9%90%E0%B9%92%E0%B9%95.webp",
        "lk": ""
    },
    {
        "c": "OREC-473",
        "a": "Reona Kirishima",
        "cv": "https://media-cdn2.avjoy.me/media/avjoytmb/tmb/3748/default.jpg",
        "lk": "",
        "p": "53% top"
    },
    {
        "c": "MFCS-018",
        "a": "Fujii Ranran, Mitsumi An",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2022/05/pb_e_435mfcs-018.jpg",
        "lk": ""
    },
    {
        "c": "SSNI-663",
        "a": "Miru (Sakamichi Miru)",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ssni663/ssni663pl.jpg",
        "lk": ""
    },
    {
        "c": "MDON-084",
        "a": "Meguri",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2025/10/mdon00084pl.jpg",
        "lk": ""
    },
    {
        "c": "CAWD-044",
        "a": "Itou Mayuki",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/9cawd044/9cawd044pl.jpg",
        "lk": ""
    },
    {
        "c": "ran ichinose",
        "a": "ran ichinose",
        "cv": "https://www.adultdvdmarketplace.com/images/medium/363627.jpg",
        "lk": ""
    },
    {
        "c": "080815_130",
        "a": "Momoka Sakai",
        "cv": "https://warashi-asian-pornstars.fr/WAPdB-img/pornostars-f-galeries/32000/32816/large/wapdb-momoka-sakai-pornostar-asiatique.warashi-asian-pornstars.fr-32816-002.jpg",
        "lk": "",
        "p": "left"
    },
    {
        "c": "734-REONA-01",
        "a": "Reona Kirishima",
        "cv": "https://pics.dmm.co.jp/digital/amateur/scute944/scute944jp-001.jpg",
        "lk": "",
        "p": "90% top"
    },
    {
        "c": "FJIN-073",
        "a": "Mizukawa Jun",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/fjin073/fjin073pl.jpg",
        "lk": ""
    },
    {
        "c": "DVAJ-719",
        "a": "Marumo Rea",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dvaj719/dvaj719pl.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-427",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/waaa427/waaa427pl.jpg",
        "lk": ""
    },
    {
        "c": "MIKR-031",
        "a": "Mori Hinako",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mikr031/mikr031pl.jpg",
        "lk": ""
    },
    {
        "c": "ROYD-295",
        "a": "Momonaga Sarina",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/royd295/royd295pl.jpg",
        "lk": ""
    },
    {
        "c": "SONE-963",
        "a": "Azuma Mika",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/sone963/sone963pl.jpg",
        "lk": ""
    },
    {
        "c": "SDMF-037",
        "a": "Aoi Mirei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/1sdmf037/1sdmf037pl.jpg",
        "lk": ""
    },
    {
        "c": "SSIS-887",
        "a": "Hongou Ai",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ssis887/ssis887pl.jpg",
        "lk": ""
    },
    {
        "c": "JUQ-969",
        "a": "Tachibana Mary",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/juq969/juq969pl.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-497",
        "a": "Mori Hinako",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/waaa497/waaa497pl.jpg",
        "lk": ""
    },
    {
        "c": "START-542",
        "a": "Kamiki Rei",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2026/04/1start542pl.jpg",
        "lk": ""
    },
    {
        "c": "MAAN-930",
        "a": "Itsukaichi Mei",
        "cv": "https://www.javdatabase.com/covers/full/h_/h_1711maan00930pl.webp",
        "lk": ""
    },
    {
        "c": "DCV-298",
        "a": "Fukuhara Mina",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2026/04/pb_e_277dcv-298.jpg",
        "lk": "",
        "p": "0% top"
    },
    {
        "c": "MEYD-927",
        "a": "Amami Tsubasa",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/meyd927/meyd927pl.jpg",
        "lk": ""
    },
    {
        "c": "HUNTC-424",
        "a": "นักแสดงหลายคน",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/huntc424/huntc424pl.jpg",
        "lk": ""
    },
    {
        "c": "SDMM-220",
        "a": "นักแสดงหลายคน",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2026/01/1sdmm00220pl.jpg",
        "lk": ""
    },
    {
        "c": "IPZZ-051",
        "a": "Amami Tsubasa",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ipzz051/ipzz051pl.jpg",
        "lk": ""
    },
    {
        "c": "MIDA-179",
        "a": "Ichinose Aoi",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2025/05/mida179pl.jpg",
        "lk": ""
    },
    {
        "c": "MKMP-636",
        "a": "Minasuki Hikaru",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mkmp636/mkmp636pl.jpg",
        "lk": ""
    },
    {
        "c": "ROYD-146",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/royd146/royd146pl.jpg",
        "lk": ""
    },
    {
        "c": "DASS-787",
        "a": "Tachibana Mary",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dass787/dass787pl.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-639",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/waaa639/waaa639pl.jpg",
        "lk": ""
    },
    {
        "c": "SONE-655",
        "a": "Nosaka Hiyori",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/sone655/sone655pl.jpg",
        "lk": ""
    },
    {
        "c": "MMGH-077",
        "a": "นักแสดงหลายคน",
        "cv": "https://pics.dmm.co.jp/digital/video/1mmgh00077/1mmgh00077jp-2.jpg",
        "lk": "",
        "p": "middle"
    },
    {
        "c": "FC2PPV-4889972",
        "a": "ไม่รู้จัก",
        "cv": "https://img.supjav.com/images/2026/04/FC2PPV-4889972-1.jpg",
        "lk": "",
        "p": "middle"
    },
    {
        "c": "IPX-971",
        "a": "Akari Tsumugi",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ipx971/ipx971pl.jpg",
        "lk": ""
    },
    {
        "c": "HSODA-113",
        "a": "Ogura Hikari",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/hsoda113/hsoda113pl.jpg",
        "lk": ""
    },
    {
        "c": "HMN-784",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/hmn784/hmn784pl.jpg",
        "lk": ""
    },
    {
        "c": "MMPV-002",
        "a": "Minase Akari",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mmpv002/mmpv002pl.jpg",
        "lk": ""
    },
    {
        "c": "HMN-653",
        "a": "Nanase Arisu",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/hmn653/hmn653pl.jpg",
        "lk": ""
    },
    {
        "c": "DASS-374",
        "a": "Mitani Akane",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dass374/dass374pl.jpg",
        "lk": ""
    },
    {
        "c": "MURD-339",
        "a": "Hana Himesaki",
        "cv": "https://pics.dmm.co.jp/digital/video/mudr00339/mudr00339pl.jpg",
        "lk": ""
    },
    {
        "c": "DVAJ-648",
        "a": "Ouka Rin",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dvaj648/dvaj648pl.jpg",
        "lk": ""
    },
    {
        "c": "IPZZ-440",
        "a": "Fujisaku Mai",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ipzz440/ipzz440pl.jpg",
        "lk": ""
    },
    {
        "c": "SONE-529",
        "a": "Murakami Yuuka",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/sone529/sone529pl.jpg",
        "lk": ""
    },
    {
        "c": "NACT-117",
        "a": "Sasakura Aya",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/h_237nact117/h_237nact117pl.jpg",
        "lk": ""
    },
    {
        "c": "MXGS-1408",
        "a": "Matsumaru Kasumi",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/h_068mxgs1408/h_068mxgs1408pl.jpg",
        "lk": ""
    },
    {
        "c": "MILK-277",
        "a": "Minase Akari",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/h_1240milk277/h_1240milk277pl.jpg",
        "lk": ""
    },
    {
        "c": "MVSD-487",
        "a": "Yuki Rino",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mvsd487/mvsd487pl.jpg",
        "lk": ""
    },
    {
        "c": "HOMA-077",
        "a": "Kirishima Reona",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/homa077/homa077pl.jpg",
        "lk": ""
    },
    {
        "c": "SONE-763",
        "a": "Kawakita Saika",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/9sone763/9sone763pl.jpg",
        "lk": ""
    },
    {
        "c": "NMSL-025",
        "a": "Ouka Rin",
        "cv": "https://javgg.net/wp-content/uploads/2025/11/nmsl-025.jpg",
        "lk": ""
    },
    {
        "c": "ADN-733",
        "a": "Fujimori Riho",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/adn733/adn733pl.jpg",
        "lk": ""
    },
    {
        "c": "ATID-481",
        "a": "Niimura Akari",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/atid481/atid481pl.jpg",
        "lk": ""
    },
    {
        "c": "MIKR-069",
        "a": "Mori Hinako",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mikr069/mikr069pl.jpg",
        "lk": ""
    },
    {
        "c": "HMN-639",
        "a": "Nanase Arisu",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/hmn639/hmn639pl.jpg",
        "lk": ""
    },
    {
        "c": "ADN-746",
        "a": "Shiromine Miu",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/adn746/adn746pl.jpg",
        "lk": ""
    },
    {
        "c": "SAME-217",
        "a": "Aoi Yurika,Minasuki Hikaru",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/same217/same217pl.jpg",
        "lk": ""
    },
    {
        "c": "JUR-753",
        "a": "Satsuki Nao",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/jur753/jur753pl.jpg",
        "lk": ""
    },
    {
        "c": "PJAM-026",
        "a": "Oka Rin",
        "cv": "https://cdn.javmiku.com/wp-content/uploads/2025/11/h_1814nmsl00025pl.jpg",
        "lk": ""
    },
    {
        "c": "SSIS-535",
        "a": "Yamate Ria",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ssis535/ssis535pl.jpg",
        "lk": ""
    },
    {
        "c": "SONE-053",
        "a": "Nanatsumori Riri",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/sone053/sone053pl.jpg",
        "lk": ""
    },
    {
        "c": "HMN-733",
        "a": "Kasui Jun",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/hmn733/hmn733pl.jpg",
        "lk": ""
    },
    {
        "c": "DASD-710",
        "a": "Fukada Eimi",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dasd710/dasd710pl.jpg",
        "lk": ""
    },
    {
        "c": "DASS-116",
        "a": "Mitani Akane",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dass116/dass116pl.jpg",
        "lk": ""
    },
    {
        "c": "START-237",
        "a": "Kamiki Rei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/1start237/1start237pl.jpg",
        "lk": ""
    },
    {
        "c": "SY-190",
        "a": "Melody Hiina Marks",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/h_113sy190/h_113sy190pl.jpg",
        "lk": ""
    },
    {
        "c": "PFES-107",
        "a": "Fuua Kaede,Mitsuha Ashitaba",
        "cv": "https://javgg.net/wp-content/uploads/2025/06/pfes-107.jpg",
        "lk": ""
    },
    {
        "c": "JUR-176",
        "a": "Fujimori Riho",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/jur176/jur176pl.jpg",
        "lk": ""
    },
    {
        "c": "DVAJ-533",
        "a": "Fujimori Riho",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dvaj533so/dvaj533sopl.jpg",
        "lk": ""
    },
    {
        "c": "EYAN-204",
        "a": "Miyamoto Rui",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/eyan204/eyan204pl.jpg",
        "lk": ""
    },
    {
        "c": "FC2-PPV4903350",
        "a": "Aya",
        "cv": "https://ffjav.com/download/2026/202605/FC2-PPV-4903350.jpg",
        "lk": ""
    },
    {
        "c": "HAWA-334",
        "a": "Mori Hinako",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/1hawa334/1hawa334pl.jpg",
        "lk": ""
    },
    {
        "c": "WAAA-653",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/waaa653/waaa653pl.jpg",
        "lk": ""
    },
    {
        "c": "ROYD-327",
        "a": "Otori Miyu",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/royd327/royd327pl.jpg",
        "lk": ""
    },
    {
        "c": "MIDA-590",
        "a": "Momota Mitsuki,Shino Mayu",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/mida590/mida590pl.jpg",
        "lk": ""
    },
    {
        "c": "IPX-727",
        "a": "Amami Tsubasa",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ipx727/ipx727pl.jpg",
        "lk": ""
    },
    {
        "c": "DVAJ-711",
        "a": "Kokonoi Sunao",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dvaj711/dvaj711pl.jpg",
        "lk": ""
    },
    {
        "c": "SSIS-804",
        "a": "Yamate Ria",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ssis804/ssis804pl.jpg",
        "lk": ""
    },
    {
        "c": "IPX-770",
        "a": "Kanami Mai",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ipx770/ipx770pl.jpg",
        "lk": ""
    },
    {
        "c": "ROYD-174",
        "a": "Itsukaichi Mei",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/royd174/royd174pl.jpg",
        "lk": ""
    },
    {
        "c": "SSIS-951",
        "a": "Kawakita Saika",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/ssis951/ssis951pl.jpg",
        "lk": ""
    },
    {
        "c": "SNOS-207",
        "a": "Watanabe Hono",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/snos207/snos207pl.jpg",
        "lk": ""
    },
    {
        "c": "DASS-029",
        "a": "",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/dass029/dass029pl.jpg",
        "lk": ""
    },
    {
        "c": "CJOD-439",
        "a": "",
        "cv": "https://pics.dmm.co.jp/mono/movie/adult/cjod439/cjod439pl.jpg",
        "lk": ""
    }
];

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const _t3 = sourceData.filter(d => d.r && d.r <= 3).sort((a, b) => a.r - b.r);
const _rest = shuffleArray(sourceData.filter(d => !d.r || d.r > 3));
var data = [..._t3, ..._rest];

if (typeof window !== 'undefined') {
    window.databaseIsObfuscated = databaseIsObfuscated;
    window.verificationToken = verificationToken;
    window.sourceData = sourceData;
    window.data = data;
}
