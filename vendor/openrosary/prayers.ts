// Language configuration
export type Language = 'en' | 'id';
export type PrayerLanguage = Language | 'la';

export interface LanguageOption {
    code: Language;
    label: string;
    nativeLabel: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
    { code: 'en', label: 'English', nativeLabel: 'EN' },
    { code: 'id', label: 'Indonesian', nativeLabel: 'ID' },
];

export interface PrayerLanguageOption {
    code: PrayerLanguage;
    label: string;
    nativeLabel: string;
}

export const AVAILABLE_PRAYER_LANGUAGES: PrayerLanguageOption[] = [
    { code: 'en', label: 'English', nativeLabel: 'EN' },
    { code: 'id', label: 'Indonesian', nativeLabel: 'ID' },
    { code: 'la', label: 'Latin', nativeLabel: 'LA' },
];

// Common Prayers - English (1:1 from Android app)
export const PRAYERS_EN = {
    signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",

    apostlesCreed: "I believe in God, the Father Almighty, Creator of Heaven and earth; and in Jesus Christ, His only Son, our Lord; Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into Hell; the third day He arose again from the dead; He ascended into Heaven, and is seated at the right hand of God, the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",

    ourFather: "Our Father, who art in Heaven, hallowed be Thy name; Thy Kingdom come, Thy will be done on earth as it is in Heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",

    hailMary: "Hail Mary, full of grace. The Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",

    hailMaryFaith: "For the virtue of our Faith - Hail Mary, full of grace. The Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",

    hailMaryHope: "For the virtue of our Hope - Hail Mary, full of grace. The Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",

    hailMaryCharity: "For the virtue of our Charity - Hail Mary, full of grace. The Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",

    gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",

    fatimaPrayer: "O my Jesus, forgive us our sins, save us from the fires of Hell, lead all souls to Heaven, especially those in most need of Thy mercy. Amen.",

    hailHolyQueen: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope! To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary! Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ.",

    rosaryPrayer: "Let us pray. O God, whose only begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech Thee, that by meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ Our Lord. Amen.",
};

// Common Prayers - Indonesian (1:1 from Android app)
export const PRAYERS_ID = {
    signOfCross: "Dalam nama Bapa, dan Putra, dan Roh Kudus. Amin.",

    apostlesCreed: "Aku percaya akan Allah, Bapa yang mahakuasa, Pencipta langit dan bumi; dan akan Yesus Kristus, Putra-Nya yang tunggal, Tuhan kita; yang dikandung dari Roh Kudus, dilahirkan oleh Perawan Maria; yang menderita sengsara dalam pemerintahan Pontius Pilatus, disalibkan, wafat dan dimakamkan; yang turun ke tempat penantian, pada hari ketiga bangkit dari antara orang mati; yang naik ke surga, duduk di sebelah kanan Allah Bapa yang mahakuasa; dari situ Ia akan datang mengadili orang yang hidup dan yang mati. Aku percaya akan Roh Kudus, Gereja Katolik yang kudus, persekutuan para kudus, pengampunan dosa, kebangkitan badan, kehidupan kekal. Amin.",

    ourFather: "Bapa kami yang ada di surga, dimuliakanlah nama-Mu. Datanglah kerajaan-Mu. Jadilah kehendak-Mu di atas bumi seperti di dalam surga. Berilah kami rejeki pada hari ini, dan ampunilah kesalahan kami, seperti kami pun mengampuni yang bersalah kepada kami. Dan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat. Amin.",

    hailMary: "Salam, Maria penuh rahmat, Tuhan sertamu. Terpujilah engkau di antara wanita dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini sekarang dan waktu kami mati. Amin.",

    hailMaryFaith: "Salam Putri Allah Bapa.\n\nSalam, Maria penuh rahmat, Tuhan sertamu. Terpujilah engkau di antara wanita dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini sekarang dan waktu kami mati. Amin.",

    hailMaryHope: "Salam Bunda Allah Putra.\n\nSalam, Maria penuh rahmat, Tuhan sertamu. Terpujilah engkau di antara wanita dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini sekarang dan waktu kami mati. Amin.",

    hailMaryCharity: "Salam Mempelai Allah Roh Kudus.\n\nSalam, Maria penuh rahmat, Tuhan sertamu. Terpujilah engkau di antara wanita dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini sekarang dan waktu kami mati. Amin.",

    gloryBe: "Kemuliaan kepada Bapa, dan Putra, dan Roh Kudus. Seperti pada permulaan, sekarang, dan selalu, dan sepanjang segala abad. Amin.\n\nTerpujilah nama Yesus, Maria, dan Yosef. Sekarang dan selama-lamanya. Amin.",

    fatimaPrayer: "Ya Yesus yang baik, ampunilah dosa-dosa kami. Selamatkanlah kami dari api neraka, dan hantarlah jiwa-jiwa ke surga, terlebih jiwa-jiwa yang sangat membutuhkan kerahiman-Mu. Amin.",

    hailHolyQueen: "Salam, ya Ratu, Bunda yang berbelas kasih, hidup, hiburan dan harapan kami. Kepadamu kami berseru, kami anak-anak yang malang yang dikeluarkan dari Eden. Kami semua memanjatkan permohonan, kami amat susah, mengeluh, mengesah dalam lembah duka ini. Arahkanlah pandangan mata belas kasihmu kepada kami, ya pembela kami yang murah hati, dan setelah pembuangan kami ini, tunjukkanlah kepada kami buah rahimmu yang kudus, Yesus. Ya Perawan Maria yang pengampun, penuh kasih, dan manis. Doakanlah kami, ya Santa Bunda Allah, supaya kami dapat menikmati janji Kristus. Amin.",

    rosaryPrayer: "Marilah berdoa. Ya Allah, yang Putra tunggal-Mu, dengan hidup, wafat dan kebangkitan-Nya, telah memperoleh bagi kami pahala kehidupan kekal, kami mohon, agar dengan merenungkan peristiwa-peristiwa Rosario Suci Santa Perawan Maria, kami dapat meneladan apa yang dikandungnya dan memperoleh apa yang dijanjikan-Nya. Demi Kristus, pengantara kami. Amin.",
};

