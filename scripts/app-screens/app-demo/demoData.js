// TIK svetaines ekranu fotografavimui (#136): netikri meistrai, kuriu bazeje
// nera. Sis katalogas gyvena tik laikinoje Metro kopijoje ir i git'a nepatenka.

const L = (lt, en) => ({ lt, en });

export const FAKE_PREFIX = 'd0000000-';
const id = (kind, n) => `${FAKE_PREFIX}${kind}-4000-8000-${String(n).padStart(12, '0')}`;

const MASTERS = [
  {
    name: 'Gabija Rimkutė',
    initials: 'GR',
    username: 'gabija.nails',
    gender: 'female',
    category: 'nails',
    specialty: L('Nagų meistrė', 'Nail artist'),
    address: 'Užupio g. 12',
    lat: 54.6812,
    lng: 25.2953,
    plan: 'pro',
    verified: true,
    bio: L(
      'Geliniai lakavimai, priauginimai ir švelnūs dizainai. Dirbu jaukioje studijoje Užupyje, kava visada paruošta.',
      'Gel polish, extensions and soft nail art. I work in a cosy studio in Užupis, and the coffee is always on.'
    ),
    payments: ['cash', 'card_onsite', 'card'],
    amenities: ['wifi', 'coffee', 'card_payment', 'air_conditioning'],
    formats: ['salon'],
    services: [
      { title: L('Gelinis lakavimas', 'Gel polish'), desc: L('Ilgai išliekanti spalva, nagų paruošimas ir priežiūra.', 'Long-lasting colour with nail prep and care.'), price: 25, deposit: 0, duration: 60 },
      { title: L('Manikiūras su geliu', 'Gel manicure'), desc: L('Pilnas manikiūras, odelių priežiūra ir gelinė danga.', 'Full manicure, cuticle care and a gel finish.'), price: 35, deposit: 10, duration: 90 },
      { title: L('Nagų priauginimas', 'Nail extensions'), desc: L('Priauginimas geliu, forma ir ilgis pagal jūsų norą.', 'Gel extensions, shape and length of your choice.'), price: 45, deposit: 10, duration: 120 },
      { title: L('Nagų dizainas', 'Nail art'), desc: L('Piešiniai, blizgučiai ir ombre prie bet kurios dangos.', 'Drawings, glitter and ombre on top of any finish.'), price: 10, deposit: 0, duration: 30 }
    ],
    posts: [
      { svc: 0, text: L('Pieno rožinė rudeniui #gelinislakavimas #nagai #vilnius', 'Milky pink for autumn #gelpolish #nails #vilnius'), likes: 148, comments: 12, hoursAgo: 2 },
      { svc: 3, text: L('Švelnus ombre ir šiek tiek blizgesio #nagudizainas', 'Soft ombre with a little sparkle #nailart'), likes: 96, comments: 7, hoursAgo: 30 },
      { svc: 2, text: L('Natūralaus ilgio priauginimas, migdolo forma #priauginimas', 'Natural-length extensions, almond shape #extensions'), likes: 71, comments: 4, hoursAgo: 60 }
    ],
    story: L('Šiandien dar yra laisvas 17:00 laikas!', 'One free slot left today at 17:00!'),
    reviews: [
      { author: 'Indrė K.', rating: 5, daysAgo: 3, text: L('Labai kruopšti ir maloni meistrė, lakas laikosi jau trečią savaitę.', 'Very careful and friendly, the polish is on its third week now.') },
      { author: 'Karolina', rating: 5, daysAgo: 9, text: L('Jauki studija, gera kava ir tobulas rezultatas.', 'Cosy studio, good coffee and a perfect result.') },
      { author: 'Viktorija P.', rating: 4, daysAgo: 16, text: L('Rezultatas puikus, tik teko šiek tiek palaukti.', 'Great result, I just had to wait a little.') },
      { author: 'Justė', rating: 5, daysAgo: 24, text: L('Grįšiu tikrai! Dizainas net gražesnis nei paveikslėlyje.', 'I will definitely be back! The design came out even nicer than the picture.') },
      { author: 'Greta S.', rating: 5, daysAgo: 35, text: L('Greitai, švariai ir be skubos jausmo.', 'Quick and tidy, without ever feeling rushed.') }
    ]
  },
  {
    name: 'Austėja Vaitkutė',
    initials: 'AV',
    username: 'austeja.hair',
    gender: 'female',
    category: 'hair',
    specialty: L('Plaukų stilistė', 'Hair stylist'),
    address: 'Pylimo g. 21',
    lat: 54.6787,
    lng: 25.2788,
    plan: 'pro',
    verified: true,
    bio: L(
      'Kirpimai, balayage ir šventinės šukuosenos. Patarsiu, kas tiks jūsų plaukams ir gyvenimo ritmui.',
      'Cuts, balayage and occasion styling. I will help you find what suits your hair and your routine.'
    ),
    payments: ['cash', 'card_onsite'],
    amenities: ['wifi', 'coffee', 'card_payment', 'public_transport'],
    formats: ['salon'],
    services: [
      { title: L('Moteriškas kirpimas', "Women's haircut"), desc: L('Konsultacija, plovimas, kirpimas ir sušukavimas.', 'Consultation, wash, cut and blow-dry.'), price: 30, deposit: 0, duration: 60 },
      { title: L('Plaukų dažymas', 'Hair colouring'), desc: L('Vienos spalvos dažymas su priežiūros kauke.', 'Single-colour dye with a care mask.'), price: 70, deposit: 15, duration: 120 },
      { title: L('Balayage', 'Balayage'), desc: L('Rankomis pieštas šviesinimas natūraliam rezultatui.', 'Hand-painted lightening for a natural look.'), price: 120, deposit: 20, duration: 180 },
      { title: L('Šventinė šukuosena', 'Occasion styling'), desc: L('Šukuosena vestuvėms, išleistuvėms ar šventei.', 'Styling for weddings, proms and parties.'), price: 45, deposit: 0, duration: 60 }
    ],
    posts: [
      { svc: 2, text: L('Šviesus balayage, kuris gražiai atauga #balayage #plaukai', 'A bright balayage that grows out beautifully #balayage #hair'), likes: 132, comments: 9, hoursAgo: 4 },
      { svc: 0, text: L('Lengvas kirpimas su sluoksniais #kirpimas', 'Light layered cut #haircut'), likes: 64, comments: 3, hoursAgo: 40 },
      { svc: 3, text: L('Vestuvių sezono šukuosena #sukuosena #vestuves', 'Wedding season updo #updo #wedding'), likes: 88, comments: 6, hoursAgo: 75 }
    ],
    story: L('Naujos dažų spalvos jau salone', 'New colours have just arrived at the salon'),
    reviews: [
      { author: 'Agnė', rating: 5, daysAgo: 2, text: L('Pagaliau radau savo kirpėją! Labai išklausė, ko noriu.', 'Finally found my stylist! She really listened to what I wanted.') },
      { author: 'Dovilė M.', rating: 5, daysAgo: 11, text: L('Balayage atrodo natūraliai ir labai prabangiai.', 'The balayage looks natural and very luxurious.') },
      { author: 'Laura', rating: 5, daysAgo: 19, text: L('Profesionalu ir labai malonu.', 'Professional and really pleasant.') },
      { author: 'Rūta', rating: 4, daysAgo: 30, text: L('Gražus kirpimas, vizitas užtruko kiek ilgiau nei planuota.', 'Lovely cut, the visit just ran a bit longer than planned.') }
    ]
  },
  {
    name: 'Ugnė Kazlauskaitė',
    initials: 'UK',
    username: 'ugne.brows',
    gender: 'female',
    category: 'brows_lashes',
    specialty: L('Antakių ir blakstienų meistrė', 'Brow and lash artist'),
    address: 'Konstitucijos pr. 7',
    lat: 54.6957,
    lng: 25.2771,
    plan: 'starter',
    verified: false,
    bio: L(
      'Antakių laminavimas, korekcija ir blakstienų liftingas. Natūralus rezultatas be perteklinio dažymo.',
      'Brow lamination, shaping and lash lifts. A natural look without heavy tint.'
    ),
    payments: ['cash', 'card_onsite'],
    amenities: ['wifi', 'air_conditioning'],
    formats: ['rented_chair'],
    services: [
      { title: L('Antakių laminavimas', 'Brow lamination'), desc: L('Laminavimas, korekcija ir maitinamasis aliejus.', 'Lamination, shaping and a nourishing oil.'), price: 30, deposit: 0, duration: 45 },
      { title: L('Antakių korekcija ir dažymas', 'Brow shaping and tint'), desc: L('Forma pagal veido bruožus ir švelnus dažymas.', 'A shape that suits your face and a soft tint.'), price: 20, deposit: 0, duration: 30 },
      { title: L('Blakstienų liftingas', 'Lash lift'), desc: L('Riesčios blakstienos iki šešių savaičių.', 'Curled lashes for up to six weeks.'), price: 35, deposit: 0, duration: 60 }
    ],
    posts: [
      { svc: 0, text: L('Laminuoti antakiai, tvarkingi visą dieną #antakiai #laminavimas', 'Laminated brows, neat all day long #brows #lamination'), likes: 77, comments: 5, hoursAgo: 6 },
      { svc: 2, text: L('Blakstienų liftingas be priauginimo #blakstienos', 'A lash lift, no extensions needed #lashes'), likes: 59, comments: 2, hoursAgo: 50 },
      { svc: 1, text: L('Korekcija ir švelnus dažymas #antakiukorekcija', 'Shaping and a soft tint #browshaping'), likes: 41, comments: 1, hoursAgo: 90 }
    ],
    story: L('Antakių laminavimas -15 % visą savaitę', 'Brow lamination 15% off all week'),
    reviews: [
      { author: 'Eglė', rating: 5, daysAgo: 4, text: L('Antakiai atrodo natūraliai, kaip ir norėjau.', 'My brows look natural, exactly as I wanted.') },
      { author: 'Gintarė', rating: 5, daysAgo: 13, text: L('Labai švelnios rankos ir puikus rezultatas.', 'Very gentle hands and a great result.') },
      { author: 'Simona L.', rating: 5, daysAgo: 27, text: L('Greitas vizitas per pietų pertrauką.', 'A quick visit during my lunch break.') }
    ]
  },
  {
    name: 'Monika Jankauskienė',
    initials: 'MJ',
    username: 'monika.makeup',
    gender: 'female',
    category: 'makeup',
    specialty: L('Vizažistė', 'Makeup artist'),
    address: 'Vokiečių g. 4',
    lat: 54.6806,
    lng: 25.2834,
    plan: 'vip',
    verified: true,
    bio: L('Dieninis, vakarinis ir vestuvinis makiažas. Atvykstu ir į namus.', 'Day, evening and bridal makeup. I also come to you.'),
    payments: ['cash', 'card'],
    amenities: ['wifi', 'coffee', 'private_room'],
    formats: ['salon', 'mobile'],
    services: [
      { title: L('Dieninis makiažas', 'Day makeup'), desc: L('Lengvas, natūralus makiažas kasdienai.', 'A light, natural everyday look.'), price: 35, deposit: 0, duration: 45 },
      { title: L('Vakarinis makiažas', 'Evening makeup'), desc: L('Ryškesnis makiažas šventei ar vakarėliui.', 'A bolder look for a party or celebration.'), price: 50, deposit: 0, duration: 60 },
      { title: L('Vestuvinis makiažas', 'Bridal makeup'), desc: L('Bandomasis makiažas ir makiažas vestuvių dieną.', 'A trial session and makeup on the wedding day.'), price: 90, deposit: 20, duration: 90 }
    ],
    posts: [
      { svc: 1, text: L('Vakarinis makiažas šventei #makiazas', 'Evening makeup for a celebration #makeup'), likes: 115, comments: 8, hoursAgo: 8 },
      { svc: 2, text: L('Nuotaka, kuri šviečia #vestuvinismakiazas', 'A bride who glows #bridalmakeup'), likes: 140, comments: 14, hoursAgo: 55 },
      { svc: 0, text: L('Lengvas dieninis su švytinčia oda #dieninismakiazas', 'Light day look with glowing skin #daymakeup'), likes: 52, comments: 2, hoursAgo: 100 }
    ],
    story: L('Rudens vestuvių datos dar yra', 'Autumn wedding dates still open'),
    reviews: [
      { author: 'Aistė', rating: 5, daysAgo: 5, text: L('Makiažas išsilaikė visą vakarą!', 'The makeup lasted all night!') },
      { author: 'Paulina R.', rating: 5, daysAgo: 15, text: L('Nuostabi vizažistė, labai rekomenduoju.', 'Wonderful makeup artist, highly recommend.') },
      { author: 'Neringa', rating: 5, daysAgo: 33, text: L('Atvyko į namus ir viskas buvo laiku.', 'She came to my home and everything was on time.') }
    ]
  },
  {
    name: 'Emilija Stankevičiūtė',
    initials: 'ES',
    username: 'emilija.skin',
    gender: 'female',
    category: 'skincare',
    specialty: L('Kosmetologė', 'Beautician'),
    address: 'Žirmūnų g. 68',
    lat: 54.7085,
    lng: 25.2994,
    plan: 'pro',
    verified: true,
    bio: L('Veido procedūros ir odos priežiūros planai. Kiekvieną vizitą pradedu nuo odos įvertinimo.', 'Facials and skincare plans. Every visit starts with a skin check.'),
    payments: ['cash', 'card_onsite', 'card'],
    amenities: ['wifi', 'parking', 'card_payment', 'private_room'],
    formats: ['salon'],
    services: [
      { title: L('Veido valymas', 'Facial cleansing'), desc: L('Gilus valymas, kaukė ir drėkinimas.', 'Deep cleansing, a mask and moisturising.'), price: 45, deposit: 0, duration: 60 },
      { title: L('Drėkinamoji veido procedūra', 'Hydrating facial'), desc: L('Hialurono rūgštis ir veido masažas.', 'Hyaluronic acid and a facial massage.'), price: 55, deposit: 0, duration: 60 },
      { title: L('Cheminis pilingas', 'Chemical peel'), desc: L('Švelnus pilingas lygesnei ir šviesesnei odai.', 'A gentle peel for smoother, brighter skin.'), price: 60, deposit: 10, duration: 45 }
    ],
    posts: [
      { svc: 1, text: L('Drėgmės bomba prieš žiemą #veidoprieziura', 'A hydration boost before winter #skincare'), likes: 68, comments: 3, hoursAgo: 10 },
      { svc: 0, text: L('Gilus veido valymas #kosmetologija', 'Deep facial cleansing #facial'), likes: 45, comments: 2, hoursAgo: 65 },
      { svc: 2, text: L('Švelnus pilingas, švytinti oda #pilingas', 'Gentle peel, glowing skin #peel'), likes: 39, comments: 1, hoursAgo: 120 }
    ],
    story: null,
    reviews: [
      { author: 'Kotryna', rating: 5, daysAgo: 6, text: L('Oda po procedūros tiesiog švyti.', 'My skin is simply glowing after the treatment.') },
      { author: 'Inga', rating: 5, daysAgo: 18, text: L('Labai profesionalūs patarimai namų priežiūrai.', 'Very professional advice for home care.') },
      { author: 'Milda', rating: 4, daysAgo: 40, text: L('Gera procedūra, kiek brangoka.', 'Good treatment, a little on the pricey side.') }
    ]
  },
  {
    name: 'Lukas Petraitis',
    initials: 'LP',
    username: 'lukas.massage',
    gender: 'male',
    category: 'massage_body',
    specialty: L('Masažuotojas', 'Massage therapist'),
    address: 'Antakalnio g. 40',
    lat: 54.6995,
    lng: 25.3148,
    plan: 'starter',
    verified: false,
    bio: L('Klasikinis, sportinis ir limfodrenažinis masažas. Ramybė po darbo savaitės.', 'Classic, sports and lymphatic drainage massage. Calm after a long week.'),
    payments: ['cash', 'card_onsite'],
    amenities: ['parking', 'restroom', 'no_smoking'],
    formats: ['salon'],
    services: [
      { title: L('Klasikinis nugaros masažas', 'Classic back massage'), desc: L('Nugaros, kaklo ir pečių masažas.', 'Back, neck and shoulder massage.'), price: 35, deposit: 0, duration: 45 },
      { title: L('Viso kūno masažas', 'Full body massage'), desc: L('Atpalaiduojantis viso kūno masažas su aliejais.', 'A relaxing full body massage with oils.'), price: 55, deposit: 0, duration: 90 },
      { title: L('Limfodrenažinis masažas', 'Lymphatic drainage massage'), desc: L('Lengvesnės kojos ir mažiau tinimo.', 'Lighter legs and less swelling.'), price: 50, deposit: 0, duration: 60 }
    ],
    posts: [
      { svc: 1, text: L('Ramybės valanda po darbo savaitės #masazas', 'An hour of calm after the working week #massage'), likes: 57, comments: 2, hoursAgo: 12 },
      { svc: 0, text: L('Nugaros masažas dirbantiems prie stalo #nugarosmasazas', 'Back massage for desk workers #backmassage'), likes: 43, comments: 1, hoursAgo: 70 },
      { svc: 2, text: L('Limfodrenažas lengvoms kojoms #limfodrenazas', 'Lymphatic drainage for lighter legs #lymphaticdrainage'), likes: 31, comments: 0, hoursAgo: 130 }
    ],
    story: L('Šeštadienį dirbu iki 15:00', 'Open until 15:00 on Saturday'),
    reviews: [
      { author: 'Tomas', rating: 5, daysAgo: 7, text: L('Pagaliau atsipalaidavo nugara.', 'My back finally relaxed.') },
      { author: 'Jurgita', rating: 5, daysAgo: 20, text: L('Labai profesionalus ir dėmesingas.', 'Very professional and attentive.') },
      { author: 'Mantas K.', rating: 5, daysAgo: 38, text: L('Rekomenduoju po sporto.', 'Recommended after training.') }
    ]
  },
  {
    name: 'Rasa Žukauskienė',
    initials: 'RŽ',
    username: 'rasa.nails',
    gender: 'female',
    category: 'nails',
    specialty: L('Nagų meistrė', 'Nail artist'),
    address: 'Kalvarijų g. 85',
    lat: 54.7031,
    lng: 25.2866,
    plan: 'starter',
    verified: false,
    bio: L('Manikiūras ir pedikiūras be skubos. Sterilūs įrankiai ir tik patikrintos priemonės.', 'Manicures and pedicures without the rush. Sterile tools and trusted products only.'),
    payments: ['cash'],
    amenities: ['wifi', 'kids_friendly'],
    formats: ['salon'],
    services: [
      { title: L('Klasikinis manikiūras', 'Classic manicure'), desc: L('Nagų forma, odelės ir priežiūra.', 'Shaping, cuticles and care.'), price: 20, deposit: 0, duration: 45 },
      { title: L('Gelinis lakavimas', 'Gel polish'), desc: L('Ilgai išliekanti spalva.', 'Long-lasting colour.'), price: 25, deposit: 0, duration: 60 },
      { title: L('Pedikiūras', 'Pedicure'), desc: L('Pėdų vonelė, nagų ir odos priežiūra.', 'Foot bath, nail and skin care.'), price: 35, deposit: 0, duration: 75 }
    ],
    posts: [
      { svc: 1, text: L('Klasikinė raudona niekada nepabosta #raudoninagai', 'Classic red never gets old #rednails'), likes: 84, comments: 5, hoursAgo: 14 },
      { svc: 2, text: L('Pedikiūras prieš atostogas #pedikiuras', 'A pedicure before the holidays #pedicure'), likes: 36, comments: 1, hoursAgo: 80 },
      { svc: 0, text: L('Trumpi, tvarkingi, natūralūs #manikiuras', 'Short, neat and natural #manicure'), likes: 29, comments: 0, hoursAgo: 140 }
    ],
    story: null,
    reviews: [
      { author: 'Vaida', rating: 5, daysAgo: 8, text: L('Labai maloni ir kruopšti.', 'Very kind and careful.') },
      { author: 'Brigita', rating: 4, daysAgo: 22, text: L('Puikus pedikiūras.', 'Great pedicure.') },
      { author: 'Asta', rating: 5, daysAgo: 45, text: L('Visada laiku ir tvarkingai.', 'Always on time and tidy.') }
    ]
  }
];

