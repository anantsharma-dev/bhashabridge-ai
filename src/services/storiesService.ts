export interface StoryWordToken {
  id: string;
  hindi: string;
  santhali: string;
  roman: string;
}

export interface StoryPage {
  pageNumber: number;
  paragraphHindi: string;
  paragraphSanthali: string;
  paragraphRoman: string;
  tokens: StoryWordToken[];
  illustrationTheme: string;
}

export interface BilingualStory {
  id: string;
  titleHindi: string;
  titleSanthali: string;
  titleRoman: string;
  category: 'folk' | 'nature' | 'animals' | 'values' | 'science' | 'history' | 'festivals' | 'rhymes';
  grade: number;
  readingMinutes: number;
  totalWords: number;
  coverEmoji: string;
  summary: string;
  pages: StoryPage[];
}

export const STORIES_DATABASE: BilingualStory[] = [
  // 1. Animals
  {
    id: 'fox-elephant',
    titleHindi: 'चालाक लोमड़ी और हाथी दादा',
    titleSanthali: 'ᱪᱟᱹᱞᱟᱹᱠ ᱛᱩᱭᱩ ᱟᱨ ᱦᱟᱹᱛᱤ ᱜᱚᱲᱚᱢ',
    titleRoman: 'Chalak Tuyu ar Hati Gorom',
    category: 'animals',
    grade: 1,
    readingMinutes: 3,
    totalWords: 45,
    coverEmoji: '🐘',
    summary: 'झारखंड के घने जंगलों में रहने वाले हाथी दादा और चतुर लोमड़ी की मनोरंजक कहानी।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'एक समय की बात है, दलमा के घने जंगल में एक बड़ा हाथी रहता था।',
        paragraphSanthali: 'ᱢᱤᱫᱴᱟᱝ ᱚᱠᱛᱚ ᱨᱮᱭᱟᱜ ᱠᱟᱛᱷᱟ, ᱫᱟᱞᱢᱟ ᱵᱤᱨ ᱨᱮ ᱢᱤᱫ ᱢᱟᱨᱟᱝ ᱦᱟᱹᱛᱤ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟᱭ ᱾',
        paragraphRoman: 'Midtang okto reyag katha, Dalma bir re mid marang hati tahen kanay.',
        tokens: [
          { id: 't1', hindi: 'एक', santhali: 'ᱢᱤᱫᱴᱟᱝ', roman: 'Midtang' },
          { id: 't2', hindi: 'समय', santhali: 'ᱚᱠᱛᱚ', roman: 'okto' },
          { id: 't3', hindi: 'जंगल में', santhali: 'ᱵᱤᱨ ᱨᱮ', roman: 'bir re' },
          { id: 't4', hindi: 'हाथी', santhali: 'ᱦᱟᱹᱛᱤ', roman: 'hati' },
        ],
        illustrationTheme: 'dalma_forest',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'हाथी दादा रोज नदी में नहाते और अपने सूंड से पानी उड़ाकर खेलते थे।',
        paragraphSanthali: 'ᱦᱟᱹᱛᱤ ᱜᱚᱲᱚᱢ ᱫᱤᱱᱟᱹᱢ ᱜᱟᱰᱟ ᱨᱮ ᱩᱢᱩᱜ-ᱟᱭ ᱟᱨ ᱥᱩᱸᱰ ᱛᱮ ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱠᱟᱛᱮ ᱠᱷᱮᱞᱟᱭ ᱾',
        paragraphRoman: 'Hati gorom dinam gada re umug-ay ar sund te dag chhitkaw kate khelay.',
        tokens: [
          { id: 't5', hindi: 'नदी में', santhali: 'ᱜᱟᱰᱟ ᱨᱮ', roman: 'gada re' },
          { id: 't6', hindi: 'पानी', santhali: 'ᱫᱟᱜ', roman: 'dag' },
        ],
        illustrationTheme: 'elephant_river',
      },
    ],
  },

  // 2. Nature & Forest
  {
    id: 'magic-mahua',
    titleHindi: 'जादुई महुआ का पेड़',
    titleSanthali: 'ᱡᱟᱹᱫᱩ ᱢᱟᱹᱛᱠᱚᱢ ᱫᱟᱨᱮ',
    titleRoman: 'Jadu Matkom Dare',
    category: 'nature',
    grade: 2,
    readingMinutes: 4,
    totalWords: 60,
    coverEmoji: '🌳',
    summary: 'गाँव के बच्चों को मीठे फल और शीतल छांव देने वाले महुआ वृक्ष की लोककथा।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'हमारे गाँव के किनारे एक बहुत पुराना और विशाल महुआ का पेड़ था।',
        paragraphSanthali: 'ᱟᱞᱮ ᱟᱹᱛᱩ ᱫᱷᱟᱨᱮ ᱨᱮ ᱢᱤᱫ ᱟᱹᱰᱤ ᱥᱮᱫᱟᱭ ᱟᱨ ᱢᱟᱨᱟᱝ ᱢᱟᱹᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱾',
        paragraphRoman: 'Ale atu dhare re mid adi seday ar marang matkom dare tahen kana.',
        tokens: [
          { id: 'm1', hindi: 'गाँव', santhali: 'ᱟᱹᱛᱩ', roman: 'atu' },
          { id: 'm2', hindi: 'महुआ', santhali: 'ᱢᱟᱹᱛᱠᱚᱢ', roman: 'matkom' },
          { id: 'm3', hindi: 'पेड़', santhali: 'ᱫᱟᱨᱮ', roman: 'dare' },
        ],
        illustrationTheme: 'mahua_tree',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'सुबह-सुबह हवा चलने पर महुआ के मीठे सुगंधित पीले फूल टप-टप गिरते थे।',
        paragraphSanthali: 'ᱥᱮᱛᱟᱜ-ᱥᱮᱛᱟᱜ ᱦᱚᱭ ᱛᱮ ᱢᱟᱹᱛᱠᱚᱢ ᱨᱮᱭᱟᱜ ᱦᱮᱲᱮᱢ ᱥᱟᱥᱟᱝ ᱵᱟᱦᱟ ᱧᱩᱨᱩᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ ᱾',
        paragraphRoman: 'Setag-setag hoy te matkom reyag herem sasang baha njurug kan tahend.',
        tokens: [
          { id: 'm4', hindi: 'सुबह', santhali: 'ᱥᱮᱛᱟᱜ', roman: 'setag' },
          { id: 'm5', hindi: 'फूल', santhali: 'ᱵᱟᱦᱟ', roman: 'baha' },
        ],
        illustrationTheme: 'mahua_flowers',
      },
    ],
  },

  // 3. Folk Tales
  {
    id: 'peacock-dance',
    titleHindi: 'बारिश और मोर का नाच',
    titleSanthali: 'ᱫᱟᱜ ᱫᱤᱱ ᱨᱮ ᱢᱟᱨᱟᱜ ᱮᱱᱮᱡ',
    titleRoman: 'Dag Din Re Marag Enej',
    category: 'folk',
    grade: 1,
    readingMinutes: 2,
    totalWords: 35,
    coverEmoji: '🦚',
    summary: 'पहली बारिश में पारसनाथ की वादियों में नाचते मोर की सुंदर बाल कहानी।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'जब काले बादल घिरते हैं, तब सुंदर मोर अपने पंख फैलाकर नाचता है।',
        paragraphSanthali: 'ᱡᱚᱠᱷᱚᱱ ᱦᱮᱸᱫᱮ ᱨᱤᱢᱤᱞ ᱨᱟᱠᱟᱵ-ᱟ, ᱩᱱ ᱡᱚᱦᱚᱜ ᱪᱮᱦᱨᱟ ᱢᱟᱨᱟᱜ ᱯᱷᱟᱹᱴᱭᱟᱹᱣ ᱠᱟᱛᱮ ᱮᱱᱮᱡ-ᱟᱭ ᱾',
        paragraphRoman: 'Jokhon hende rimil rakaba, un johog chehra marag phatyaw kate eneja.',
        tokens: [
          { id: 'p1', hindi: 'बादल', santhali: 'ᱨᱤᱢᱤᱞ', roman: 'rimil' },
          { id: 'p2', hindi: 'मोर', santhali: 'ᱢᱟᱨᱟᱜ', roman: 'marag' },
        ],
        illustrationTheme: 'rain_peacock',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'मोर की मधुर आवाज सुनकर जंगल के सभी पक्षी खुशी से गाने लगते हैं।',
        paragraphSanthali: 'ᱢᱟᱨᱟᱜ ᱨᱟᱜ ᱟᱸᱡᱚᱢ ᱠᱟᱛᱮ ᱵᱤᱨ ᱨᱤᱱ ᱡᱚᱛᱚ ᱪᱮᱬᱮ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮᱠᱚ ᱥᱮᱨᱮᱧᱟ ᱾',
        paragraphRoman: 'Marag rag anjom kate bir rin joto chene raska teko serenja.',
        tokens: [
          { id: 'p3', hindi: 'चिड़िया', santhali: 'ᱪᱮᱬᱮ', roman: 'chene' },
          { id: 'p4', hindi: 'गीत', santhali: 'ᱥᱮᱨᱮᱧ', roman: 'serenj' },
        ],
        illustrationTheme: 'forest_birds',
      },
    ],
  },

  // 4. Tribal Heroes & History
  {
    id: 'birsa-munda',
    titleHindi: 'धरती आबा बिरसा मुंडा का बचपन',
    titleSanthali: 'ᱫᱷᱟᱹᱨᱛᱤ ᱟᱵᱟ ᱵᱤᱨᱥᱟ ᱢᱩᱱᱰᱟ ᱦᱟᱜ ᱜᱤᱫᱽᱨᱟᱹ ᱚᱠᱛᱚ',
    titleRoman: 'Dharti Aba Birsa Munda Hag Gidra Okto',
    category: 'history',
    grade: 3,
    readingMinutes: 4,
    totalWords: 75,
    coverEmoji: '🏹',
    summary: 'उलिहातु गाँव में बांसुरी बजाने वाले बालक बिरसा के साहस और प्रकृति प्रेम की अमर गाथा।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'उलिहातु की सुरम्य पहाड़ियों में नन्हे बिरसा अपनी बांसुरी से मधुर धुन बजाते थे।',
        paragraphSanthali: 'ᱩᱞᱤᱦᱟᱛᱩ ᱵᱩᱨᱩ ᱨᱮ ᱠᱟᱹᱴᱤᱡ ᱵᱤᱨᱥᱟ ᱟᱡᱟᱜ ᱛᱤᱨᱭᱟᱹᱣ ᱛᱮ ᱥᱤᱵᱤᱞ ᱨᱟᱦᱟᱭ ᱚᱨᱚᱝ ᱮᱫ ᱛᱟᱦᱮᱸᱫ ᱾',
        paragraphRoman: 'Ulihatu buru re katij Birsa ajag tiryaw te sibil rahay orong ed tahend.',
        tokens: [
          { id: 'b1', hindi: 'पहाड़', santhali: 'ᱵᱩᱨᱩ', roman: 'buru' },
          { id: 'b2', hindi: 'बांसुरी', santhali: 'ᱛᱤᱨᱭᱟᱹᱣ', roman: 'tiryaw' },
        ],
        illustrationTheme: 'birsa_childhood',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'वे जंगल के पेड़ों और वन्य जीवों से बहुत प्रेम करते थे और हमेशा सबकी मदद करते थे।',
        paragraphSanthali: 'ᱩᱱᱤ ᱫᱚ ᱵᱤᱨ ᱨᱮᱭᱟᱜ ᱫᱟᱨᱮ ᱟᱨ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱟᱹᱰᱤ ᱫᱩᱞᱟᱹᱲ ᱮᱫ ᱠᱚ ᱛᱟᱦᱮᱸᱫ ᱾',
        paragraphRoman: 'Uni do bir reyag dare ar jib jiyali adi dular ed ko tahend.',
        tokens: [
          { id: 'b3', hindi: 'पेड़', santhali: 'ᱫᱟᱨᱮ', roman: 'dare' },
          { id: 'b4', hindi: 'प्यार', santhali: 'ᱫᱩᱞᱟᱹᱲ', roman: 'dular' },
        ],
        illustrationTheme: 'birsa_forest',
      },
    ],
  },

  // 5. Festivals
  {
    id: 'sohrai-festival',
    titleHindi: 'सोहराय की सुबह और रंगीन दीवारें',
    titleSanthali: 'ᱥᱚᱦᱨᱟᱭ ᱥᱮᱛᱟᱜ ᱟᱨ ᱵᱷᱤᱛ ᱨᱮ ᱪᱤᱛᱟᱹᱨ',
    titleRoman: 'Sohrai Setag ar Bhit re Chitar',
    category: 'festivals',
    grade: 2,
    readingMinutes: 3,
    totalWords: 50,
    coverEmoji: '🎨',
    summary: 'धान कटाई के बाद घरों की दीवारों पर प्राकृतिक रंगों से कलाकृतियां उकेरने का उत्सव।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'धान कटने के बाद कार्तिक माह में हमारे गाँव में सोहराय पर्व धूमधाम से मनाया जाता है।',
        paragraphSanthali: 'ᱦᱳᱲᱳ ᱤᱨ ᱛᱟᱭᱚᱢ ᱟᱞᱮ ᱟᱹᱛᱩ ᱨᱮ ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱟᱹᱰᱤ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮᱞᱮ ᱢᱟᱱᱟᱣᱟ ᱾',
        paragraphRoman: 'Horo ir tayom ale atu re Sohrai parab adi raska tele manawa.',
        tokens: [
          { id: 's1', hindi: 'धान', santhali: 'ᱦᱳᱲᱳ', roman: 'horo' },
          { id: 's2', hindi: 'त्योहार', santhali: 'ᱯᱟᱨᱟᱵᱽ', roman: 'parab' },
        ],
        illustrationTheme: 'sohrai_art',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'दीदी मिट्टी की दीवारों पर लाल, सफेद और काले प्राकृतिक रंगों से हाथी और मोर के चित्र बनाती है।',
        paragraphSanthali: 'ᱫᱟᱹᱭ ᱦᱟᱥᱟ ᱵᱷᱤᱛ ᱨᱮ ᱟᱨᱟᱜ, ᱯᱩᱸᱰ ᱟᱨ ᱦᱮᱸᱫᱮ ᱨᱚᱝ ᱛᱮ ᱦᱟᱹᱛᱤ ᱟᱨ ᱢᱟᱨᱟᱜ ᱪᱤᱛᱟᱹᱨ ᱮ ᱵᱮᱱᱟᱣᱟ ᱾',
        paragraphRoman: 'Day hasa bhit re arag, pund ar hende rong te hati ar marag chitar e benawa.',
        tokens: [
          { id: 's3', hindi: 'दीवार', santhali: 'ᱵᱷᱤᱛ', roman: 'bhit' },
          { id: 's4', hindi: 'चित्र', santhali: 'ᱪᱤᱛᱟᱹᱨ', roman: 'chitar' },
        ],
        illustrationTheme: 'wall_painting',
      },
    ],
  },

  // 6. Values & Empathy
  {
    id: 'little-ant',
    titleHindi: 'नन्ही चींटी और एकता की शक्ति',
    titleSanthali: 'ᱦᱩᱰᱤᱧ ᱢᱩᱡᱽ ᱟᱨ ᱡᱩᱢᱤᱫᱽ ᱫᱟᱲᱮ',
    titleRoman: 'Hudin Muj ar Jumid Dare',
    category: 'values',
    grade: 1,
    readingMinutes: 2,
    totalWords: 40,
    coverEmoji: '🐜',
    summary: 'मिलजुलकर काम करने की शक्ति सिखाने वाली एक छोटी चींटी की प्रेरणादायक कहानी।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'एक नन्ही चींटी चीनी का बड़ा दाना उठाने की कोशिश कर रही थी।',
        paragraphSanthali: 'ᱢᱤᱫ ᱦᱩᱰᱤᱧ ᱢᱩᱡᱽ ᱢᱤᱫ ᱢᱟᱨᱟᱝ ᱪᱤᱱᱤ ᱫᱟᱱᱟ ᱛᱩᱞ ᱮᱫ ᱛᱟᱦᱮᱸᱫ ᱾',
        paragraphRoman: 'Mid hudin muj mid marang chini dana tul ed tahend.',
        tokens: [
          { id: 'v1', hindi: 'चींटी', santhali: 'ᱢᱩᱡᱽ', roman: 'muj' },
          { id: 'v2', hindi: 'बड़ा', santhali: 'ᱢᱟᱨᱟᱝ', roman: 'marang' },
        ],
        illustrationTheme: 'little_ant',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'तभी उसके दोस्त आए और सबने मिलकर दाना अपने बिल तक आसानी से पहुँचा दिया।',
        paragraphSanthali: 'ᱩᱱ ᱡᱚᱦᱚᱜ ᱟᱡ ᱨᱤᱱ ᱜᱟᱛᱮ ᱠᱚ ᱦᱮᱡ ᱮᱱᱟ ᱟᱨ ᱡᱚᱛᱚ ᱦᱚᱲ ᱢᱤᱞᱟᱹᱣ ᱠᱟᱛᱮ ᱫᱟᱱᱟ ᱠᱚ ᱤᱫᱤ ᱠᱮᱫ-ᱟ ᱾',
        paragraphRoman: 'Un johog aj rin gate ko hej ena ar joto hor milaw kate dana ko idi ked-a.',
        tokens: [
          { id: 'v3', hindi: 'दोस्त', santhali: 'ᱜᱟᱛᱮ', roman: 'gate' },
          { id: 'v4', hindi: 'एकता', santhali: 'ᱡᱩᱢᱤᱫᱽ', roman: 'jumid' },
        ],
        illustrationTheme: 'teamwork_ants',
      },
    ],
  },

  // 7. Science & Curiosity
  {
    id: 'why-stars-twinkle',
    titleHindi: 'तारे रात में क्यों चमकते हैं?',
    titleSanthali: 'ᱤᱯᱤᱞ ᱧᱤᱫᱟᱹ ᱪᱮᱫᱟᱜ ᱠᱚ ᱡᱩᱞᱩᱜ-ᱟ?',
    titleRoman: 'Ipil Njidah Chedag Ko Julug-a?',
    category: 'science',
    grade: 2,
    readingMinutes: 3,
    totalWords: 45,
    coverEmoji: '⭐',
    summary: 'रात के नीले आकाश में टिमटिमाते तारों और हवा की तरंगों का वैज्ञानिक रहस्य।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'रात में जब हम खुले आँगन में सोते हैं, तो आकाश में चमकते तारे देखते हैं।',
        paragraphSanthali: 'ᱧᱤᱫᱟᱹ ᱡᱚᱠᱷᱚᱱ ᱨᱟᱪᱟ ᱨᱮ ᱵᱚᱱ ᱜᱤᱛᱤᱡ-ᱟ, ᱩᱱ ᱡᱚᱦᱚᱜ ᱥᱮᱨᱢᱟ ᱨᱮ ᱡᱩᱞᱩᱜ ᱤᱯᱤᱞ ᱵᱚᱱ ᱧᱮᱞ ᱠᱚᱣᱟ ᱾',
        paragraphRoman: 'Njida jokhon racha re bon gitij-a, un johog serma re julug ipil bon njel kowa.',
        tokens: [
          { id: 'sc1', hindi: 'रात', santhali: 'ᱧᱤᱫᱟᱹ', roman: 'njida' },
          { id: 'sc2', hindi: 'तारे', santhali: 'ᱤᱯᱤᱞ', roman: 'ipil' },
        ],
        illustrationTheme: 'night_sky',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'तारे बहुत दूर होते हैं और उनका प्रकाश वायुमंडल की परतों से होकर टिमटिमाता है।',
        paragraphSanthali: 'ᱤᱯᱤᱞ ᱫᱚ ᱟᱹᱰᱤ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ ᱟᱨ ᱦᱚᱭ ᱛᱟᱞᱟ ᱛᱮ ᱩᱱᱠᱩᱣᱟᱜ ᱢᱟᱨᱥᱟᱞ ᱡᱷᱤᱞᱢᱤᱞᱟᱜ-ᱟ ᱾',
        paragraphRoman: 'Ipil do adi sanginj re menag kowa ar hoy tala te unkuwag marsal jhilmilaga.',
        tokens: [
          { id: 'sc3', hindi: 'रोशनी', santhali: 'ᱢᱟᱨᱥᱟᱞ', roman: 'marsal' },
          { id: 'sc4', hindi: 'दूर', santhali: 'ᱥᱟᱺᱜᱤᱧ', roman: 'sanginj' },
        ],
        illustrationTheme: 'twinkling_stars',
      },
    ],
  },

  // 8. Rhymes & Songs
  {
    id: 'johar-rhyme',
    titleHindi: 'जोहार जोहार कक्षा कविता',
    titleSanthali: 'ᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱥᱮᱨᱮᱧ',
    titleRoman: 'Johar Johar Gidra Serenj',
    category: 'rhymes',
    grade: 1,
    readingMinutes: 2,
    totalWords: 30,
    coverEmoji: '🎵',
    summary: 'सुबह की प्रार्थना और आत्मीय अभिवादन का संगीतमय संथाली बाल गीत।',
    pages: [
      {
        pageNumber: 1,
        paragraphHindi: 'सूरज निकला हुआ सवेरा, पक्षियों ने मिलकर गाया तराना।',
        paragraphSanthali: 'ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱮᱱ ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ, ᱪᱮᱬᱮ ᱠᱚ ᱥᱮᱨᱮᱧ ᱠᱮᱫ-ᱟ ᱨᱟᱹᱥᱠᱟᱹ ᱨᱟᱦᱟ ᱾',
        paragraphRoman: 'Bera rakab en sagun setag, chene ko serenj ked-a raska raha.',
        tokens: [
          { id: 'r1', hindi: 'सूरज', santhali: 'ᱵᱮᱲᱟ', roman: 'bera' },
          { id: 'r2', hindi: 'सुप्रभात', santhali: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ', roman: 'sagun setag' },
        ],
        illustrationTheme: 'morning_sun',
      },
      {
        pageNumber: 2,
        paragraphHindi: 'हाथ जोड़कर बोले जोहार, आओ मिलकर करें प्यार और सत्कार।',
        paragraphSanthali: 'ᱛᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱵᱚᱱ ᱢᱮᱱᱟ ᱡᱚᱦᱟᱨ, ᱫᱮᱞᱟᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ ᱫᱩᱞᱟᱹᱲ ᱟᱨ ᱥᱟᱨᱦᱟᱣ ᱾',
        paragraphRoman: 'Ti joraw kate bon mena Johar, delabon chedog-a dular ar sarhaw.',
        tokens: [
          { id: 'r3', hindi: 'हाथ', santhali: 'ᱛᱤ', roman: 'ti' },
          { id: 'r4', hindi: 'जोहार', santhali: 'ᱡᱚᱦᱟᱨ', roman: 'johar' },
        ],
        illustrationTheme: 'johar_greeting',
      },
    ],
  },
];

class StoriesService {
  public getAllStories(): BilingualStory[] {
    return STORIES_DATABASE;
  }

  public getStoriesByCategory(category: string): BilingualStory[] {
    const matched = STORIES_DATABASE.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    return matched.length > 0 ? matched : [STORIES_DATABASE[0]];
  }

  public getStoryById(id: string): BilingualStory | undefined {
    return STORIES_DATABASE.find((s) => s.id === id);
  }
}

export const storiesService = new StoriesService();
export default storiesService;