// Latin prayers follow the traditional forms (cf. EWTN's Latin Prayers of the
// Rosary, preces-latinae Rosarium, St. Mary's Latin Rosary card):
// quotidianum, Hevae, O mi Iesu / libera nos ab igne inferni Fatima,
// "Pro augmento fidei/spei/caritatis" intros, merged V/R versicle. Kept in
// sync with Android values/prayers.xml + values-in/prayers.xml Latin strings.
export const PRAYERS_LA = {
    signOfCross: "In nomine Patris, et Filii, et Spiritus Sancti. Amen.",

    apostlesCreed: "Credo in Deum, Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium Eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.",

    ourFather: "Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.",

    hailMary: "Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. Amen.",

    hailMaryFaith: "Pro augmento fidei. Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. Amen.",

    hailMaryHope: "Pro augmento spei. Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. Amen.",

    hailMaryCharity: "Pro augmento caritatis. Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc, et in hora mortis nostrae. Amen.",

    gloryBe: "Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.",

    fatimaPrayer: "O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae misericordiae tuae maxime indigent. Amen.",

    hailHolyQueen: "Salve, Regina, Mater misericordiae, vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, O pia, O dulcis Virgo Maria. Ora pro nobis, sancta Dei Genetrix, ut digni efficiamur promissionibus Christi.",

    rosaryPrayer: "Oremus. Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit, concede, quaesumus, ut haec mysteria sacratissimo beatae Mariae Virginis Rosario recolentes, et imitemur quod continent, et quod promittunt assequamur. Per eundem Christum Dominum nostrum. Amen.",
};

// Prayer Titles - English
export const PRAYER_TITLES_EN = {
    signOfCross: "Sign of the Cross",
    apostlesCreed: "Apostles' Creed",
    ourFather: "Our Father",
    hailMary: "Hail Mary",
    hailMaryFaith: "Hail Mary (1/3)",
    hailMaryHope: "Hail Mary (2/3)",
    hailMaryCharity: "Hail Mary (3/3)",
    gloryBe: "Glory Be",
    fatimaPrayer: "Fatima Prayer",
    hailHolyQueen: "Hail Holy Queen",
    rosaryPrayer: "Rosary Prayer",
};

// Prayer Titles - Indonesian (1:1 from Android app)
export const PRAYER_TITLES_ID = {
    signOfCross: "Tanda Salib",
    apostlesCreed: "Syahadat Para Rasul",
    ourFather: "Bapa Kami",
    hailMary: "Salam Maria",
    hailMaryFaith: "Salam Maria (1/3)",
    hailMaryHope: "Salam Maria (2/3)",
    hailMaryCharity: "Salam Maria (3/3)",
    gloryBe: "Kemuliaan / Terpujilah",
    fatimaPrayer: "Doa Fatima",
    hailHolyQueen: "Salam Ya Ratu",
    rosaryPrayer: "Doa Penutup Rosario",
};

export const PRAYER_TITLES_LA = {
    signOfCross: "Signum Crucis",
    apostlesCreed: "Symbolum Apostolorum",
    ourFather: "Pater Noster",
    hailMary: "Ave Maria",
    hailMaryFaith: "Ave Maria (1/3)",
    hailMaryHope: "Ave Maria (2/3)",
    hailMaryCharity: "Ave Maria (3/3)",
    gloryBe: "Gloria Patri",
    fatimaPrayer: "Oratio Fatimae",
    hailHolyQueen: "Salve Regina",
    rosaryPrayer: "Oratio Rosarii",
};

// Get prayers by language
export function getPrayers(lang: PrayerLanguage = 'en') {
    if (lang === 'id') return PRAYERS_ID;
    if (lang === 'la') return PRAYERS_LA;
    return PRAYERS_EN;
}

// Get prayer titles by language
export function getPrayerTitles(lang: PrayerLanguage = 'en') {
    if (lang === 'id') return PRAYER_TITLES_ID;
    if (lang === 'la') return PRAYER_TITLES_LA;
    return PRAYER_TITLES_EN;
}

// Backward compatibility - default to English
export const PRAYERS = PRAYERS_EN;
export const PRAYER_TITLES = PRAYER_TITLES_EN;

// Mysteries - English
interface Mystery {
    title: string;
    description: string;
}

