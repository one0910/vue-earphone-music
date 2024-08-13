import { useCommonStore } from "@/stores/common"

const singerMap = {
  "Maroon 5": {
    "name": "Maroon 5",
    "desc": "Maroon 5 is an American pop rock band from Los Angeles, California.[3][4] It consists of lead vocalist and guitarist Adam Levine, rhythm guitarist and keyboardist Jesse Carmichael, lead guitarist James Valentine, drummer Matt Flynn, keyboardist PJ Morton and multi-instrumentalist and bassist Sam Farrar. Original members Levine, Carmichael, bassist Mickey Madden, and drummer Ryan Dusick first came together as Kara's Flowers in 1994, while they were in high school.",
  },
  "Charlie Puth": {
    "name": "Charlie Puth",
    "desc": "Charles Otto Puth Jr. (/puːθ/; born December 2, 1991) is an American singer-songwriter. His initial exposure came through the viral success of his song covers uploaded to YouTube. Puth signed with the record label eleveneleven in 2011 after performing on The Ellen DeGeneres Show, during which he contributed songwriting and production work for other artists.",
  },
  "Carly Rae Jepsen": {
    "name": "Carly Rae Jepsen",
    "desc": "Carly Rae Jepsen (born November 21, 1985)[2][3] is a Canadian singer and songwriter. After studying musical theatre for most of her school life and while in university, Jepsen garnered mainstream attention after placing third on the fifth season of Canadian Idol in 2007. In 2008, Jepsen released her folk-influenced debut studio album Tug of War in Canada before it was internationally released in 2011.",
  },
  "Echosmith": {
    "name": "Echosmith",
    "desc": `Echosmith is an American all-sibling alternative pop band formed in Toluca Lake, Los Angeles, in February 2009. The group is best known for their song Cool Kids, which reached number 13 on the Billboard Hot 100 and was certified double platinum in the United States and Australia. The band's debut album, Talking Dreams, was released on October 8, 2013. Their second album "Lonely Generation" was released on January 10, 2020.`,
  },
  "Taylor Swift": {
    "name": "Taylor Swift",
    "desc": `Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter. Recognized for her genre-spanning discography, songwriting, and artistic reinventions, Swift is a prominent cultural figure who has been cited as an influence on a generation of music artists.`,
  },
  "Madonna": {
    "name": "Madonna",
    "desc": `Madonna Louise Ciccone (born August 16, 1958) is an American singer-songwriter, dancer, actress, author, director, philanthropist, businesswoman, record producer, film director, and humanitarian. Madonna was born in Bay City, Michigan, but she moved to New York City in 1977 to pursue a career in modern dance.`,
  },
  "Meghan Trainor": {
    "name": "Meghan Trainor",
    "desc": `Meghan Elizabeth Trainor (born December 22, 1993) is an American singer-songwriter and television personality. She rose to prominence after signing with Epic Records in 2014 and releasing her debut single "All About That Bass", which reached number one on the U.S. Billboard Hot 100 chart and sold 11 million copies worldwide. Trainor has released six studio albums with the label and has received various accolades, including the 2016 Grammy Award for Best New Artist.`,
  },
  "Freya Lim": {
    "name": "Freya Lim",
    "desc": `Freya Lim (Chinese: 林凡; pinyin: Lin Fan; Pe̍h-ōe-jī: Lîm Hoân; born 20 November 1979), also known as Freya Lin, is a Malaysian Mandopop singer and radio deejay based in Taiwan. She is a Taiwanese PR. Her father is a Chinese Malaysian and her mother is a Taiwanese.`,
  },
  "SISTAR": {
    "name": "SISTAR",
    "desc": `Sistar (Korean: 씨스타; stylized in all caps) was a South Korean girl group formed in 2010 by Starship Entertainment. The group consisted of Hyolyn, Bora, Soyou and Dasom. They made their official debut with the song "Push Push" on 3 June 2010.Their debut studio album So Cool was released on 9 August 2011.`,
  },
  "防彈少年團": {
    "name": "BTS",
    "desc": `BTS (Korean: 방탄소년단; RR: Bangtan Sonyeondan; lit. Bulletproof Boy Scouts), also known as the Bangtan Boys, is a South Korean boy band formed in 2010. The band consists of Jin, Suga, J-Hope, RM, Jimin, V, and Jungkook, who co-write or co-produce much of their material.`,
  },
  "Lovelyz": {
    "name": "Lovelyz",
    "desc": `Lovelyz (Korean: 러블리즈) is a South Korean girl group formed in 2014 by Woollim Entertainment and is the company's first girl group. The group consists of eight members: Baby Soul, Jiae, Jisoo, Mijoo, Kei, Jin, Sujeong and Yein. Their debut album, Girls' Invasion, was released on November 17, 2014.`,
  },
  "Apink": {
    "name": "Apink",
    "desc": `Apink (Korean: 에이핑크; RR: Eipingkeu; Japanese: エーピンク) is a South Korean girl group formed by IST Entertainment, (formerly Play M Entertainment, A Cube Entertainment, and Plan A Entertainment) and managed by Choi Creative Lab as of April, 2024.`,
  },
  "徐英真": {
    "name": "Suh Young-Eun",
    "desc": `Suh Young-Eun, born in Seoul, South Korea in 1973, is a renowned South Korean singer. A graduate of Biology from Catholic University of Korea, she made her debut in the Korean music industry in 1998 with her first full-length album, "Softly whispering "I Love U"". Her unique voice, characterized by its sincere sorrow and crystal-clear clarity, has earned her immense popularity. Additionally, Seo has contributed to numerous popular Korean drama soundtracks.`,
  },
  "CNBLUE": {
    "name": "CNBLUE",
    "desc": `CNBLUE (씨엔블루) is a three-member pop rock boy band under FNC Entertainment. They began as an indie band in Japan, releasing their first mini-album Now or Never on August 18, 2009 and later debuted in Korea on January 14, 2010 with the mini-album Bluetory.`,
  },
  "KARA": {
    "name": "KARA",
    "desc": `Kara (Korean: 카라; Japanese: カラ; often stylized in all caps) /ˈkɑːrə/ is a South Korean girl group formed by DSP Media in 2007. The group's current lineup is Gyuri, Seungyeon, Nicole, Jiyoung, and Youngji.`,
  },
  "TWICE": {
    "name": "TWICE",
    "desc": `Twice (Korean: 트와이스; RR: Teuwaiseu; Japanese: トゥワイス, Hepburn: Tuwaisu; commonly stylized in all caps) is a South Korean girl group formed by JYP Entertainment.`,
  },
  "宇多田光": {
    "name": "Hikaru Utada",
    "desc": `Hikaru Utada (宇多田 ヒカル, Utada Hikaru, born January 19, 1983), also known by the mononym Utada,[2] is an American and Japanese singer, songwriter and producer. Utada is one of the most influential, bestselling musical artists in Japan.`,
  },
  "B'z": {
    "name": "B'z",
    "desc": `B'z (Japanese: ビーズ, Hepburn: Bīzu) is a Japanese rock duo consisting of guitarist, composer and producer Takahiro "Tak" Matsumoto and vocalist and lyricist Koshi Inaba, known for their energetic hard rock tracks and pop rock ballads.`,
  },
  "生物股長": {
    "name": "Ikimonogakari",
    "desc": `Ikimonogakari (いきものがかり) is a musical group founded on February 1, 1999, by Mizuno Yoshiki and Yamashita Hotaka, who had attended the same primary, junior high, and high schools. The name "Ikimonogakari" comes from the fact that they were both first-year elementary school students who worked together as "students in charge of feeding animals".`,
  },
  "靈魂出竅": {
    "name": "Soul'd Out",
    "desc": `Soul'd Out (usually styled as SOUL'd OUT) was a Japanese hip-hop trio, consisting of Diggy-MO' (MC), Bro.Hi (MC/Beatboxer), and Shinnosuke (DJ). Their name is a portmanteau of "soul" and "sold out", and the group is sometimes referred to by their initials, S.O. On 30 January 2014, the group announced on Facebook that they would disband after their final album, To From, was released on 9 April 2014.`,
  },
  "Every Little Thing": {
    "name": "Every Little Thing",
    "desc": `Every Little Thing (also known as ELT by their fans) is a pop/soft rock duo from Japan who debuted in August 1996 with the release of their first single called "Feel My Heart". Their name is usually written in English, and only rarely in katakana.`,
  },
  "西村由紀江": {
    "name": "Yukie Nishimura",
    "desc": `Yukie Nishimura (西村 由紀江, Nishimura Yukie, born May 8, 1967 in Toyonaka, Osaka) is a prolific Japanese pianist and compos`,
  },
  "海淪珍尼": {
    "name": "Helen Chen",
    "desc": ``,
  },
  "西斯派瑟": {
    "name": "Cissy Spicer",
    "desc": ``,
  },
  "伊莉莎白卡蜜拉": {
    "name": "Elizabeth Camilla",
    "desc": ``,
  },
  "Dua  LaLa": {
    "name": "Dua LaLa",
    "desc": ``,
  },
  "珍妮 伯孜": {
    "name": "Jenny Bozzi",
    "desc": ``,
  },
  "雅各利亞": {
    "name": "Jacob Ria",
    "desc": ``,
  },
  "派特少年": {
    "name": "Pat Boy",
    "desc": ``,
  },
} || { "name": "", "desc": "" }

