// The "{phrase} in Korean" pages. Each page has a ladder of forms (casual →
// formal), a picker that answers "who am I saying it to?", a one-question
// check and related phrases. App phrases are referenced by id and keep their
// audio and X-Ray; forms the app does not have are worked out by the engine
// and play once a clip lands in public/audio/ko/. Korean facts here need a
// native-speaker review before launch.
import { form, phrase, type XInput, type XPhrase } from './phrases';

export interface PhrasePage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Index into forms of the form the page leads with. */
  hero: number;
  heroNote: string;
  forms: XPhrase[];
  pick?: { title: string; sub: string; who: { label: string; form: number }[] };
  check: { q: string; options: number[]; answer: number; why: string; wrong: string };
  moreTitle: string;
  more: XPhrase[];
  faq: { q: string; a: string }[];
  cta: string;
}

const f = (x: XInput) => form(x);
const ids = (...list: string[]) => list.map(phrase);

export const PHRASE_PAGES: PhrasePage[] = [
  {
    slug: 'hello-in-korean',
    title: 'Hello in Korean: 안녕하세요 and When to Use Each Form | HangulEdu',
    description: 'How to say hello in Korean: 안녕하세요 (annyeonghaseyo) for most people, 안녕 for friends, 안녕하십니까 for formal moments. Pick who you are greeting and see how each one really sounds.',
    h1: 'How to say hello in Korean',
    lead: 'The hello you need almost every day is 안녕하세요 (annyeonghaseyo). Korean has two more: a casual one for friends and a formal one for work. Pick the person and see which one fits.',
    hero: 1,
    heroNote: 'The safe default for almost everyone',
    forms: [
      f({ ko: '안녕', en: 'Hi / Bye', register: 'casual', situation: 'Friends, people younger than you. Also means bye.' }),
      f({ ko: '안녕하세요', en: 'Hello', register: 'polite', situation: 'Strangers, shop staff, neighbors, most adults', parts: [{ ko: '안녕', gloss: 'peace, well-being' }, { ko: '하세요', gloss: 'are you (polite)' }], literal: 'Are you at peace?' }),
      phrase('wk_annyeonghasimnikka'),
    ],
    pick: {
      title: 'Pick the right hello',
      sub: 'Korean has three levels of politeness. Choose who you are greeting.',
      who: [
        { label: 'A friend your age', form: 0 },
        { label: 'A shop assistant', form: 1 },
        { label: "Your friend's parents", form: 1 },
        { label: 'A neighbor in the lift', form: 1 },
        { label: 'Your boss, first thing in the morning', form: 2 },
        { label: 'A child', form: 0 },
      ],
    },
    check: {
      q: "Your friend's grandmother opens the door. What do you say?",
      options: [0, 1, 2],
      answer: 1,
      why: 'She is older and you do not know her well: polite 안녕하세요, with a small bow.',
      wrong: '안녕 is for friends and younger people, and 안녕하십니까 sounds like a soldier or a news anchor at a front door. Polite 안녕하세요 fits.',
    },
    moreTitle: 'More ways to greet',
    more: [
      ...ids('wk_cheoeum_boep', 'kd_jal_jinaesseo', 'kd_bap_meogeosseo', 'wk_butak'),
      f({ ko: '여보세요', en: 'Hello? (on the phone)', register: 'polite', situation: 'Only for answering the phone' }),
    ],
    faq: [
      { q: 'Is 안녕 hello or goodbye?', a: 'Both. Between friends 안녕 means hi and bye. The polite goodbyes are longer: 안녕히 가세요 to someone leaving, 안녕히 계세요 to someone staying.' },
      { q: 'Do I need to bow?', a: 'A small nod or bow with 안녕하세요 is normal with anyone older or anyone you have just met. With friends, a wave is fine.' },
      { q: 'How do you say hello on the phone?', a: '여보세요 (yeoboseyo). It is only used on the phone; face to face it sounds odd.' },
      { q: 'Is annyeong rude?', a: 'Not to friends, but it is casual speech (banmal). Said to an older stranger or a shop assistant it sounds too familiar.' },
    ],
    cta: 'Greetings, small talk and 233 more phrases',
  },
  {
    slug: 'thank-you-in-korean',
    title: 'Thank You in Korean: 감사합니다, 고마워 and More | HangulEdu',
    description: 'How to say thank you in Korean: 감사합니다 (gamsahamnida) and 고맙습니다 for most people, 고마워 for friends. Hear them, see why 감사합니다 is said 감사함니다, and pick the right one.',
    h1: 'How to say thank you in Korean',
    lead: 'The thank you you will hear most is 감사합니다 (gamsahamnida). Korean also has 고맙습니다, just as polite, and 고마워 for friends. And it is not said the way it is written.',
    hero: 2,
    heroNote: 'Safe with anyone',
    forms: [
      phrase('kd_gomawo'),
      f({ ko: '고마워요', en: 'Thank you', register: 'polite', situation: 'Friendly but polite: a colleague, a neighbor' }),
      f({ ko: '감사합니다', en: 'Thank you', register: 'formal', situation: 'Shops, strangers, older people, work', parts: [{ ko: '감사', gloss: 'gratitude' }, { ko: '합니다', gloss: 'I do (formal)' }], literal: 'I do gratitude' }),
      f({ ko: '고맙습니다', en: 'Thank you', register: 'formal', situation: 'As polite as 감사합니다, a little warmer' }),
    ],
    pick: {
      title: 'Pick the right thank you',
      sub: 'Choose who helped you.',
      who: [
        { label: 'A close friend', form: 0 },
        { label: 'Your younger sibling', form: 0 },
        { label: 'A colleague you get on with', form: 1 },
        { label: 'A shop assistant', form: 2 },
        { label: 'A stranger who gave directions', form: 2 },
        { label: "Your partner's grandfather", form: 3 },
      ],
    },
    check: {
      q: 'A taxi driver hands you your bag from the trunk. What do you say?',
      options: [0, 2, 1],
      answer: 2,
      why: 'A stranger doing you a service: 감사합니다 is the natural choice. Said as 감사함니다.',
      wrong: '고마워 is for friends, and 고마워요 is friendly but a little casual for a stranger. 감사합니다 is the safe choice.',
    },
    moreTitle: 'More ways to say thanks',
    more: ids('wk_sugo', 'fc_meokgetseumnida', 'fc_meogeotseumnida', 'kd_chukahae'),
    faq: [
      { q: 'What is the difference between 감사합니다 and 고맙습니다?', a: 'Almost none in politeness. 감사 comes from Chinese, 고맙 is native Korean; 고맙습니다 can sound a little warmer. Both are safe with anyone.' },
      { q: 'Why is 감사합니다 pronounced 감사함니다?', a: 'The ㅂ in 합 comes right before ㄴ, and Korean turns ㅂ into ㅁ before ㄴ or ㅁ. The X-Ray above shows it: 합 → 함.' },
      { q: 'How do you answer thank you?', a: '아니에요 (anieyo), "it is nothing", or 별말씀을요 (byeolmalsseumeullyo), "don\'t mention it".' },
      { q: 'What does 수고하셨습니다 mean?', a: 'Literally "you worked hard". Koreans say it at the end of a shift or a meeting, where English might say thanks for today.' },
    ],
    cta: 'Thank you is phrase 1. There are 239 more',
  },
  {
    slug: 'i-love-you-in-korean',
    title: 'I Love You in Korean: 사랑해 (Saranghae) and 사랑해요 | HangulEdu',
    description: 'How to say I love you in Korean: 사랑해 (saranghae) to your partner, 사랑해요 (saranghaeyo) to family, 사랑합니다 to an audience. Hear it, see how it is built and what else couples say.',
    h1: 'How to say I love you in Korean',
    lead: 'To a partner it is 사랑해 (saranghae), the line every K-drama builds up to. Add 요 to say it to your parents, or go formal for a stage. Here is when each one fits.',
    hero: 0,
    heroNote: 'To your partner',
    forms: [
      phrase('kd_saranghae'),
      f({ ko: '사랑해요', en: 'I love you', register: 'polite', situation: 'To parents and grandparents, or sweetly to a partner', parts: [{ ko: '사랑', gloss: 'love' }, { ko: '해요', gloss: 'do (polite)' }], literal: 'love do' }),
      f({ ko: '사랑합니다', en: 'I love you', register: 'formal', situation: 'Speeches, fans to idols, adverts', parts: [{ ko: '사랑', gloss: 'love' }, { ko: '합니다', gloss: 'do (formal)' }], literal: 'love do' }),
    ],
    pick: {
      title: 'Who are you saying it to?',
      sub: 'Same love, three levels of politeness.',
      who: [
        { label: 'Your boyfriend or girlfriend', form: 0 },
        { label: 'Your mum or dad', form: 1 },
        { label: 'Your grandmother', form: 1 },
        { label: 'A crowd at a concert', form: 2 },
        { label: 'Your best friend, half joking', form: 0 },
      ],
    },
    check: {
      q: 'You call your mother on her birthday. How do you end the call?',
      options: [0, 1, 2],
      answer: 1,
      why: 'To a parent, polite 사랑해요 is warm and right. Many Koreans say 사랑해 to their mum too; 사랑합니다 would sound like a speech.',
      wrong: '사랑합니다 is for audiences and adverts; 사랑해 is for partners and close friends. 사랑해요 is the warm, polite choice for a parent.',
    },
    moreTitle: 'More from the Love & Dating pack',
    more: ids('lv_nado', 'kd_joahae', 'kd_bogo_sipeo', 'lv_bakke', 'lv_cheonnune', 'lv_jagiya'),
    faq: [
      { q: 'What does saranghae mean?', a: '사랑 is love and 해 is "do", so 사랑해 is literally "love do". Korean leaves out "I" and "you" when they are obvious.' },
      { q: 'Is saranghae only romantic?', a: 'Mostly. Friends say it jokingly, and families say 사랑해요 or 사랑해. For a crush, 좋아해 ("I like you") comes first.' },
      { q: 'How do you write I love you in Korean?', a: '사랑해: three blocks, 사 (sa), 랑 (rang) and 해 (hae). The 랑 block ends in ㅇ, which sounds like ng.' },
    ],
    cta: 'The whole Love & Dating pack, 30 phrases',
  },
  {
    slug: 'sorry-in-korean',
    title: "Sorry in Korean: 미안해, 죄송합니다 and When to Use Them | HangulEdu",
    description: "How to say sorry in Korean: 미안해 (mianhae) to friends, 미안해요 and 죄송해요 to most people, 죄송합니다 (joesonghamnida) when it is serious or formal. Hear each one and pick the right apology.",
    h1: 'How to say sorry in Korean',
    lead: 'Korean has two words for sorry: 미안 for everyday apologies and 죄송 when you owe more respect. Each comes in casual, polite and formal forms. Pick who you hurt and see what to say.',
    hero: 0,
    heroNote: 'To a friend or partner',
    forms: [
      phrase('kd_mianhae'),
      f({ ko: '미안해요', en: "I'm sorry", register: 'polite', situation: 'A colleague, someone you bumped into' }),
      f({ ko: '죄송해요', en: "I'm sorry", register: 'polite', situation: 'More respectful: an older person, a customer' }),
      f({ ko: '죄송합니다', en: "I'm sorry", register: 'formal', situation: 'Your boss, a teacher, a serious mistake', parts: [{ ko: '죄송', gloss: 'deeply sorry' }, { ko: '합니다', gloss: 'I do (formal)' }] }),
    ],
    pick: {
      title: 'Pick the right sorry',
      sub: 'Choose who you are apologizing to.',
      who: [
        { label: 'A friend you kept waiting', form: 0 },
        { label: 'Someone you bumped into on the street', form: 1 },
        { label: 'An older neighbor', form: 2 },
        { label: 'Your boss, after a mistake', form: 3 },
        { label: 'Your partner, after a fight', form: 0 },
      ],
    },
    check: {
      q: 'You arrive ten minutes late to a meeting with your manager. What do you say?',
      options: [0, 1, 3],
      answer: 3,
      why: 'Your manager is senior and you are at fault: 죄송합니다, said 죄송함니다.',
      wrong: '미안해 is for friends, and 미안해요 is too light for a manager. 죄송합니다 is the right apology at work.',
    },
    moreTitle: 'Apologies and what comes after',
    more: ids('wk_silsu', 'wk_josimhagetseumnida', 'kd_gwaenchana', 'kd_gwaenchanayo', 'fc_jeogiyo'),
    faq: [
      { q: 'What is the difference between 미안해요 and 죄송해요?', a: '죄송 is humbler. Use 미안해요 with equals and 죄송해요 or 죄송합니다 with anyone older, senior, or a customer.' },
      { q: 'How do you say excuse me?', a: 'To get past someone, 잠시만요 (jamsimanyo). To call a waiter, 저기요 (jeogiyo). 죄송합니다 also works when you bump into someone.' },
      { q: 'How do you answer an apology?', a: '괜찮아요 (gwaenchanayo), "it is okay", or 괜찮아 to a friend.' },
    ],
    cta: 'Apologize at work, in shops and in love: 240 phrases',
  },
  {
    slug: 'how-are-you-in-korean',
    title: 'How Are You in Korean: 잘 지냈어요? and What Koreans Really Ask | HangulEdu',
    description: 'How to say how are you in Korean: 잘 지냈어요? (jal jinaesseoyo) to someone you have not seen for a while, 잘 지냈어? to a friend. And why Koreans ask "have you eaten?" instead.',
    h1: 'How to say how are you in Korean',
    lead: 'Koreans do not ask "how are you" every day; 안녕하세요 already does that job. When you have not seen someone for a while, you ask 잘 지냈어요?, "have you been well?". And with people you care about, you ask whether they have eaten.',
    hero: 0,
    heroNote: 'To a friend you have not seen for a while',
    forms: [
      phrase('kd_jal_jinaesseo'),
      f({ ko: '잘 지냈어요', en: 'How have you been?', register: 'polite', situation: 'An old colleague, a friend of the family' }),
      f({ ko: '잘 지내셨어요', en: 'How have you been?', register: 'polite', situation: 'With extra respect: a teacher, an older relative' }),
    ],
    pick: {
      title: 'Who are you meeting again?',
      sub: 'Choose the person.',
      who: [
        { label: 'A school friend, after years', form: 0 },
        { label: 'A former colleague', form: 1 },
        { label: 'Your old teacher', form: 2 },
        { label: "Your friend's mother", form: 2 },
      ],
    },
    check: {
      q: 'You meet your university professor at a café, two years after graduating. What do you ask?',
      options: [0, 1, 2],
      answer: 2,
      why: 'A professor gets the honorific 시: 잘 지내셨어요?',
      wrong: '잘 지냈어 is for friends. 잘 지냈어요 is polite but leaves out the extra respect a professor gets: 잘 지내셨어요?',
    },
    moreTitle: 'What Koreans ask instead',
    more: ids('kd_bap_meogeosseo', 'kd_gwaenchana', 'kd_gwaenchanayo', 'kd_museun_iriya', 'fr_pigonhae'),
    faq: [
      { q: 'Why do Koreans ask if you have eaten?', a: '밥 먹었어? ("have you eaten?") is a way of saying "I care about you". A simple 네, 먹었어요 ("yes, I ate") is a fine answer, even if you have not.' },
      { q: 'How do you answer 잘 지냈어요?', a: '네, 잘 지냈어요 ("yes, I have been well"), then ask back: 잘 지냈어요?' },
      { q: 'Can I say 어떻게 지내요?', a: 'Yes, 어떻게 지내요? ("how are you getting on?") is common too, but it invites a longer answer than 잘 지냈어요?' },
    ],
    cta: 'Small talk, K-drama lines and 236 more phrases',
  },
  {
    slug: 'cute-in-korean',
    title: 'Cute in Korean: 귀여워 (Gwiyeowo) and Other Compliments | HangulEdu',
    description: 'How to say cute in Korean: 귀여워 (gwiyeowo) for puppies, babies and idols, 귀여워요 to be polite. Hear it, see why 귀엽다 changes shape, and learn pretty, cool and handsome too.',
    h1: 'How to say cute in Korean',
    lead: 'Point at a puppy and say 귀여워! (gwiyeowo). Add 요 to say it politely, or 귀엽다 to say it to yourself. Here is the whole family, with pretty, cool and handsome.',
    hero: 0,
    heroNote: 'Puppies, babies, idols',
    forms: [
      phrase('fr_gwiyeowo'),
      f({ ko: '귀여워요', en: "It's cute / You're cute", register: 'polite', situation: "Complimenting someone's child or pet" }),
      f({ ko: '귀엽다', en: 'So cute!', register: 'casual', situation: 'Thinking out loud, captions, comments' }),
    ],
    pick: {
      title: 'Who or what is cute?',
      sub: 'Choose the moment.',
      who: [
        { label: 'Your friend sends a puppy photo', form: 0 },
        { label: "A neighbor's baby", form: 1 },
        { label: 'Scrolling idol photos, to yourself', form: 2 },
        { label: 'Your partner', form: 0 },
      ],
    },
    check: {
      q: 'A woman at the park shows you her dog. What do you say to her?',
      options: [0, 1, 2],
      answer: 1,
      why: 'She is a stranger, so polite 귀여워요.',
      wrong: '귀여워 and 귀엽다 are casual. To a stranger, say 귀여워요.',
    },
    moreTitle: 'More compliments',
    more: ids('sm_yeppeoyo', 'lv_yeppeuda', 'fr_meositda', 'kd_jalsaenggyeotda', 'lv_simkung'),
    faq: [
      { q: 'Why does 귀엽다 become 귀여워?', a: 'Many describing words ending in ㅂ다 swap the ㅂ for 우 before a vowel: 귀엽 + 어 → 귀여워. 덥다 (hot) → 더워 works the same way.' },
      { q: 'What is aegyo?', a: 'Aegyo (애교) is acting cute on purpose: baby voice, pouting, finger hearts. It is common between couples and from idols to fans.' },
      { q: 'How do you say pretty in Korean?', a: '예뻐 (yeppeo) casually, 예뻐요 politely. For a man, 잘생겼다 (jalsaenggyeotda) means handsome.' },
    ],
    cta: 'Reactions, compliments and 235 more phrases',
  },
  {
    slug: 'cheers-in-korean',
    title: 'Cheers in Korean: 건배 (Geonbae) and 짠 | HangulEdu',
    description: 'How to say cheers in Korean: 건배 (geonbae), 짠 (jjan) with friends, 위하여 at company dinners. Hear it and learn the drinking manners Koreans actually follow.',
    h1: 'How to say cheers in Korean',
    lead: 'Raise your glass and say 건배! (geonbae). With friends you will hear 짠! more often, the sound of glasses clinking. At a company dinner someone proposes a toast and everyone shouts 위하여!',
    hero: 0,
    heroNote: 'Raising glasses',
    forms: [
      phrase('fc_geonbae'),
      f({ ko: '짠', en: 'Cheers! (clink)', register: 'casual', situation: 'Friends, soju night' }),
      f({ ko: '위하여', en: 'To us!', register: 'formal', situation: 'Company dinners, after a toast speech' }),
    ],
    pick: {
      title: 'Where are you drinking?',
      sub: 'Choose the table.',
      who: [
        { label: 'Soju with friends', form: 1 },
        { label: 'A wedding or a dinner with family', form: 0 },
        { label: 'A team dinner after the boss gives a toast', form: 2 },
      ],
    },
    check: {
      q: 'Your team leader stands up, says a few words about the project, and lifts a glass. What does everyone shout?',
      options: [1, 0, 2],
      answer: 2,
      why: 'After a toast speech at a work dinner, the whole table answers 위하여!',
      wrong: '건배 works almost anywhere and 짠 is for friends, but after a speech at a work dinner the answer is 위하여!',
    },
    moreTitle: 'At the table',
    more: ids('fc_meokgetseumnida', 'fc_jinjja_masitda', 'fc_masisseoyo', 'fc_mani_deuseyo', 'fc_meogeotseumnida'),
    faq: [
      { q: 'What does geonbae mean?', a: '건배 means "dry glass", like the Chinese ganbei. You do not have to empty your glass.' },
      { q: 'Are there drinking manners in Korea?', a: 'Pour for others, not yourself. Hold your glass with two hands when an older person pours, and turn your head slightly away when you drink in front of them.' },
    ],
    cta: 'Order, toast and pay: the Food & Café pack',
  },
  {
    slug: 'delicious-in-korean',
    title: 'Delicious in Korean: 맛있어요 (Masisseoyo) | HangulEdu',
    description: 'How to say delicious in Korean: 맛있어요 (masisseoyo), 맛있어 with friends, 진짜 맛있다 when it is really good. Hear it, see why it is said 마시써요, and learn what to say before and after a meal.',
    h1: 'How to say delicious in Korean',
    lead: 'Say 맛있어요 (masisseoyo) and the cook will smile. 맛 is taste and 있어요 is "there is": the food has taste. Here is how to say it to friends, to a host and to a whole restaurant.',
    hero: 1,
    heroNote: 'Complimenting the food',
    forms: [
      f({ ko: '맛있어', en: "It's good", register: 'casual', situation: 'Eating with friends' }),
      phrase('fc_masisseoyo'),
      f({ ko: '맛있습니다', en: 'It is delicious', register: 'formal', situation: 'A formal dinner, praising a host' }),
    ],
    pick: {
      title: 'Who cooked?',
      sub: 'Choose the table.',
      who: [
        { label: 'Your friend made ramyeon', form: 0 },
        { label: 'A restaurant owner asks how it is', form: 1 },
        { label: "Your partner's parents cooked dinner", form: 1 },
        { label: 'A business dinner, the host asks', form: 2 },
      ],
    },
    check: {
      q: 'The grandmother running a small restaurant asks if the soup is okay. What do you say?',
      options: [0, 1, 2],
      answer: 1,
      why: 'Polite and warm: 맛있어요! Said 마시써요.',
      wrong: '맛있어 is too casual for her, and 맛있습니다 is stiff in a small restaurant. 맛있어요 is just right.',
    },
    moreTitle: 'Before, during and after the meal',
    more: ids('fc_meokgetseumnida', 'fc_jinjja_masitda', 'fc_masitge', 'fc_baebulleoyo', 'fc_meogeotseumnida'),
    faq: [
      { q: 'Why is 맛있어요 said 마시써요?', a: 'Both final consonants slide into the next block, which starts with a silent ㅇ: 맛있 + 어 → 마시써. Some speakers say 마디써요; both are accepted.' },
      { q: 'How do you say it is not tasty?', a: '맛없어요 (madeopseoyo). Say it carefully: it is blunt.' },
      { q: 'What do Koreans say before eating?', a: '잘 먹겠습니다, "I will eat well", to whoever cooked or paid. After the meal: 잘 먹었습니다.' },
    ],
    cta: 'Order like a local: 30 Food & Café phrases',
  },
  {
    slug: 'please-in-korean',
    title: 'Please in Korean: 주세요 (Juseyo) and 해 주세요 | HangulEdu',
    description: 'How to say please in Korean: 주세요 (juseyo), "please give", after anything you want, and 해 주세요 for "please do". With real phrases for cafés, taxis and shops, each with audio.',
    h1: 'How to say please in Korean',
    lead: 'Korean has no single word for please. Put 주세요 (juseyo), "please give", after the thing you want: 이거 주세요, "this one, please". Put it after an action and it means "please do": 천천히 말씀해 주세요, "please speak slowly".',
    hero: 1,
    heroNote: 'Pointing at what you want',
    forms: [
      f({ ko: '줘', en: 'Give me', register: 'casual', situation: 'Friends and family only' }),
      phrase('fc_igeo_juseyo'),
      f({ ko: '주십시오', en: 'Please give', register: 'formal', situation: 'Signs, announcements, very formal requests' }),
    ],
    pick: {
      title: 'Who are you asking?',
      sub: 'Choose the person.',
      who: [
        { label: 'Your little brother, for the remote', form: 0 },
        { label: 'A café barista', form: 1 },
        { label: 'A taxi driver', form: 1 },
        { label: 'A sign at the airport', form: 2 },
      ],
    },
    check: {
      q: 'You want the menu. What do you say to the waiter?',
      options: [0, 1, 2],
      answer: 1,
      why: 'Anything + 주세요 is a polite request: 메뉴판 주세요.',
      wrong: '줘 is for family and friends, and 주십시오 belongs on signs. With staff, 주세요 is right.',
    },
    moreTitle: 'Please, in real situations',
    more: ids('fc_menyupan', 'fc_mul', 'wk_cheoncheonhi', 'ga_seweo', 'ga_dowajuseyo', 'fc_gyesan'),
    faq: [
      { q: 'Is there a word for please in Korean?', a: 'Not one that works everywhere. 주세요 after a thing, 해 주세요 after an action. 제발 (jebal) exists, but it means begging: "please, I beg you".' },
      { q: 'How do you call a waiter?', a: '저기요 (jeogiyo), "excuse me, over here". It is the normal way in Korea, not rude.' },
    ],
    cta: 'Ask for anything: 240 phrases with audio',
  },
  {
    slug: 'coffee-in-korean',
    title: 'Coffee in Korean: 커피 and How to Order at a Korean Café | HangulEdu',
    description: 'Coffee in Korean is 커피 (keopi). Here is how to order one: iced americano, hot or iced, no ice, to go or to stay, with audio for every phrase you need at a Korean café.',
    h1: 'How to say coffee in Korean',
    lead: 'Coffee is 커피 (keopi): Korean has no f sound, so it borrows p. Korea runs on iced americano, even in winter. Here is everything you need to order one.',
    hero: 0,
    heroNote: 'The word',
    forms: [f({ ko: '커피', en: 'Coffee', register: 'polite', situation: 'The word itself' })],
    check: {
      q: 'The barista asks 드시고 가세요? ("eating here?"). You want to take it away. What do you say?',
      options: [3, 4, 2],
      answer: 4,
      why: '포장해 주세요: "please wrap it", the Korean way to say to go.',
      wrong: '여기서 먹을게요 means you will stay, and 얼음 빼 주세요 asks for no ice. To go is 포장해 주세요.',
    },
    moreTitle: 'Order at a café',
    more: ids('fc_americano', 'fc_ttatteutan', 'fc_eoreum', 'fc_meogeulgeyo', 'fc_pojang', 'ga_waipai'),
    faq: [
      { q: 'Why is coffee 커피 and not 코피?', a: '코피 means a nosebleed. The English "o" in coffee is closer to Korean ㅓ, so it is 커피.' },
      { q: 'How do you say latte?', a: '라떼 (latte). Most café drinks are English words written in Hangul: 아메리카노, 카푸치노, 바닐라 라떼.' },
    ],
    cta: 'All 30 Food & Café phrases, offline',
  },
];

// Check options index into forms, or into `more` on a page with a single form (coffee).
export function checkOptions(p: PhrasePage): XPhrase[] {
  const pool = p.forms.length > 1 ? p.forms : p.more;
  return p.check.options.map((i) => pool[i]);
}