const JOYFUL_MYSTERIES_EN: Mystery[] = [
    {
        title: "The Annunciation",
        description: "Reading: Luke 1:26-38 (ESV)\n\nIn the sixth month the angel Gabriel was sent from God to a city of Galilee named Nazareth, to a virgin betrothed to a man whose name was Joseph, of the house of David. And the virgin's name was Mary. And he came to her and said, \"Greetings, favored one, the Lord is with you!\" But she was greatly troubled at the saying, and tried to discern what sort of greeting this might be. And the angel said to her, \"Do not be afraid, Mary, for you have found favor with God. And behold, you will conceive in your womb and bear a son, and you shall call his name Jesus. He will be great and will be called the Son of the Most High. And the Lord God will give to him the throne of his father David, and he will reign over the house of Jacob forever, and of his kingdom there will be no end.\" And Mary said to the angel, \"How will this be, since I am a virgin?\" And the angel answered her, \"The Holy Spirit will come upon you, and the power of the Most High will overshadow you; therefore the child to be born will be called holy—the Son of God. And behold, your relative Elizabeth in her old age has also conceived a son, and this is the sixth month with her who was called barren. For nothing will be impossible with God.\" And Mary said, \"Behold, I am the servant of the Lord; let it be to me according to your word.\" And the angel departed from her."
    },
    {
        title: "The Visitation",
        description: "Reading: Luke 1:39-45 (ESV)\n\nIn those days Mary arose and went with haste into the hill country, to a town in Judah, and she entered the house of Zechariah and greeted Elizabeth. And when Elizabeth heard the greeting of Mary, the baby leaped in her womb. And Elizabeth was filled with the Holy Spirit, and she exclaimed with a loud cry, \"Blessed are you among women, and blessed is the fruit of your womb! And why is this granted to me that the mother of my Lord should come to me? For behold, when the sound of your greeting came to my ears, the baby in my womb leaped for joy. And blessed is she who believed that there would be a fulfillment of what was spoken to her from the Lord.\""
    },
    {
        title: "The Nativity",
        description: "Reading: Luke 2:1-7 (ESV)\n\nIn those days a decree went out from Caesar Augustus that all the world should be registered. This was the first registration when Quirinius was governor of Syria. And all went to be registered, each to his own town. And Joseph also went up from Galilee, from the town of Nazareth, to Judea, to the city of David, which is called Bethlehem, because he was of the house and lineage of David, to be registered with Mary, his betrothed, who was with child. And while they were there, the time came for her to give birth. And she gave birth to her firstborn son and wrapped him in swaddling cloths and laid him in a manger, because there was no place for them in the inn."
    },
    {
        title: "The Presentation in the Temple",
        description: "Reading: Luke 2:22-38 (ESV)\n\nAnd when the time came for their purification according to the Law of Moses, they brought him up to Jerusalem to present him to the Lord (as it is written in the Law of the Lord, \"Every male who first opens the womb shall be called holy to the Lord\") and to offer a sacrifice according to what is said in the Law of the Lord, \"a pair of turtledoves, or two young pigeons.\" Now there was a man in Jerusalem, whose name was Simeon, and this man was righteous and devout, waiting for the consolation of Israel, and the Holy Spirit was upon him. And it had been revealed to him by the Holy Spirit that he would not see death before he had seen the Lord's Christ. And he came in the Spirit into the temple, and when the parents brought in the child Jesus, to do for him according to the custom of the Law, he took him up in his arms and blessed God and said, \"Lord, now you are letting your servant depart in peace, according to your word; for my eyes have seen your salvation that you have prepared in the presence of all peoples, a light for revelation to the Gentiles, and for glory to your people Israel.\" And his father and his mother marveled at what was said about him. And Simeon blessed them and said to Mary his mother, \"Behold, this child is appointed for the fall and rising of many in Israel, and for a sign that is opposed (and a sword will pierce through your own soul also), so that thoughts from many hearts may be revealed.\" And there was a prophetess, Anna, the daughter of Phanuel, of the tribe of Asher. She was advanced in years, having lived with her husband seven years from when she was a virgin, and then as a widow until she was eighty-four. She did not depart from the temple, worshiping with fasting and prayer night and day. And coming up at that very hour she began to give thanks to God and to speak of him to all who were waiting for the redemption of Jerusalem."
    },
    {
        title: "The Finding in the Temple",
        description: "Reading: Luke 2:41-52 (ESV)\n\nNow his parents went to Jerusalem every year at the Feast of the Passover. And when he was twelve years old, they went up according to custom. And when the feast was ended, as they were returning, the boy Jesus stayed behind in Jerusalem. His parents did not know it, but supposing him to be in the group they went a day's journey, but then they began to search for him among their relatives and acquaintances, and when they did not find him, they returned to Jerusalem, searching for him. After three days they found him in the temple, sitting among the teachers, listening to them and asking them questions. And all who heard him were amazed at his understanding and his answers. And when his parents saw him, they were astonished. And his mother said to him, \"Son, why have you treated us so? Behold, your father and I have been searching for you in great distress.\" And he said to them, \"Why were you looking for me? Did you not know that I must be in my Father's house?\" And they did not understand the saying that he spoke to them. And he went down with them and came to Nazareth and was submissive to them. And his mother treasured up all these things in her heart. And Jesus increased in wisdom and in stature and in favor with God and man."
    }
];

const LUMINOUS_MYSTERIES_EN: Mystery[] = [
    {
        title: "The Baptism in the Jordan",
        description: "Reading: Matthew 3:13-17 (ESV)\n\nThen Jesus came from Galilee to the Jordan to John, to be baptized by him. John would have prevented him, saying, \"I need to be baptized by you, and do you come to me?\" But Jesus answered him, \"Let it be so now, for thus it is fitting for us to fulfill all righteousness.\" Then he consented. And when Jesus was baptized, immediately he went up from the water, and behold, the heavens were opened to him, and he saw the Spirit of God descending like a dove and coming to rest on him; and behold, a voice from heaven said, \"This is my beloved Son, with whom I am well pleased.\""
    },
    {
        title: "The Wedding at Cana",
        description: "Reading: John 2:1-11 (ESV)\n\nOn the third day there was a wedding at Cana in Galilee, and the mother of Jesus was there. Jesus also was invited to the wedding with his disciples. When the wine ran out, the mother of Jesus said to him, \"They have no wine.\" And Jesus said to her, \"Woman, what does this have to do with me? My hour has not yet come.\" His mother said to the servants, \"Do whatever he tells you.\" Now there were six stone water jars there for the Jewish rites of purification, each holding twenty or thirty gallons. Jesus said to the servants, \"Fill the jars with water.\" And they filled them up to the brim. And he said to them, \"Now draw some out and take it to the master of the feast.\" So they took it. When the master of the feast tasted the water now become wine, and did not know where it came from (though the servants who had drawn the water knew), the master of the feast called the bridegroom and said to him, \"Everyone serves the good wine first, and when people have drunk freely, then the poor wine. But you have kept the good wine until now.\" This, the first of his signs, Jesus did at Cana in Galilee, and manifested his glory. And his disciples believed in him."
    },
    {
        title: "The Proclamation of the Kingdom",
        description: "Reading: Mark 1:14-15 (ESV)\n\nNow after John was arrested, Jesus came into Galilee, proclaiming the gospel of God, and saying, \"The time is fulfilled, and the kingdom of God is at hand; repent and believe in the gospel.\""
    },
    {
        title: "The Transfiguration",
        description: "Reading: Matthew 17:1-8 (ESV)\n\nAnd after six days Jesus took with him Peter and James, and John his brother, and led them up a high mountain by themselves. And he was transfigured before them, and his face shone like the sun, and his clothes became white as light. And behold, there appeared to them Moses and Elijah, talking with him. And Peter said to Jesus, \"Lord, it is good that we are here. If you wish, I will make three tents here, one for you and one for Moses and one for Elijah.\" He was still speaking when, behold, a bright cloud overshadowed them, and a voice from the cloud said, \"This is my beloved Son, with whom I am well pleased; listen to him.\" When the disciples heard this, they fell on their faces and were terrified. But Jesus came and touched them, saying, \"Rise, and have no fear.\" And when they lifted up their eyes, they saw no one but Jesus only."
    },
    {
        title: "The Institution of the Eucharist",
        description: "Reading: Matthew 26:26-28 (ESV)\n\nNow as they were eating, Jesus took bread, and after blessing it broke it and gave it to the disciples, and said, \"Take, eat; this is my body.\" And he took a cup, and when he had given thanks he gave it to them, saying, \"Drink of it, all of you, for this is my blood of the covenant, which is poured out for many for the forgiveness of sins.\""
    }
];