const singerAlbum = {
  "V": {
    "name": "V",
    "desc": `2013-2014; Conway Studios, Hollywood Kingston Sound, Los Angeles Luke's in the Boo, Malibu Matzah Ball, New York City MXM Studios, Stockholm Patriot Studios, Denver Record Plant, Los Angeles`,
  },
  "Voicenotes": {
    "name": "Voicenotes",
    "desc": `Voicenotes is Charlie Puth's second studio album that was released on May 11, 2018 by Artist Partners and Atlantic Records.`,
  },
  "Curiosity": {
    "name": "Curiosity",
    "desc": `Curiosity was the intended sophomore studio album from Carly Rae Jepsen, set to be released on February 14th 2012 through 604 Records, exclusively in Canada.`,
  },
  "Talking Dreams": {
    "name": "Talking Dreams",
    "desc": `Talking Dreams is the debut studio album by American indie pop band Echosmith. The album was released on October 1, 2013, through Warner Bros. Records.[5] All songs on the album were co-written by the four Sierota siblings and their father, Jeffery David.`,
  },
  "Red": {
    "name": "Red",
    "desc": `Red (occasionally stylized as RED) is the fourth studio album by American singer and songwriter Taylor Swift, released on October 22, 2012, through Big Machine Records. The title is the color to which Swift associated the tumultuous emotions she was experiencing from lost love while conceiving the album.`,
  },
  "Hard Candy": {
    "name": "Hard Candy",
    "desc": `Hard Candy is Madonna's 12th studio album that was released on April 19, 2006 by Warner Bros. Records.`,
  },
  "Tilite": {
    "name": "Tilite",
    "desc": `Title is the fourth studio album and debut major-label studio album by Meghan Trainor. The album released on January 9, 2015, by record label Epic. The album comes after the success of her debut single "All About That Bass" which had peaked atop of the Billboard Hot 100.`,
  },
  "非愛不可": {
    "name": "Freya's Love Songs",
    "desc": `Freya's Love Songs (Chinese: 非愛不可。心林凡) is the third studio album of Taiwan-born Malaysian Mandopop artist Freya Lim (Chinese: 林凡). It was released on 3 August 2007 by Linfair Records.`,
  },
  "SHAKE IT": {
    "name": "SHAKE IT",
    "desc": `Shake It is the third extended play by South Korean girl group Sistar. It was released on June 22, 2015, by Starship Entertainment and distributed by LOEN Entertainment.`,
  },
  "Permission to Dance": {
    "name": "Permission to Dance",
    "desc": `"Permission to Dance" is a song by South Korean boy band BTS. It was released through Big Hit Music and Sony Music on July 9, 2021, as a stand-alone single.`,
  },
  "lovelyz8": {
    "name": "lovelyz8",
    "desc": `Lovelyz8 is the first extended play by South Korean girl group Lovelyz. It was released on October 1, 2015.The EP contains seven tracks with the title track "Ah-Choo" and pre-release single "Shooting Star".`,
  },
  "Pink MEMORY": {
    "name": "Pink MEMORY",
    "desc": `Pink Memory (stylized as Pink MEMORY) is the second full-length studio album by South Korean girl group Apink. It was released on July 16, 2015. The title track, "Remember", was used to promote the album.`,
  },
  "서진영 - The Best ": {
    "name": "서진영 - The Best ",
    "desc": `In 2004, Suh Young-Eun delighted fans with a compilation album featuring a curated selection of her most memorable tracks. The album includes soundtracks from beloved Korean dramas like "Nine-Tailed Fox" and "Summer Scent."`,
  },
  "Bluetory": {
    "name": "Bluetory",
    "desc": `Bluetory is the Korean debut mini-album by South Korean pop-rock idol band CNBLUE. It was released on January 14, 2010, under FNC Music and distributed by Mnet Media. After being signed to the record label, the quartet was sent to Japan, where it independently released two mini-albums.`,
  },
  "Revolution": {
    "name": "Revolution",
    "desc": `Revolution is the second studio album and second Korean material release by South Korean girl group Kara, released on July 30, 2009, by DSP Media.`,
  },
  "TWICEcoaster: LANE 1": {
    "name": "TWICEcoaster: LANE 1",
    "desc": `Twicecoaster: Lane 1 is the third extended play (EP) by South Korean girl group Twice. The EP was released digitally and physically on October 24, 2016, by JYP Entertainment and distributed by KT Music.`,
  },
  "First Love": {
    "name": "First Love",
    "desc": `"First Love" is a song by the Japanese-American singer-songwriter Hikaru Utada. It was released on April 28, 1999, as the third Japanese language single from her second studio album, First Love, which was issued a month previously. It was certified double platinum for 800,000 copies shipped to stores in Japan.`,
  },
  "The Best ULTRA Pleasure": {
    "name": "The Best ULTRA Pleasure",
    "desc": `B'z The Best "Ultra Pleasure" is a compilation double-album by the Japanese hard rock duo B'z. It was released on June 18, 2008, and it is part of their 20th anniversary celebration. It peaked at #1 at Oricon charts and Billboard Japan Top Albums`,
  },
  "啟程之歌": {
    "name": "Hajimari no Uta",
    "desc": `Hajimari no Uta (ハジマリノウタ, First Song) is the fourth studio album by Ikimonogakari, released in Japan on December 23, 2009. A limited edition version included a bonus DVD with footage from their concert "Ikimono Gakari no Minasan, Konni Tour!! 2009 - My song Your song -" performance on May 25, 2009 at Shibuya C.C. Lemon Hall, plus special booklet, and ikimono card 017.`,
  },
  "Flip Side Collection": {
    "name": "Flip Side Collection",
    "desc": `This compilation album is a chronological collection of B-sides, including previously released singles and unreleased tracks from the artist's discography.`,
  },
  "COMPLETE": {
    "name": "COMPLETE",
    "desc": `Every Little Thing has unveiled their most comprehensive collection of singles to date, titled "Every Best Single ~COMPLETE~".`,
  },
  "看見幸福": {
    "name": "Seeing Happiness",
    "desc": `Yukie Nishimura's 2002 compilation album, "Seeing Happiness," featuring her greatest hits.`,
  },
  "Indie-Rock": {
    "name": "Indie-Rock",
    "desc": `Hot Sketch, a band that expertly blends alternative, folk, and rock, consistently delivers new songs that paint a delightful picture of a leisurely afternoon in the city.`,
  },
  "深夜安眠曲": {
    "name": "Midnight Serenade",
    "desc": `If you've ever dreamed of a highway escape, then you need to listen to Shark Psychedelic. Their live performances create an urgent sense that they could drop their guitars and hit the road at any moment. With their new sound, they're offering a fresh take on what it means to be a band. Their cinematic journey is just beginning.`,
  },
  "Where's my Moustache": {
    "name": "Where's my Moustache",
    "desc": `As a street musician, Elizabeth Camilla has evolved from folk to a blend of jazz and blues, transforming inner demons into playful musical creatures. She's also challenged the boundaries of street music, exploring more diverse and open-minded themes. Her unique perspective is making waves in the independent music scene.`,
  },
  "Dua  Lipa": {
    "name": "Dua LaLa",
    "desc": `Pop has never been so dangerous, and it's never been so sweet. Dua Lipa, the global pop sensation, has rewritten the rules of the UK music industry, winning the MTV Europe Music Award for Best New Act. Her ability to capture the feelings of a generation has made her a style icon and a role model for young women worldwide.`,
  },
  "Thank You": {
    "name": "Thank You",
    "desc": `In the grimy corners of the city, it's rare to find a band as raw and engaging as Seal Police. Their music is full of imperfections that somehow make it all the more charming. Seeing them live is never a dull experience.`,
  },
  "鯊魚二世": {
    "name": "Shark II",
    "desc": `Album Description: If you've ever dreamed of a highway escape, then you need to listen to Shark Psychedelic. Their live performances create an urgent sense that they could drop their guitars and hit the road at any moment. With their new sound, they're offering a fresh take on what it means to be a band. Their cinematic journey is just beginning.`,
  },
  "龐貝城中沒人": {
    "name": "No One in Pompeii",
    "desc": `This album is a more polished effort compared to their previous works, but don't let that fool you. This chaotic band still packs a punch with their raw punk energy and noisy undertones. Tracks like "Fake Rock Star" show their disregard for outside opinions and their commitment to staying true to themselves.`,
  },
} || ""