const POST_W = 1080;
const POST_H = 1350;

/** Kokius paveikslelius generatorius turi nupiesti (gen-media.mjs). */
export function mediaJobs() {
  const works = [];
  const avatars = [];
  MASTERS.forEach((m, mi) => {
    avatars.push({ file: `av-${mi}.png`, initials: m.initials, tone: mi });
    m.posts.forEach((p, pi) => {
      works.push({ file: `post-${mi}-${pi}.jpg`, w: POST_W, h: POST_H, category: m.category, variant: pi + mi, seed: 1000 + mi * 31 + pi * 7 });
    });
    if (m.story) {
      works.push({ file: `story-${mi}.jpg`, w: 1080, h: 1920, category: m.category, variant: mi + 2, seed: 5000 + mi * 13 });
    }
  });
  return { works, avatars };
}

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

export function buildDemo(lang, mediaBase) {
  const t = (v) => (v && typeof v === 'object' ? v[lang] ?? v.lt : v);
  const now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();
  const media = (file, type = 'image/jpeg') => ({ id: null, r2_key: `${mediaBase}/${file}`, content_type: type, is_private: false });

  const masterRows = [];
  // [eile sraute, irasas]: pirmi visu meistru pirmieji darbai, tada antrieji.
  const ranked = [];
  const stories = [];
  const reviewsByMaster = {};
  const hoursByMaster = {};

  MASTERS.forEach((m, mi) => {
    const pid = id('0000', mi + 1);
    const avatar = media(`av-${mi}.png`, 'image/png');
    const services = m.services.map((s, si) => ({
      id: id('0001', mi * 10 + si + 1),
      title: t(s.title),
      description: t(s.desc),
      price: s.price,
      deposit: s.deposit,
      duration_minutes: s.duration,
      category: m.category,
      custom_category_id: null,
      position: si
    }));
    const reviews = m.reviews.map((r, ri) => ({
      id: id('0002', mi * 10 + ri + 1),
      rating: r.rating,
      body: t(r.text),
      created_at: iso(now - r.daysAgo * DAY),
      author: { id: id('0003', mi * 10 + ri + 1), display_name: r.author, media: null }
    }));
    reviewsByMaster[pid] = reviews;

    const row = {
      profile_id: pid,
      display_name: m.name,
      specialty: t(m.specialty),
      bio: t(m.bio),
      city: 'Vilnius',
      address_line: m.address,
      address_extra: '',
      latitude: m.lat,
      longitude: m.lng,
      is_pro: m.plan !== 'starter',
      plan: m.plan,
      verified: m.verified,
      stripe_payouts_enabled: m.payments.includes('card'),
      accepted_payment_methods: m.payments,
      rules: lang === 'en'
        ? 'Please arrive on time. If you are more than 15 minutes late, the visit may be shortened.'
        : 'Prašome atvykti laiku. Vėluojant daugiau nei 15 min., vizitas gali būti sutrumpintas.',
      cancellation_policy: 'free_24h',
      amenities: m.amenities,
      work_formats: m.formats,
      avatar_media_id: null,
      media: avatar,
      services,
      master_service_categories: [],
      master_categories: [{ category_id: m.category }],
      reviews: reviews.map((r) => ({ rating: r.rating })),
      style_tags: [],
      vibe: '',
      accepts_bookings: true,
      gender: m.gender
    };
    masterRows.push(row);

    const masterEmbed = {
      profile_id: pid,
      display_name: m.name,
      specialty: row.specialty,
      city: 'Vilnius',
      verified: m.verified,
      is_pro: row.is_pro,
      plan: m.plan,
      media: avatar,
      profile: { username: m.username }
    };

    m.posts.forEach((p, pi) => {
      const svc = m.services[p.svc];
      ranked.push([pi * 10 + mi, {
        id: id('0004', mi * 10 + pi + 1),
        service_title: t(svc.title),
        description: t(p.text),
        price: svc.price,
        duration_minutes: svc.duration,
        category: m.category,
        created_at: iso(now - p.hoursAgo * HOUR),
        clip_start_seconds: null,
        clip_length_seconds: null,
        media: media(`post-${mi}-${pi}.jpg`),
        master: masterEmbed,
        likes: [{ count: p.likes }],
        comments: [{ count: p.comments }]
      }]);
    });

    if (m.story) {
      stories.push({
        id: id('0005', mi + 1),
        caption: t(m.story),
        music: null,
        duration_seconds: 5,
        clip_start_seconds: null,
        overlays: null,
        expires_at: iso(now + 20 * HOUR),
        created_at: iso(now - (mi + 1) * HOUR),
        author_role: 'master',
        media: media(`story-${mi}.jpg`),
        author: { id: pid, display_name: m.name, media: avatar }
      });
    }

    // 0 = sekmadienis, kaip working_hours_weekly.
    hoursByMaster[pid] = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
      master_id: pid,
      weekday,
      start_time: weekday === 6 ? '10:00:00' : '09:00:00',
      end_time: weekday === 6 ? '15:00:00' : '18:00:00',
      is_off: weekday === 0
    }));
  });

  const posts = ranked.sort((a, b) => a[0] - b[0]).map(([, post]) => post);
  const feedOrder = posts.map((p) => p.id);
  const masterIndex = Object.fromEntries(masterRows.map((r, i) => [r.profile_id, i]));

  /** Keli uzimti laikai, kad kalendorius neatrodytu tuscias. Telefono laiku. */
  function busy(masterId, fromIso, toIso) {
    const mi = masterIndex[masterId] ?? 0;
    const from = fromIso ? new Date(fromIso) : new Date(now);
    const to = toIso ? new Date(toIso) : new Date(now + 60 * DAY);
    const rows = [];
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    for (let d = new Date(start); d <= to; d = new Date(d.getTime() + DAY)) {
      const k = (d.getDate() + mi) % 3;
      const slots = k === 0 ? [[10, 0, 60], [13, 0, 90]] : k === 1 ? [[11, 30, 60], [15, 0, 60]] : [[9, 0, 90], [14, 30, 60], [16, 30, 60]];
      for (const [h, mm, dur] of slots) {
        const at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, mm);
        rows.push({ master_id: masterId, starts_at: at.toISOString(), duration_minutes: dur });
      }
    }
    return rows;
  }

  return {
    masterRows,
    posts,
    feedOrder,
    stories,
    reviewsByMaster,
    hoursByMaster,
    busy,
    genderOf: (pid) => masterRows.find((r) => r.profile_id === pid)?.gender ?? null
  };
}