const SORROWFUL_MYSTERIES_EN: Mystery[] = [
    {
        title: "The Agony in the Garden",
        description: "Reading: Matthew 26:36-46 (ESV)\n\nThen Jesus went with them to a place called Gethsemane, and he said to his disciples, \"Sit here, while I go over there and pray.\" And taking with him Peter and the two sons of Zebedee, he began to be sorrowful and troubled. Then he said to them, \"My soul is very sorrowful, even to death; remain here, and watch with me.\" And going a little farther he fell on his face and prayed, saying, \"My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as you will.\" And he came to the disciples and found them sleeping. And he said to Peter, \"So, could you not watch with me one hour? Watch and pray that you may not enter into temptation. The spirit indeed is willing, but the flesh is weak.\" Again for the second time he went away and prayed, \"My Father, if this cannot pass unless I drink it, your will be done.\" And again he came and found them sleeping, for their eyes were heavy. So leaving them again, he went away and prayed for the third time, saying the same words again. Then he came to the disciples and said to them, \"Sleep and take your rest later on. See, the hour is at hand, and the Son of Man is betrayed into the hands of sinners. Rise, let us be going; see, my betrayer is at hand.\""
    },
    {
        title: "The Scourging at the Pillar",
        description: "Reading: John 19:1 (ESV)\n\nThen Pilate took Jesus and flogged him."
    },
    {
        title: "The Crowning with Thorns",
        description: "Reading: John 19:2-3 (ESV)\n\nAnd the soldiers twisted together a crown of thorns and put it on his head and arrayed him in a purple robe. They came up to him, saying, \"Hail, King of the Jews!\" and struck him with their hands."
    },
    {
        title: "The Carrying of the Cross",
        description: "Reading: Luke 23:26-32 (ESV)\n\nAnd as they led him away, they seized one Simon of Cyrene, who was coming in from the country, and laid on him the cross, to carry it behind Jesus. And there followed him a great multitude of the people and of women who were mourning and lamenting for him. But turning to them Jesus said, \"Daughters of Jerusalem, do not weep for me, but weep for yourselves and for your children. For behold, the days are coming when they will say, 'Blessed are the barren and the wombs that never bore and the breasts that never nursed!' Then they will begin to say to the mountains, 'Fall on us,' and to the hills, 'Cover us.' For if they do these things when the wood is green, what will happen when it is dry?\""
    },
    {
        title: "The Crucifixion and Death",
        description: "Reading: John 19:28-30 (ESV)\n\nAfter this, Jesus, knowing that all was now finished, said (to fulfill the Scripture), \"I thirst.\" A jar full of sour wine stood there. So they put a sponge full of the sour wine on a hyssop branch and held it to his mouth. When Jesus had received the sour wine, he said, \"It is finished,\" and he bowed his head and gave up his spirit."
    }
];

const GLORIOUS_MYSTERIES_EN: Mystery[] = [
    {
        title: "The Resurrection",
        description: "Reading: John 20:1-10 (ESV)\n\nNow on the first day of the week Mary Magdalene came to the tomb early, while it was still dark, and saw that the stone had been taken away from the tomb. So she ran and went to Simon Peter and the other disciple, the one whom Jesus loved, and said to them, \"They have taken the Lord out of the tomb, and we do not know where they have laid him.\" So Peter went out with the other disciple, and they were going toward the tomb. Both of them were running together, but the other disciple outran Peter and reached the tomb first. And stooping to look in, he saw the linen cloths lying there, but he did not go in. Then Simon Peter came, following him, and went into the tomb. He saw the linen cloths lying there, and the face cloth, which had been on Jesus' head, not lying with the linen cloths but folded up in a place by itself. Then the other disciple, who had reached the tomb first, also went in, and he saw and believed; for as yet they did not understand the Scripture, that he must rise from the dead. Then the disciples went back to their homes."
    },
    {
        title: "The Ascension",
        description: "Reading: Matthew 28:16-20 (ESV)\n\nNow the eleven disciples went to Galilee, to the mountain to which Jesus had directed them. And when they saw him they worshiped him, but some doubted. And Jesus came and said to them, \"All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.\""
    },
    {
        title: "The Descent of the Holy Spirit",
        description: "Reading: Acts 2:1-4 (ESV)\n\nWhen the day of Pentecost arrived, they were all together in one place. And suddenly there came from heaven a sound like a mighty rushing wind, and it filled the entire house where they were sitting. And divided tongues as of fire appeared to them and rested on each one of them. And they were all filled with the Holy Spirit and began to speak in other tongues as the Spirit gave them utterance."
    },
    {
        title: "The Assumption",
        description: "Reading: Luke 1:46-49 (ESV)\n\nAnd Mary said, \"My soul magnifies the Lord, and my spirit rejoices in God my Savior, for he has looked on the humble estate of his servant. For behold, from now on all generations will call me blessed; for he who is mighty has done great things for me, and holy is his name.\""
    },
    {
        title: "The Coronation of the Virgin",
        description: "Reading: Revelation 12:1 (ESV)\n\nAnd a great sign appeared in heaven: a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars."
    }
];