const transferField = (field) => {
  const fieldMap = {
    'albumSinger': '歌手名稱',
    'albumName': '專輯名稱',
    'albumCoverImgUrl': '專輯封面',
    'email': 'email',
    'password': '密碼',
    'albumGenre': '專輯類型',
    'albumDesc': '專輯描述',
  }[field]
  return fieldMap || field
}

export const transRequiredField = (field) => {
  const { language } = useCommonStore()
  if (language === 'zh') {
    return `${transferField(field)}欄位不可為空白`
  }
  return `The field ${field} is required.`
}

export const transMinField = (field) => {
  const { language } = useCommonStore()
  if (language === 'zh') {
    return `${transferField(field)}欄位所輸入文字長度太短`
  }
  return `The field ${field} is too short`
}

export const transMaxField = (field) => {
  const { language } = useCommonStore()
  if (language === 'zh') {
    return `${transferField(field)}欄位所輸入文字長度太長`
  }
  return `The field ${field} is too long`
}

export const transSingerName = (singer) => {
  if (!singer) {
    return
  }
  const { language } = useCommonStore()
  if (language === 'zh') {
    return singer
  } else {
    return singerMap[singer] && singerMap[singer]["name"]
  }
}

export const transSingerDesc = (singer, singerDesc) => {
  if (!singer) {
    return
  }
  const { language } = useCommonStore()
  if (language === 'zh') {
    return singerDesc
  } else {
    return singerMap[singer] && singerMap[singer]["desc"]
  }
}


