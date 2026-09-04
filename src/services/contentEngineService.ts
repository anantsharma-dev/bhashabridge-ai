export interface DailyWord {
  wordHindi: string;
  wordSanthali: string;
  wordLatin: string;
  wordEnglish: string;
  sentenceHindi: string;
  sentenceSanthali: string;
  culturalFact: string;
  category: string;
}

export interface ExplorerItem {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  district: string;
  description: string;
  funFact: string;
  floraOrFauna?: string[];
}

export interface AskJoharAnswer {
  answer: string;
  santhaliVocabulary?: { word: string; roman: string; meaning: string };
  suggestedAction?: string;
}

const DAILY_WORDS: DailyWord[] = [
  {
    wordHindi: 'हाथी',
    wordSanthali: 'ᱦᱟᱹᱛᱤ',
    wordLatin: 'Hati',
    wordEnglish: 'Elephant',
    sentenceHindi: 'हाथी बहुत विशाल और बुद्धिमान पशु है।',
    sentenceSanthali: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱟᱨ ᱥᱮᱬᱟ ᱡᱤᱵᱽ ᱠᱟᱱᱟᱭ ᱾',
    culturalFact: 'झारखंड का राज्य पशु हाथी है, जो दलमा के जंगलों में शान से विचरता है।',
    category: 'Fauna',
  },
  {
    wordHindi: 'साल वृक्ष',
    wordSanthali: 'ᱥᱟᱨᱡᱚᱢ',
    wordLatin: 'Sarjom',
    wordEnglish: 'Sal Tree',
    sentenceHindi: 'साल का पेड़ झारखंड के जंगलों की शान है।',
    sentenceSanthali: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱫᱚ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱵᱤᱨ ᱨᱮᱭᱟᱜ ᱢᱟᱹᱱ ᱠᱟᱱᱟ ᱾',
    culturalFact: 'सरहुल पर्व में साल के नए फूलों की पूजा प्रकृति के प्रति कृतज्ञता प्रकट करने के लिए की जाती है।',
    category: 'Flora',
  },
  {
    wordHindi: 'मयूर (मोर)',
    wordSanthali: 'ᱢᱟᱨᱟᱜ',
    wordLatin: 'Marag',
    wordEnglish: 'Peacock',
    sentenceHindi: 'मोर बारिश की पहली बूंदों पर सुंदर नृत्य करता है।',
    sentenceSanthali: 'ᱢᱟᱨᱟᱜ ᱫᱚ ᱫᱟᱜ ᱧᱩᱨ ᱡᱚᱠᱷᱮᱡ ᱟᱹᱰᱤ ᱪᱚᱨᱚᱠ-ᱮ ᱮᱱᱮᱡ-ᱟ ᱾',
    culturalFact: 'सारंडा के घने जंगलों में जंगली मोर सुबह के समय गाते हुए देखे जा सकते हैं।',
    category: 'Fauna',
  },
];

const FORESTS: ExplorerItem[] = [
  {
    id: 'saranda',
    titleHindi: 'सारंडा वन — ७०० पहाड़ियों की भूमि',
    titleEnglish: 'Saranda Forest (The Land of 700 Hills)',
    district: 'West Singhbhum',
    description: 'एशिया का सबसे बड़ा साल वन, जो समृद्ध हो और मुंडा जनजातीय संस्कृति का घर है।',
    funFact: 'यहाँ की पत्तियों की छत्रछाया इतनी घनी है कि कई जगहों पर सूर्य की किरणें ज़मीन तक नहीं पहुँचतीं।',
    floraOrFauna: ['Sal Tree', 'Flying Squirrel', 'Wild Elephant', 'Barking Deer'],
  },
  {
    id: 'dalma',
    titleHindi: 'दलमा वन्यजीव अभयारण्य',
    titleEnglish: 'Dalma Wildlife Sanctuary',
    district: 'East Singhbhum',
    description: 'हाथियों के प्राकृतिक गलियारे के रूप में प्रसिद्ध सुंदर पहाड़ी वन।',
    funFact: 'दलमा की चोटी पर प्रसिद्ध शिव मंदिर है जहाँ से स्वर्णरेखा नदी की घाटी दिखाई देती है।',
    floraOrFauna: ['Indian Elephant', 'Sloth Bear', 'Indian Peafowl'],
  },
];