// Mysteries - Indonesian (1:1 from Android app with full Scripture readings)
const JOYFUL_MYSTERIES_ID: Mystery[] = [
    {
        title: "Maria Menerima Kabar Gembira dari Malaikat Gabriel",
        description: "Bacaan: Luk 1:26-38 (TB2)\n\nDalam bulan yang keenam malaikat Gabriel disuruh Allah pergi ke Nazaret di Galilea, kepada seorang perawan yang bertunangan dengan seorang bernama Yusuf dari keluarga Daud; nama perawan itu Maria. Ketika datang kepada Maria, malaikat itu berkata, \"Salam, hai Engkau yang dikaruniai! Tuhan menyertai engkau.\" Maria terkejut mendengar perkataan itu, lalu bertanya di dalam hatinya, apa maksud salam itu. Kata malaikat itu kepadanya, \"Jangan takut, hai Maria, sebab engkau beroleh anugerah di hadapan Allah. Sesungguhnya engkau akan mengandung dan melahirkan seorang anak laki-laki dan engkau harus menamai Dia Yesus. Ia akan menjadi besar dan akan disebut Anak Allah Yang Maha Tinggi. Tuhan Allah akan memberikan kepada-Nya takhta Daud, bapa leluhur-Nya, dan Ia akan memerintah atas keturunan Yakub sampai selama-lamanya dan Kerajaan-Nya tidak akan berkesudahan.\" Kata Maria kepada malaikat itu, \"Bagaimana mungkin hal itu terjadi, karena aku belum pernah berhubungan dengan laki-laki?\" Jawab malaikat itu kepadanya, \"Roh Kudus akan turun atasmu dan kuasa Allah Yang Maha Tinggi akan menaungi engkau. Anak yang dilahirkan itu kudus dan akan disebut Anak Allah. Lihat, Elisabet, sanakmu itu, ia pun sedang mengandung seorang anak laki-laki pada hari tuanya dan inilah bulan yang keenam bagi dia, yang disebut mandul itu. Sebab, bagi Allah tidak ada yang mustahil.\" Kata Maria, \"Aku ini hamba Tuhan. Jadilah padaku menurut perkataanmu itu.\" Lalu malaikat itu meninggalkan dia."
    },
    {
        title: "Maria Mengunjungi Elisabet, Saudarinya",
        description: "Bacaan: Luk 1:39-45 (TB2)\n\nBeberapa hari kemudian berangkatlah Maria dan bergegas menuju sebuah kota di pegunungan Yehuda. Lalu ia masuk ke rumah Zakharia dan memberi salam kepada Elisabet. Ketika Elisabet mendengar salam Maria, melonjaklah anak yang di dalam rahimnya dan Elisabet pun penuh dengan Roh Kudus, lalu berseru dengan suara nyaring, \"Diberkatilah engkau di antara semua perempuan dan diberkatilah buah rahimmu. Siapakah aku ini sampai ibu Tuhanku datang mengunjungi aku? Sebab, pada saat salammu sampai di telingaku, anak yang di dalam rahimku melonjak kegirangan. Berbahagialah ia yang percaya bahwa apa yang dikatakan kepadanya dari Tuhan akan terlaksana.\""
    },
    {
        title: "Yesus Dilahirkan di Betlehem",
        description: "Bacaan: Luk 2:1-7 (TB2)\n\nPada waktu itu Kaisar Agustus mengeluarkan suatu perintah, menyuruh mendaftarkan semua orang di seluruh dunia. Inilah pendaftaran yang pertama kali diadakan sewaktu Kirenius menjadi gubernur di Siria. Lalu semua orang pergi mendaftarkan diri, masing-masing ke kotanya sendiri. Yusuf pun pergi dari kota Nazaret di Galilea ke Yudea, ke kota Daud yang bernama Betlehem, karena ia berasal dari keluarga keturunan Daud, untuk mendaftarkan diri bersama Maria, tunangannya, yang sedang mengandung. Ketika mereka di situ tibalah waktunya bagi Maria untuk bersalin, dan ia melahirkan seorang anak laki-laki, anaknya yang sulung. Ia membedungnya lalu membaringkannya di dalam palungan, karena tidak ada tempat bagi mereka di penginapan."
    },
    {
        title: "Yesus Dipersembahkan dalam Bait Allah",
        description: "Bacaan: Luk 2:22-38 (TB2)\n\nLalu ketika tiba waktu penahiran mereka menurut hukum Musa, mereka membawa Dia ke Yerusalem untuk menyerahkan-Nya kepada Tuhan, seperti ada tertulis dalam hukum Tuhan, \"Semua anak laki-laki sulung harus dikuduskan bagi Tuhan\", dan untuk mempersembahkan kurban menurut apa yang difirmankan dalam hukum Tuhan, yaitu sepasang burung tekukur atau dua ekor anak burung merpati. Adalah di Yerusalem seorang bernama Simeon. Ia seorang yang benar dan saleh yang menantikan penghiburan bagi Israel, dan Roh Kudus ada di atasnya. Kepadanya telah dinyatakan oleh Roh Kudus bahwa ia tidak akan mati sebelum ia melihat Mesias dari Tuhan. Ia datang ke Bait Allah oleh Roh Kudus. Ketika Yesus, Anak itu, dibawa masuk oleh orang tua-Nya untuk melakukan kepada-Nya apa yang ditentukan hukum Taurat, ia menyambut Anak itu dan menggendong-Nya sambil memuji Allah, katanya, \"Sekarang, Tuhan, biarkanlah hamba-Mu ini pergi dalam damai, sesuai dengan firman-Mu, sebab mataku telah melihat keselamatan yang datang dari-Mu, yang telah Engkau sediakan di hadapan segala bangsa, yaitu terang yang menjadi penyataan-Mu bagi bangsa-bangsa lain dan menjadi kemuliaan umat-Mu, Israel.\" Ayah dan ibu-Nya heran akan segala sesuatu yang dikatakan tentang Dia. Lalu Simeon memberkati mereka dan berkata kepada Maria, ibu Anak itu, \"Sesungguhnya Anak ini ditentukan untuk menjatuhkan dan membangkitkan banyak orang di Israel dan untuk menjadi suatu tanda yang menimbulkan pembantahan supaya menjadi nyata pikiran hati banyak orang. Suatu pedang juga akan menembus jiwamu sendiri.\" Ada pula seorang nabiah bernama Hana, anak perempuan Fanuel dari suku Asyer. Sesudah kawin, ia hidup bersama suaminya tujuh tahun lamanya, lalu menjanda sampai berumur delapan puluh empat tahun. Ia tidak pernah meninggalkan Bait Allah dan siang malam beribadah dengan berpuasa dan berdoa. Pada saat itu juga ia mendekat dan mengucap syukur kepada Allah. Ia berbicara tentang Anak itu kepada semua orang yang menantikan pembebasan untuk Yerusalem."
    },
    {
        title: "Yesus Diketemukan dalam Bait Allah",
        description: "Bacaan: Luk 2:41-52 (TB2)\n\nTiap-tiap tahun orang tua Yesus pergi ke Yerusalem untuk merayakan Paskah. Ketika Yesus telah berumur dua belas tahun pergilah mereka ke Yerusalem seperti yang lazim pada perayaan itu. Ketika hari-hari itu berakhir, sementara mereka berjalan pulang, tinggallah Yesus, Anak itu, di Yerusalem tanpa diketahui orang tua-Nya. Karena mereka menyangka bahwa Ia ada di antara orang-orang seperjalanan mereka, berjalanlah mereka sehari perjalanan jauhnya, lalu mencari Dia di antara kaum keluarga dan kenalan mereka. Karena mereka tidak menemukan Dia, kembalilah mereka ke Yerusalem sambil terus mencari Dia. Sesudah tiga hari mereka menemukan Dia dalam Bait Allah. Ia sedang duduk di tengah-tengah para guru agama, sambil mendengarkan mereka dan mengajukan pertanyaan-pertanyaan kepada mereka. Semua orang yang mendengar Dia sangat heran akan kecerdasan-Nya dan jawaban-jawaban yang diberikan-Nya. Ketika orang tua-Nya melihat Dia, tercenganglah mereka, lalu kata ibu-Nya, \"Nak, mengapa Engkau berbuat demikian kepada kami? Lihat, bapak-Mu dan aku dengan cemas mencari Engkau.\" Jawab-Nya kepada mereka, \"Mengapa kamu mencari Aku? Tidakkah kamu tahu bahwa Aku harus berada di dalam rumah Bapa-Ku?\" Namun, mereka tidak mengerti apa yang dikatakan-Nya kepada mereka. Lalu ia pulang bersama mereka ke Nazaret, dan tetap hidup dalam asuhan mereka. Ibu-Nya pun menyimpan semua hal itu di dalam hati-Nya. Yesus makin dewasa dan bertambah hikmat-Nya, dan makin dikasihi oleh Allah dan manusia."
    }
];