export const transAlbumName = (albumName) => {
  if (!albumName) {
    return
  }
  const { language } = useCommonStore()
  if (language === 'zh') {
    return albumName
  } else {
    return singerAlbum[albumName] && singerAlbum[albumName]['name']
  }
}

export const transAlbumDesc = (albumName, albumDesc) => {
  if (!albumName) {
    return
  }
  const { language } = useCommonStore()
  if (language === 'zh') {
    return albumDesc
  } else {
    return singerAlbum[albumName]['desc']
  }
}

export const transSingerName_fund = (singer, type, temp) => {
  const { language } = useCommonStore()
  if (!singer) {
    return
  }

  if (type === 'member_fundraising' && temp === true && language === 'en') {
    return singerMap[singer]["name"]
  } else if (type === 'member_fundraising') {
    return singer
  }
}

export const transSingerDesc_fund = (singer, singerDesc, type, temp) => {
  const { language } = useCommonStore()
  if (!singer) {
    return
  }

  if (type === 'member_fundraising' && temp === true && language === 'en') {
    return singerMap[singer]["desc"]
  } else if (type === 'member_fundraising') {
    return singerDesc
  }
}

export const transAlbumName_fund = (albumName, type, temp) => {
  const { language } = useCommonStore()
  if (!albumName) {
    return
  }

  if (type === 'member_fundraising' && temp === true && language === 'en') {
    return singerAlbum[albumName]["name"]
  } else if (type === 'member_fundraising') {
    return albumName
  }
}

export const transAlbumDesc_fund = (albumName, albumDesc, type, temp) => {
  const { language } = useCommonStore()
  if (!albumName) {
    return
  }

  if (type === 'member_fundraising' && temp === true && language === 'en') {
    return singerAlbum[albumName]["desc"]
  } else if (type === 'member_fundraising') {
    return albumDesc
  }
}