const RIVERS: ExplorerItem[] = [
  {
    id: 'subarnarekha',
    titleHindi: 'स्वर्णरेखा नदी',
    titleEnglish: 'Subarnarekha River',
    district: 'Ranchi, Singhbhum',
    description: 'नगड़ी गाँव से निकलने वाली पवित्र नदी, जिसके रेत के कणों में सोने के कण पाए जाते थे।',
    funFact: 'हुंडरू जलप्रपात इसी नदी पर स्थित है, जो ९८ मीटर ऊँचाई से गिरता है।',
  },
  {
    id: 'mayurakshi',
    titleHindi: 'मयूराक्षी नदी',
    titleEnglish: 'Mayurakshi River',
    district: 'Dumka',
    description: 'संथाल परगना की जीवनरेखा, जिस पर प्रसिद्ध मसानजोर बाँध स्थित है।',
    funFact: 'मयूराक्षी का अर्थ है "मोर की आँख के समान स्वच्छ जल वाली नदी"।',
  },
];

class ContentEngineService {
  public getDailyWord(): DailyWord {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_WORDS[dayOfYear % DAILY_WORDS.length];
  }

  public getDailyFact(): string {
    return 'संताली भाषा की अपनी लिपि "ओल चिकी" का आविष्कार पंडित रघुनाथ मुर्मू ने १९२५ में किया था।';
  }

  public getDidYouKnow(): string {
    return 'झारखंड शब्द का शाब्दिक अर्थ "झाड़ियों और वनों का भूखंड" (Land of Forests) होता है।';
  }

  public getBirdOfJharkhand(): { name: string; santhali: string; fact: string } {
    return {
      name: 'कोयल (Asian Koel)',
      santhali: 'ᱠᱩᱦᱩ (Kuhu)',
      fact: 'कोयल झारखंड का राज्य पक्षी है। इसकी मीठी कूक वसंत ऋतु के आगमन का संदेश देती है।',
    };
  }

  public getForestExplorer(): ExplorerItem[] {
    return FORESTS;
  }

  public getRiverExplorer(): ExplorerItem[] {
    return RIVERS;
  }

  // Ask Johar Offline Educational Bot
  public askJohar(query: string): AskJoharAnswer {
    const q = query.toLowerCase();

    if (q.includes('हाथी') || q.includes('elephant')) {
      return {
        answer: 'हाथी को संताली (ओल चिकी) में "ᱦᱟᱹᱛᱤ" (Hati) कहते हैं। यह झारखंड का राज्य पशु भी है!',
        santhaliVocabulary: { word: 'ᱦᱟᱹᱛᱤ', roman: 'Hati', meaning: 'Elephant' },
        suggestedAction: 'Explore Animals Flashcard Deck',
      };
    }

    if (q.includes('नमस्ते') || q.includes('hello') || q.includes('जोहार')) {
      return {
        answer: 'जोहार! "ᱡᱚᱦᱟᱨ" संताली और झारखंड की सभी जनजातीय संस्कृतियों में आत्मीय अभिवादन है। इसका अर्थ प्रकृति और सभी जीवों का सत्कार करना है।',
        santhaliVocabulary: { word: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', meaning: 'Greetings / Respectful Salutation' },
      };
    }

    if (q.includes('गिनती') || q.includes('number') || q.includes('एक') || q.includes('गिन')) {
      return {
        answer: 'संताली में १ को "ᱢᱤᱫ" (Mid), २ को "ᱵᱟᱨ" (Bar), ३ को "ᱯᱮ" (Pe) और ४ को "ᱯᱩᱱ" (Pun) कहते हैं।',
        santhaliVocabulary: { word: 'ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ', roman: 'Mid, Bar, Pe', meaning: 'One, Two, Three' },
        suggestedAction: 'Practice Math Counting Flashcards',
      };
    }

    if (q.includes('बिरसा') || q.includes('birsa')) {
      return {
        answer: 'भगवान बिरसा मुंडा झारखंड के महान स्वतंत्रता सेनानी और आदिवासी नायक थे। उन्होंने "उलगुलान" आंदोलन का नेतृत्व किया था।',
        suggestedAction: 'Read "Birsa Munda: The Forest Guardian" Storybook',
      };
    }

    return {
      answer: `जोहार! आपने पूछा: "${query}"। मैं झारखंड प्राथमिक कक्षाओं के लिए आपका गाइड हूँ। आप मुझसे संताली शब्दों, कहानियों, गणित या स्थानीय प्रकृति के बारे में पूछ सकते हैं!`,
    };
  }
}

export const contentEngineService = new ContentEngineService();
export default contentEngineService;