const LUMINOUS_MYSTERIES_ID: Mystery[] = [
    {
        title: "Yesus Dibaptis di Sungai Yordan",
        description: "Bacaan: Mat 3:13-17 (TB2)\n\nPada waktu itu Yesus datang dari Galilea ke Yordan kepada Yohanes untuk dibaptis olehnya. Namun, Yohanes mencoba mencegah Dia, katanya, \"Akulah yang perlu dibaptis oleh-Mu, tetapi Engkau yang datang kepadaku?\" Jawab Yesus kepadanya, \"Biarlah hal itu terjadi sekarang, karena demikianlah sepatutnya kita menggenapkan seluruh kehendak Allah.\" Yohanes pun menuruti-Nya. Sesudah dibaptis, Yesus segera keluar dari air dan pada waktu itu juga langit terbuka dan Ia melihat Roh Allah turun seperti burung merpati dan hinggap di atas-Nya. Terdengarlah suara dari surga yang mengatakan, \"Inilah Anak-Ku yang terkasih, kepada-Nyalah Aku berkenan.\""
    },
    {
        title: "Yesus Menyatakan Diri-Nya dalam Pesta Perkawinan di Kana",
        description: "Bacaan: Yoh 2:1-11 (TB2)\n\nPada hari ketiga ada perkawinan di Kana yang di Galilea, dan ibu Yesus ada di situ. Yesus dan murid-murid-Nya diundang juga ke perkawinan itu. Ketika mereka kekurangan anggur, ibu Yesus berkata kepada-Nya, \"Mereka kehabisan anggur.\" Kata Yesus kepadanya, \"Mau apakah engkau dari Aku, ibu? Saat-Ku belum tiba.\" Ibu Yesus berkata kepada pelayan-pelayan, \"Apa yang dikatakan-Nya kepadamu, lakukanlah itu!\" Di situ ada enam tempayan yang disediakan untuk pembasuhan menurut adat orang Yahudi, masing-masing isinya delapan puluh atau seratus dua puluh liter. Yesus berkata kepada pelayan-pelayan itu, \"Isilah tempayan-tempayan itu penuh dengan air.\" Mereka pun mengisinya sampai penuh. Sesudah itu, kata Yesus kepada mereka, \"Sekarang cedoklah dan bawalah kepada pemimpin pesta.\" Lalu mereka membawanya. Pemimpin pesta itu pun mencicipi air yang telah menjadi anggur itu. Ia tidak tahu dari mana datangnya, tetapi pelayan-pelayan, yang mencedok air itu, mengetahuinya. Setelah itu, ia memanggil mempelai laki-laki, dan berkata kepadanya, \"Setiap orang menghidangkan anggur yang baik dahulu dan sesudah orang puas minum, barulah yang kurang baik. Tetapi, engkau menyimpan anggur yang baik sampai sekarang.\" Hal itu dilakukan Yesus di Kana yang di Galilea, sebagai yang pertama dari tanda-tanda-Nya dan dengan itu Ia telah menyatakan kemuliaan-Nya, dan murid-murid-Nya percaya kepada-Nya."
    },
    {
        title: "Yesus Memberitakan Kerajaan Allah dan Menyerukan Pertobatan",
        description: "Bacaan: Mrk 1:14-15 (TB2)\n\nSesudah Yohanes ditahan datanglah Yesus ke Galilea memberitakan Injil Allah, kata-Nya, \"Saatnya telah genap; Kerajaan Allah sudah dekat. Bertobatlah dan percayalah kepada Injil!\""
    },
    {
        title: "Yesus Menampakkan Kemuliaan-Nya",
        description: "Bacaan: Mat 17:1-8 (TB2)\n\nEnam hari kemudian Yesus membawa Petrus, Yakobus, dan Yohanes saudaranya, dan bersama mereka Ia naik ke sebuah gunung yang tinggi. Di situ mereka sendirian saja. Yesus berubah rupa di depan mata mereka; wajah-Nya bercahaya seperti matahari dan jubah-Nya menjadi putih berkilauan. Tampaklah kepada mereka Musa dan Elia sedang berbicara dengan Dia. Kata Petrus kepada Yesus, \"Tuhan, sungguh baik kita berada di tempat ini. Jika Engkau mau, biarlah kudirikan di sini tiga kemah, satu untuk Engkau, satu untuk Musa, dan satu untuk Elia.\" Sementara ia berkata-kata, tiba-tiba awan yang terang menaungi mereka dan dari dalam awan itu terdengar suara yang berkata, \"Inilah Anak-Ku yang terkasih, kepada-Nyalah Aku berkenan, dengarkanlah Dia.\" Mendengar itu sujudlah murid-murid-Nya dan mereka sangat ketakutan. Yesus datang kepada mereka dan menyentuh mereka sambil berkata, \"Berdirilah, jangan takut!\" Ketika mereka menengadah, mereka tidak melihat seorang pun kecuali Yesus seorang diri."
    },
    {
        title: "Yesus Menetapkan Ekaristi",
        description: "Bacaan: Mat 26:26-28 (TB2)\n\nKetika mereka sedang makan, Yesus mengambil roti, mengucap syukur, memecah-mecahkannya, lalu memberikannya kepada murid-murid-Nya dan berkata, \"Ambillah, makanlah, inilah tubuh-Ku.\" Kemudian Ia mengambil cawan, mengucap syukur, lalu memberikannya kepada mereka dan berkata, \"Minumlah, kamu semua, dari cawan ini. Sebab, inilah darah-Ku, darah perjanjian, yang ditumpahkan bagi banyak orang untuk pengampunan dosa-dosa.\""
    }
];

const SORROWFUL_MYSTERIES_ID: Mystery[] = [
    {
        title: "Yesus Berdoa kepada Bapa-Nya di Surga dalam Sakratul Maut",
        description: "Bacaan: Luk 22:39-46 (TB2)\n\nLalu pergilah Yesus ke luar kota dan sebagaimana biasa Ia menuju Bukit Zaitun. Murid-murid-Nya juga mengikuti Dia. Setelah tiba di tempat itu Ia berkata kepada mereka, \"Berdoalah supaya kamu jangan jatuh ke dalam pencobaan.\" Kemudian Ia menjauhkan diri dari mereka kira-kira sejauh lemparan batu, lalu Ia berlutut dan berdoa, \"Ya Bapa, jikalau Engkau berkenan, ambillah cawan ini dari hadapan-Ku. Tetapi, jangan kehendak-Ku, melainkan kehendak-Mulah yang jadi.\" [Lalu seorang malaikat dari langit menampakkan diri kepada-Nya dan memberi kekuatan kepada-Nya. Ia sangat susah dan makin bersungguh-sungguh berdoa. Peluh-Nya menjadi seperti titik-titik darah yang bertetesan ke tanah.] Sesudah bangkit dari doa dan kembali kepada murid-murid-Nya, Ia mendapati mereka sedang tidur karena dukacita. Kata-Nya kepada mereka, \"Mengapa kamu tidur? Bangunlah dan berdoalah, supaya kamu jangan jatuh ke dalam pencobaan.\""
    },
    {
        title: "Yesus Didera",
        description: "Bacaan: Yoh 19:1 (TB2)\n\nLalu Pilatus mengambil Yesus dan menyuruh orang mencambuk Dia."
    },
    {
        title: "Yesus Dimahkotai Duri",
        description: "Bacaan: Yoh 19:2-3 (TB2)\n\nPrajurit-prajurit menganyam sebuah mahkota duri dan menaruhnya di atas kepala-Nya. Mereka mengenakan jubah ungu kepada-Nya dan terus-menerus maju mendekati-Nya dan berkata, \"Salam, hai raja orang Yahudi!\" Lalu mereka menampar muka-Nya."
    },
    {
        title: "Yesus Memanggul Salib-Nya",
        description: "Bacaan: Luk 23:26-32 (TB2)\n\nKetika mereka membawa Yesus, mereka menahan seorang yang bernama Simon dari Kirene, yang baru datang dari luar kota, lalu mereka meletakkan salib itu di atas bahunya, supaya dipikulnya sambil mengikuti Yesus. Sejumlah besar orang mengikuti Dia, termasuk banyak perempuan yang menangisi dan meratapi Dia. Yesus berpaling kepada mereka dan berkata, \"Hai putri-putri Yerusalem, janganlah menangisi Aku, melainkan tangisilah dirimu sendiri dan anak-anakmu! Sebab, lihat, akan tiba masanya orang berkata: Berbahagialah perempuan mandul dan yang rahimnya tidak pernah melahirkan, dan yang susunya tidak pernah menyusui. Lalu orang akan mulai berkata kepada gunung-gunung: Runtuhlah menimpa kami! dan kepada bukit-bukit: Timbunilah kami! Sebab, jikalau orang berbuat demikian dengan kayu basah, apakah yang akan terjadi dengan kayu kering?\" Digiring juga dua orang lain, dua penjahat, untuk dihukum mati bersama-sama dengan Dia."
    },
    {
        title: "Yesus Wafat di Salib",
        description: "Bacaan: Luk 23:44-49 (TB2)\n\nKetika itu hari sudah kira-kira jam dua belas dan kegelapan meliputi seluruh negeri itu sampai jam tiga, sebab matahari tidak bersinar. Tabir Bait Suci terkoyak menjadi dua. Lalu Yesus berseru dengan suara nyaring, \"Ya Bapa, ke dalam tangan-Mu Kuserahkan nyawa-Ku.\" Sesudah berkata demikian Ia mengembuskan napas terakhir. Ketika kepala pasukan melihat apa yang terjadi, ia memuliakan Allah, katanya, \"Sungguh, orang ini orang benar!\" Sesudah seluruh orang banyak, yang datang berkerumun di situ untuk tontonan itu, melihat apa yang terjadi, pulanglah mereka sambil memukul-mukul dada mereka. Semua kenalan Yesus berdiri dari jauh, termasuk perempuan-perempuan yang mengikuti Dia dari Galilea dan melihat semuanya itu."
    }
];

const GLORIOUS_MYSTERIES_ID: Mystery[] = [
    {
        title: "Yesus Bangkit dari Kematian",
        description: "Bacaan: Luk 24:1-12 (TB2)\n\nPagi-pagi benar pada hari pertama minggu itu mereka pergi ke kubur membawa rempah-rempah yang telah mereka sediakan. Mereka mendapati batu sudah terguling dari kubur itu, dan setelah masuk mereka tidak menemukan jenazah Tuhan Yesus. Sementara mereka termangu-mangu karena hal itu, tiba-tiba dua orang berdiri dekat mereka memakai pakaian yang berkilau-kilauan. Mereka sangat ketakutan dan menundukkan kepala, lalu kedua orang itu berkata kepada mereka, \"Mengapa kamu mencari Dia yang hidup, di antara orang mati? Ia tidak ada di sini, Ia telah bangkit. Ingatlah apa yang dikatakan-Nya kepada kamu, ketika Ia masih di Galilea, yaitu bahwa Anak Manusia harus diserahkan ke tangan orang-orang berdosa dan disalibkan, dan bangkit pada hari yang ketiga.\" Teringatlah mereka akan perkataan Yesus itu. Setelah mereka kembali dari kubur, mereka menceritakan semuanya itu kepada kesebelas rasul dan kepada semua saudara yang lain. Perempuan-perempuan itu ialah Maria dari Magdala, Yohana, Maria ibu Yakobus, dan perempuan lain yang bersama mereka. Mereka yang memberitahukannya kepada rasul-rasul. Namun, bagi mereka perkataan-perkataan itu seakan-akan omong kosong dan mereka tidak percaya kepada perempuan-perempuan itu. Sungguh pun demikian Petrus bangun, lalu berlari ke kubur itu. Ketika ia menjenguk ke dalam, ia melihat hanya kain kafan saja. Lalu ia pergi dan bertanya dalam hatinya apa yang kiranya telah terjadi."
    },
    {
        title: "Yesus Naik ke Surga",
        description: "Bacaan: Luk 24:50-53 (TB2)\n\nYesus membawa mereka ke luar kota sampai dekat Betania. Di situ Ia mengangkat tangan-Nya dan memberkati mereka. Ketika Ia sedang memberkati mereka, Ia berpisah dari mereka dan terangkat ke surga. Mereka sujud menyembah Dia, lalu pulang ke Yerusalem dengan sangat bersukacita. Mereka senantiasa berada di dalam Bait Allah dan memuliakan Allah."
    },
    {
        title: "Roh Kudus Turun atas Para Rasul",
        description: "Bacaan: Kis 2:1-4 (TB2)\n\nKetika tiba hari Pentakosta, mereka semua berkumpul di suatu tempat. Tiba-tiba terdengarlah bunyi dari langit seperti tiupan angin keras yang memenuhi seluruh rumah, tempat mereka duduk. Tampaklah kepada mereka lidah-lidah seperti lidah api yang bertebaran dan hinggap pada mereka masing-masing. Lalu mereka semua dipenuhi dengan Roh Kudus dan mulai berbicara dalam bahasa-bahasa lain, seperti yang diberikan oleh Roh itu kepada mereka untuk dikatakan."
    },
    {
        title: "Maria Diangkat ke Surga",
        description: "Bacaan: Luk 1:46-49 (TB2)\n\nLalu kata Maria, \"Jiwaku memuliakan Tuhan, dan hatiku bergembira karena Allah, Juruselamatku, sebab Ia telah memperhatikan kerendahan hamba-Nya. Mulai dari sekarang segala keturunan akan menyebut aku berbahagia, karena Yang Maha Kuasa telah melakukan perbuatan-perbuatan besar kepadaku dan kuduslah nama-Nya.\""
    },
    {
        title: "Maria Dimahkotai di Surga",
        description: "Bacaan: Why 12:1 (TB2)\n\nKemudian tampaklah suatu tanda besar di langit: Seorang perempuan berselubungkan matahari, dengan bulan di bawah kakinya dan sebuah mahkota dari dua belas bintang di atas kepalanya."
    }
];

export type MysteryType = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export function getMysteries(type: MysteryType, lang: Language = 'en'): Mystery[] {
    if (lang === 'id') {
        switch (type) {
            case 'joyful': return JOYFUL_MYSTERIES_ID;
            case 'luminous': return LUMINOUS_MYSTERIES_ID;
            case 'sorrowful': return SORROWFUL_MYSTERIES_ID;
            case 'glorious': return GLORIOUS_MYSTERIES_ID;
        }
    }
    switch (type) {
        case 'joyful': return JOYFUL_MYSTERIES_EN;
        case 'luminous': return LUMINOUS_MYSTERIES_EN;
        case 'sorrowful': return SORROWFUL_MYSTERIES_EN;
        case 'glorious': return GLORIOUS_MYSTERIES_EN;
    }
}

// Get mystery type display name
export function getMysteryTypeName(type: MysteryType, lang: Language = 'en'): string {
    if (lang === 'id') {
        switch (type) {
            case 'joyful': return 'Gembira';
            case 'luminous': return 'Terang';
            case 'sorrowful': return 'Sedih';
            case 'glorious': return 'Mulia';
        }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
}

// Get suggested mystery for today based on day of week (1:1 from Android RosaryPrayers.getSuggestedMysteryForToday)
export function getSuggestedMysteryForToday(date: Date = new Date()): MysteryType {
    const day = date.getDay();
    switch (day) {
        case 0: {
            // Sunday: Advent/Christmas -> joyful, Lent (approx Feb/Mar) -> sorrowful, else glorious
            const month = date.getMonth(); // 0-11
            if (month === 11 || month === 0) return 'joyful';
            if (month === 1 || month === 2) return 'sorrowful';
            return 'glorious';
        }
        case 1: return 'joyful';     // Monday
        case 2: return 'sorrowful';  // Tuesday
        case 3: return 'glorious';   // Wednesday
        case 4: return 'luminous';   // Thursday
        case 5: return 'sorrowful';  // Friday
        case 6: return 'joyful';     // Saturday
        default: return 'joyful';
    }
}
