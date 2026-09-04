import type { ReactNode } from 'react';
import React from 'react';
import type { FlashcardData } from '../components/flashcards/FlashcardCard';
import {
  CuteElephant,
  CuteMango,
  CountingBlocks,
  StoryBook,
} from '../components/ui/DashboardIllustrations';
import { JoharHornbill } from '../components/ui/JoharHornbill';

export interface BilingualFlashcardItem {
  id: string;
  hindi: string;
  santhali: string;
  santhaliLatin: string;
  english: string;
  category: string;
  grade: number;
  sampleSentenceHindi: string;
  sampleSentenceSanthali: string;
  didYouKnow?: string;
  renderIllustration?: () => ReactNode;
}

export const CURRICULUM_FLASHCARDS: BilingualFlashcardItem[] = [
  // 1. Animals (ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ)
  {
    id: 'elephant',
    hindi: 'हाथी',
    santhali: 'ᱦᱟᱹᱛᱤ',
    santhaliLatin: 'Hati',
    english: 'Elephant',
    category: 'animals',
    grade: 1,
    sampleSentenceHindi: 'हाथी बहुत बड़ा और शक्तिशाली पशु है।',
    sampleSentenceSanthali: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱡᱤᱵᱽ ᱠᱟᱱᱟᱭ ᱾',
    didYouKnow: 'झारखंड का राज्य पशु हाथी है। दलमा और पलामू के जंगलों में हाथी झुंड में रहते हैं।',
    renderIllustration: () => React.createElement(CuteElephant, { size: 105 }),
  },
  {
    id: 'tiger',
    hindi: 'बाघ',
    santhali: 'ᱛᱟᱹᱨᱩᱵ',
    santhaliLatin: 'Tarub',
    english: 'Tiger',
    category: 'animals',
    grade: 2,
    sampleSentenceHindi: 'बाघ भारत का राष्ट्रीय पशु है।',
    sampleSentenceSanthali: 'ᱛᱟᱹᱨᱩᱵ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱫᱤᱥᱚᱢ ᱡᱤᱵᱽ ᱠᱟᱱᱟᱭ ᱾',
    didYouKnow: 'पलामू टाइगर रिजर्व झारखंड में स्थित है, जहाँ 1932 में दुनिया की पहली बाघ गणना हुई थी।',
  },
  {
    id: 'deer',
    hindi: 'हिरण',
    santhali: 'ᱡᱤᱞ',
    santhaliLatin: 'Jil',
    english: 'Deer',
    category: 'animals',
    grade: 1,
    sampleSentenceHindi: 'हिरण जंगल में तेज़ी से दौड़ता है।',
    sampleSentenceSanthali: 'ᱡᱤᱞ ᱫᱚ ᱵᱤᱨ ᱨᱮ ᱟᱹᱰᱤ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲᱟᱭ ᱾',
    didYouKnow: 'चीतल हिरण संथाली लोककथाओं में चपलता और जंगल की सुंदरता का प्रतीक है।',
  },
  {
    id: 'goat',
    hindi: 'बकरी',
    santhali: 'ᱢᱮᱨᱚᱢ',
    santhaliLatin: 'Merom',
    english: 'Goat',
    category: 'animals',
    grade: 1,
    sampleSentenceHindi: 'बकरी हरी घास चरती है।',
    sampleSentenceSanthali: 'ᱢᱮᱨᱚᱢ ᱫᱚ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱜᱷᱟᱥᱮ ᱡᱚᱢᱟ ᱾',
    didYouKnow: 'संथाली संस्कृति में सोहराय पर्व पर घरेलू पशुओं की पूजा और विशेष देखभाल की जाती है।',
  },
  {
    id: 'cow',
    hindi: 'गाय',
    santhali: 'ᱰᱟᱝᱜᱽᱨᱟ',
    santhaliLatin: 'Dangra',
    english: 'Cow / Cattle',
    category: 'animals',
    grade: 1,
    sampleSentenceHindi: 'गाय हमें पौष्टिक दूध देती है।',
    sampleSentenceSanthali: 'ᱰᱟᱝᱜᱽᱨᱟ ᱫᱚ ᱟᱵᱚ ᱛᱚᱣᱟᱭ ᱮᱢᱟᱵᱚᱱᱟ ᱾',
    didYouKnow: 'सोहराय पर्व के पहले दिन गाय-बैलों के सींगों पर सरसों तेल व सिंदूर लगाकर सम्मानित किया जाता है।',
  },
  {
    id: 'dog',
    hindi: 'कुत्ता',
    santhali: 'ᱥᱮᱛᱟ',
    santhaliLatin: 'Seta',
    english: 'Dog',
    category: 'animals',
    grade: 1,
    sampleSentenceHindi: 'कुत्ता घर की रखवाली करता है।',
    sampleSentenceSanthali: 'ᱥᱮᱛᱟ ᱫᱚ ᱚᱲᱟᱜ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ ᱾',
    didYouKnow: 'गाँव में कुत्ता सबसे वफादार साथी माना जाता है और शिकार व रखवाली में साथ रहता है।',
  },

  // 2. Birds of Jharkhand (ᱪᱮᱬᱮ)
  {
    id: 'peacock',
    hindi: 'मोर',
    santhali: 'ᱢᱟᱨᱟᱜ',
    santhaliLatin: 'Marag',
    english: 'Peacock',
    category: 'birds',
    grade: 1,
    sampleSentenceHindi: 'मोर बारिश में नाचता है।',
    sampleSentenceSanthali: 'ᱢᱟᱨᱟᱜ ᱫᱚ ᱫᱟᱜ ᱨᱮ ᱮᱱᱮᱡ-ᱟᱭ ᱾',
    didYouKnow: 'संथाली में मोर को "माराग" कहते हैं। इसके पंखों का उपयोग पारंपरिक नृत्यों में होता है।',
    renderIllustration: () => React.createElement(JoharHornbill, { size: 'md' }),
  },
  {
    id: 'sparrow',
    hindi: 'गौरैया',
    santhali: 'ᱪᱮᱬᱮ',
    santhaliLatin: 'Chene',
    english: 'Sparrow / Bird',
    category: 'birds',
    grade: 1,
    sampleSentenceHindi: 'चिड़िया पेड़ की डाली पर बैठी है।',
    sampleSentenceSanthali: 'ᱪᱮᱬᱮ ᱫᱚ ᱫᱟᱨᱮ ᱰᱟᱹᱨ ᱨᱮ ᱫᱩᱲᱩᱵ ᱟᱠᱟᱱᱟᱭ ᱾',
    didYouKnow: 'चिड़िया (ᱪᱮᱬᱮ) पर्यावरण की मित्र है और अनाज के दानों तथा कीट-पतंगों को खाती है।',
  },
  {
    id: 'hornbill',
    hindi: 'हॉर्नबिल (धनेश)',
    santhali: 'ᱢᱤᱨᱩ',
    santhaliLatin: 'Miru',
    english: 'Great Hornbill',
    category: 'birds',
    grade: 2,
    sampleSentenceHindi: 'हॉर्नबिल पक्षी हमारी भाषा का प्यारा शुभंकर (मस्कट) है।',
    sampleSentenceSanthali: 'ᱢᱤᱨᱩ ᱪᱮᱬᱮ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱨᱤᱱᱤᱡ ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ ᱠᱟᱱᱟᱭ ᱾',
    didYouKnow: 'जोहार हॉर्नबिल भाषाब्रिज का शुभंकर है जो बच्चों को सीखने और सही उच्चारण के लिए प्रोत्साहित करता है।',
    renderIllustration: () => React.createElement(JoharHornbill, { size: 'md' }),
  },
  {
    id: 'pigeon',
    hindi: 'कबूतर',
    santhali: 'ᱯᱟᱹᱨᱣᱟᱹ',
    santhaliLatin: 'Parwa',
    english: 'Pigeon',
    category: 'birds',
    grade: 1,
    sampleSentenceHindi: 'कबूतर छत पर दाना चुगता है।',
    sampleSentenceSanthali: 'ᱯᱟᱹᱨᱣᱟᱹ ᱫᱚ ᱪᱷᱟᱛ ᱨᱮ ᱡᱚᱢᱟᱜ-ᱮ ᱦᱟᱞᱟᱝ-ᱟ ᱾',
    didYouKnow: 'संथाली घरों में कबूतरों के लिए खपड़ैल छतों के नीचे सुरक्षित घोंसले बनाए जाते हैं।',
  },

  // 3. Fruits (ᱡᱚ)
  {
    id: 'mango',
    hindi: 'आम',
    santhali: 'ᱩᱞ',
    santhaliLatin: 'Ul',
    english: 'Mango',
    category: 'fruits',
    grade: 1,
    sampleSentenceHindi: 'मीठा रसीला आम झारखंड में खूब फलता है।',
    sampleSentenceSanthali: 'ᱦᱮᱲᱮᱢ ᱩᱞ ᱫᱚ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱵᱷᱟᱹᱜᱤ ᱡᱚ ᱠᱟᱱᱟ ᱾',
    didYouKnow: 'आम को फलों का राजा कहा जाता है। झारखंड के ग्रामीण हाटों में रसीले आम खूब बिकते हैं।',
    renderIllustration: () => React.createElement(CuteMango, { size: 105 }),
  },
  {
    id: 'mahua',
    hindi: 'महुआ',
    santhali: 'ᱢᱟᱹᱛᱠᱚᱢ',
    santhaliLatin: 'Matkom',
    english: 'Mahua Flower & Fruit',
    category: 'fruits',
    grade: 2,
    sampleSentenceHindi: 'महुआ का पेड़ हमारे गाँव में बहुत उपयोगी है।',
    sampleSentenceSanthali: 'ᱢᱟᱹᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱫᱚ ᱟᱞᱮ ᱟᱹᱛᱩ ᱨᱮ ᱟᱹᱰᱤ ᱠᱟᱹᱢᱤᱭᱟᱱ ᱠᱟᱱᱟ ᱾',
    didYouKnow: 'महुआ (ᱢᱟᱹᱛᱠᱚᱢ) का पेड़ आदिवासियों का कल्पवृक्ष माना जाता है; इसके फूल और फल बहुत उपयोगी हैं।',
  },
  {
    id: 'guava',
    hindi: 'अमरूद',
    santhali: 'ᱵᱮᱞ',
    santhaliLatin: 'Bel',
    english: 'Guava',
    category: 'fruits',
    grade: 1,
    sampleSentenceHindi: 'ताज़ा अमरूद सेहत के लिए अच्छा है।',
    sampleSentenceSanthali: 'ᱵᱮᱞ ᱡᱚ ᱫᱚ ᱦᱚᱲᱢᱚ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱥ ᱜᱮᱭᱟ ᱾',
    didYouKnow: 'अमरूद (ᱵᱮᱞ) में भरपूर विटामिन C होता है, जो बच्चों को स्वस्थ और ऊर्जावान रखता है।',
  },
  {
    id: 'banana',
    hindi: 'केला',
    santhali: 'ᱠᱟᱭᱨᱟ',
    santhaliLatin: 'Kayra',
    english: 'Banana',
    category: 'fruits',
    grade: 1,
    sampleSentenceHindi: 'पीला केला खाने में मीठा होता है।',
    sampleSentenceSanthali: 'ᱥᱟᱥᱟᱝ ᱠᱟᱭᱨᱟ ᱫᱚ ᱡᱚᱢ ᱨᱮ ᱦᱮᱲᱮᱢ-ᱟ ᱾',
    didYouKnow: 'संथाली पूजा-अर्चना और त्योहारों में केले के पत्तों और फलों का विशेष स्थान है।',
  },

  // 4. Vegetables (ᱩᱛᱩ ᱟᱲᱟᱜ)
  {
    id: 'potato',
    hindi: 'आलू',
    santhali: 'ᱟᱞᱩ',
    santhaliLatin: 'Alu',
    english: 'Potato',
    category: 'vegetables',
    grade: 1,
    sampleSentenceHindi: 'आलू सभी सब्जियों का राजा है।',
    sampleSentenceSanthali: 'ᱟᱞᱩ ᱫᱚ ᱡᱚᱛᱚ ᱩᱛᱩ ᱨᱮ ᱢᱮᱥᱟᱜ-ᱟ ᱾',
    didYouKnow: 'आलू जमीन के नीचे कंद के रूप में उगता है और ऊर्जा का बेहतरीन स्रोत है।',
  },
  {
    id: 'tomato',
    hindi: 'टमाटर',
    santhali: 'ᱵᱤᱞᱟᱹᱛᱤ',
    santhaliLatin: 'Bilati',
    english: 'Tomato',
    category: 'vegetables',
    grade: 1,
    sampleSentenceHindi: 'लाल टमाटर खट्टा-मीठा होता है।',
    sampleSentenceSanthali: 'ᱟᱨᱟᱜ ᱵᱤᱞᱟᱹᱛᱤ ᱫᱚ ᱡᱚᱡᱚ-ᱦᱮᱲᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ ᱾',
    didYouKnow: 'संथाली में टमाटर को "बिलाती" (ᱵᱤᱞᱟᱹᱛᱤ) कहा जाता है और यह दाल व सब्जी को स्वादिष्ट बनाता है।',
  },
  {
    id: 'greens',
    hindi: 'साग',
    santhali: 'ᱟᱲᱟᱜ',
    santhaliLatin: 'Arag',
    english: 'Leafy Greens (Saag)',
    category: 'vegetables',
    grade: 2,
    sampleSentenceHindi: 'झारखंड के जंगलों में कई तरह के पौष्टिक साग मिलते हैं।',
    sampleSentenceSanthali: 'ᱵᱤᱨ ᱨᱮ ᱟᱭᱢᱟ ᱞᱮᱠᱟᱱ ᱵᱮᱥ ᱟᱲᱟᱜ ᱧᱟᱢᱚᱜ-ᱟ ᱾',
    didYouKnow: 'संथाली भोजन में मथवा साग, कांदा साग और सरू साग स्वास्थ्य और प्राकृतिक पोषण के प्रतीक हैं।',
  },

  // 5. Body Parts (ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ)
  {
    id: 'eyes',
    hindi: 'आँख',
    santhali: 'ᱢᱮᱫ',
    santhaliLatin: 'Med',
    english: 'Eyes',
    category: 'body',
    grade: 1,
    sampleSentenceHindi: 'हम अपनी आँखों से सुंदर दुनिया देखते हैं।',
    sampleSentenceSanthali: 'ᱟᱵᱚ ᱢᱮᱫ ᱛᱮ ᱪᱮᱦᱨᱟ ᱫᱷᱟᱹᱨᱛᱤ ᱵᱚᱱ ᱧᱮᱞᱟ ᱾',
    didYouKnow: 'ओल चिकी में आँख को "मेद" (ᱢᱮᱫ) कहते हैं।',
  },
  {
    id: 'ear',
    hindi: 'कान',
    santhali: 'ᱞᱩᱛᱩᱨ',
    santhaliLatin: 'Lutur',
    english: 'Ear',
    category: 'body',
    grade: 1,
    sampleSentenceHindi: 'हम अपने कानों से मीठा संगीत सुनते हैं।',
    sampleSentenceSanthali: 'ᱟᱵᱚ ᱞᱩᱛᱩᱨ ᱛᱮ ᱥᱮᱨᱮᱧ ᱵᱚᱱ ᱟᱸᱡᱚᱢᱟ ᱾',
    didYouKnow: 'संथाली में कान को "लुतुड़" (ᱞᱩᱛᱩᱨ) कहते हैं।',
  },
  {
    id: 'hand',
    hindi: 'हाथ',
    santhali: 'ᱛᱤ',
    santhaliLatin: 'Ti',
    english: 'Hand',
    category: 'body',
    grade: 1,
    sampleSentenceHindi: 'हम अपने हाथों से लिखते और चित्र बनाते हैं।',
    sampleSentenceSanthali: 'ᱟᱵᱚ ᱛᱤ ᱛᱮ ᱚᱞ ᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱵᱚᱱ ᱵᱮᱱᱟᱣᱟ ᱾',
    didYouKnow: 'हाथ जोड़कर "जोहार" बोलना झारखंड की सबसे आत्मीय और सम्मानजनक परंपरा है।',
  },

  // 6. Family (ᱜᱷᱟᱨᱚᱸᱡᱽ)
  {
    id: 'mother',
    hindi: 'माँ',
    santhali: 'ᱟᱭᱳ',
    santhaliLatin: 'Ayo',
    english: 'Mother',
    category: 'family',
    grade: 1,
    sampleSentenceHindi: 'माँ हमें बहुत प्यार करती है।',
    sampleSentenceSanthali: 'ᱟᱭᱳ ᱫᱚ ᱟᱹᱰᱤ ᱫᱩᱞᱟᱹᱲ ᱮᱢᱟᱵᱚᱱᱟᱭ ᱾',
    didYouKnow: 'संथाली में माँ को "आयो" (ᱟᱭᱳ) कहते हैं। मातृभाषा (Ayo Arang) बच्चे का पहला विद्यालय है।',
  },
  {
    id: 'father',
    hindi: 'पिताजी',
    santhali: 'ᱵᱟᱵᱟ',
    santhaliLatin: 'Baba',
    english: 'Father',
    category: 'family',
    grade: 1,
    sampleSentenceHindi: 'पिताजी खेत में मेहनत करते हैं।',
    sampleSentenceSanthali: 'ᱵᱟᱵᱟ ᱫᱚ ᱠᱷᱮᱛ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟᱭ ᱾',
    didYouKnow: 'संथाली परिवार में बच्चों को प्रकृति और कृषि का पहला पाठ पिता से मिलता है।',
  },
  {
    id: 'friend',
    hindi: 'दोस्त',
    santhali: 'ᱜᱟᱛᱮ',
    santhaliLatin: 'Gate',
    english: 'Friend',
    category: 'family',
    grade: 1,
    sampleSentenceHindi: 'हम स्कूल में दोस्तों के साथ खेलते हैं।',
    sampleSentenceSanthali: 'ᱟᱞᱮ ᱟᱥᱲᱟ ᱨᱮ ᱜᱟᱛᱮ ᱠᱚ ᱥᱟᱞᱟᱜ ᱞᱮ ᱮᱱᱮᱡ-ᱟ ᱾',
    didYouKnow: 'संथाली में सच्चे मित्र को "गाते" (ᱜᱟᱛᱮ) कहा जाता है।',
  },

  // 7. Nature & Forest (ᱥᱤᱨᱡᱚᱱ)
  {
    id: 'forest',
    hindi: 'जंगल',
    santhali: 'ᱵᱤᱨ',
    santhaliLatin: 'Bir',
    english: 'Forest',
    category: 'nature',
    grade: 1,
    sampleSentenceHindi: 'झारखंड के जंगल हरे-भरे और सुंदर हैं।',
    sampleSentenceSanthali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱭᱟᱜ ᱵᱤᱨ ᱫᱚ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱜᱮᱭᱟ ᱾',
    didYouKnow: '"झारखंड" नाम का अर्थ ही है वनों और झाड़ियों की पवित्र भूमि (Bir Dishom)।',
  },
  {
    id: 'sal_tree',
    hindi: 'साल का पेड़ (सखुआ)',
    santhali: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ',
    santhaliLatin: 'Sarjom dare',
    english: 'Sal Tree',
    category: 'nature',
    grade: 2,
    sampleSentenceHindi: 'साल का पेड़ झारखंड का राज्य वृक्ष है।',
    sampleSentenceSanthali: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱹᱱᱟᱱ ᱫᱟᱨᱮ ᱠᱟᱱᱟ ᱾',
    didYouKnow: 'सरहुल और बाहा पर्व में साल के फूलों (ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ) की पूजा जाहेर थान में की जाती है।',
  },
  {
    id: 'water_river',
    hindi: 'नदी',
    santhali: 'ᱜᱟᱰᱟ',
    santhaliLatin: 'Gada',
    english: 'River',
    category: 'nature',
    grade: 1,
    sampleSentenceHindi: 'दामोदर और सुवर्णरेखा झारखंड की प्रमुख नदियाँ हैं।',
    sampleSentenceSanthali: 'ᱜᱟᱰᱟ ᱫᱟᱜ ᱛᱮ ᱟᱹᱛᱩ ᱦᱚᱲ ᱪᱟᱥ ᱠᱟᱹᱢᱤ ᱠᱚ ᱠᱚᱨᱟᱣᱟ ᱾',
    didYouKnow: 'संथाली में नदी को "गाडा" (ᱜᱟᱰᱟ) और बहते स्वच्छ पानी को "दाग" (ᱫᱟᱜ) कहते हैं।',
  },

  // 8. Numbers (ᱮᱞ)
  {
    id: 'num_one',
    hindi: 'एक',
    santhali: 'ᱢᱤᱫ',
    santhaliLatin: 'Mid',
    english: 'One (1)',
    category: 'numbers',
    grade: 1,
    sampleSentenceHindi: 'हमारे पास एक सूरज है।',
    sampleSentenceSanthali: 'ᱟᱵᱚᱣᱟᱜ ᱢᱤᱫᱴᱟᱝ ᱵᱮᱲᱟ ᱢᱮᱱᱟᱭᱟ ᱾',
    didYouKnow: 'ओल चिकी में अंक "१" को ᱑ लिखते हैं और "मिद" बोलते हैं।',
    renderIllustration: () => React.createElement(CountingBlocks, { size: 105 }),
  },
  {
    id: 'num_two',
    hindi: 'दो',
    santhali: 'ᱵᱟᱨ',
    santhaliLatin: 'Bar',
    english: 'Two (2)',
    category: 'numbers',
    grade: 1,
    sampleSentenceHindi: 'मेरी दो आँखें हैं।',
    sampleSentenceSanthali: 'ᱤᱧᱟᱜ ᱵᱟᱨᱭᱟ ᱢᱮᱫ ᱢᱮᱱᱟᱜ-ᱟ ᱾',
    didYouKnow: 'ओल चिकी में अंक "२" को ᱒ लिखते हैं और "बार" बोलते हैं।',
    renderIllustration: () => React.createElement(CountingBlocks, { size: 105 }),
  },
  {
    id: 'num_three',
    hindi: 'तीन',
    santhali: 'ᱯᱮ',
    santhaliLatin: 'Pe',
    english: 'Three (3)',
    category: 'numbers',
    grade: 1,
    sampleSentenceHindi: 'त्रिभुज में तीन कोने होते हैं।',
    sampleSentenceSanthali: 'ᱯᱮ-ᱠᱳᱬ ᱨᱮ ᱯᱮᱭᱟ ᱠᱳᱬ ᱛᱟᱦᱮᱸᱱᱟ ᱾',
    didYouKnow: 'ओल चिकी में अंक "३" को ᱓ लिखते हैं और "पे" बोलते हैं।',
    renderIllustration: () => React.createElement(CountingBlocks, { size: 105 }),
  },
  {
    id: 'num_five',
    hindi: 'पाँच',
    santhali: 'ᱢᱚᱬᱮ',
    santhaliLatin: 'Mone',
    english: 'Five (5)',
    category: 'numbers',
    grade: 1,
    sampleSentenceHindi: 'एक हाथ में पाँच उँगलियाँ होती हैं।',
    sampleSentenceSanthali: 'ᱢᱤᱫ ᱛᱤ ᱨᱮ ᱢᱚᱬᱮ ᱜᱚᱴᱟᱝ ᱠᱟᱹᱴᱩᱵ ᱛᱟᱦᱮᱸᱱᱟ ᱾',
    didYouKnow: 'ओल चिकी में अंक "५" को ᱕ लिखते हैं और "मोणे" बोलते हैं।',
    renderIllustration: () => React.createElement(CountingBlocks, { size: 105 }),
  },

  // 9. Colors (ᱨᱚᱝ)
  {
    id: 'red',
    hindi: 'लाल',
    santhali: 'ᱟᱨᱟᱜ',
    santhaliLatin: 'Arag',
    english: 'Red',
    category: 'colors',
    grade: 1,
    sampleSentenceHindi: 'पलाश का फूल लाल रंग का होता है।',
    sampleSentenceSanthali: 'ᱢᱩᱨᱩᱫ ᱵᱟᱦᱟ ᱫᱚ ᱟᱨᱟᱜ ᱜᱮᱭᱟ ᱾',
    didYouKnow: 'पलाश (ᱢᱩᱨᱩᱫ ᱵᱟᱦᱟ) झारखंड का राज्य पुष्प है, जो बसंत में जंगलों को लाल रंग से रंग देता है।',
  },
  {
    id: 'green',
    hindi: 'हरा',
    santhali: 'ᱦᱟᱹᱨᱭᱟᱹᱲ',
    santhaliLatin: 'Haryar',
    english: 'Green',
    category: 'colors',
    grade: 1,
    sampleSentenceHindi: 'पेड़ के पत्ते हरे होते हैं।',
    sampleSentenceSanthali: 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱫᱚ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱜᱮᱭᱟ ᱾',
    didYouKnow: 'संथाली में हरे रंग को "हर्याड़" (ᱦᱟᱹᱨᱭᱟᱹᱲ) कहते हैं, जो प्रकृति की संपन्नता का प्रतीक है।',
  },
  {
    id: 'white',
    hindi: 'सफेद',
    santhali: 'ᱯᱩᱸᱰ',
    santhaliLatin: 'Pund',
    english: 'White',
    category: 'colors',
    grade: 1,
    sampleSentenceHindi: 'सफेद बगुला तालाब किनारे बैठा है।',
    sampleSentenceSanthali: 'ᱯᱩᱸᱰ ᱵᱟᱹᱜᱩᱞᱟᱹ ᱫᱚ ᱯᱩᱠᱷᱨᱤ ᱫᱷᱟᱨᱮ ᱨᱮ ᱫᱩᱲᱩᱵ ᱟᱠᱟᱱᱟᱭ ᱾',
    didYouKnow: 'सोहराय भित्तिचित्रों में सफेद रंग के लिए प्राकृतिक सफेद मिट्टी (दूधिया मिट्टी) का प्रयोग होता है।',
  },

  // 10. Daily Objects (ᱫᱤᱱᱟᱹᱢ ᱡᱤᱱᱤᱥ)
  {
    id: 'pot',
    hindi: 'घड़ा / मटका',
    santhali: 'ᱴᱩᱠᱩᱡ',
    santhaliLatin: 'Tukuj',
    english: 'Earthen Water Pot',
    category: 'objects',
    grade: 1,
    sampleSentenceHindi: 'मिट्टी के घड़े का पानी ठंडा रहता है।',
    sampleSentenceSanthali: 'ᱦᱟᱥᱟ ᱴᱩᱠᱩᱡ ᱫᱟᱜ ᱫᱚ ᱨᱮᱭᱟᱲ ᱛᱟᱦᱮᱸᱱᱟ ᱾',
    didYouKnow: 'झारखंड के गाँवों में मिट्टी का मटका (ᱴᱩᱠᱩᱡ) प्राकृतिक फ्रिज की तरह शीतल जल देता है।',
  },
  {
    id: 'mat',
    hindi: 'चटाई',
    santhali: 'ᱯᱟᱹᱴᱤᱭᱟᱹ',
    santhaliLatin: 'Patiya',
    english: 'Woven Floor Mat',
    category: 'objects',
    grade: 1,
    sampleSentenceHindi: 'कक्षा में बच्चे चटाई पर बैठकर पढ़ते हैं।',
    sampleSentenceSanthali: 'ᱪᱟᱱᱟᱪ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱯᱟᱹᱴᱤᱭᱟᱹ ᱨᱮ ᱫᱩᱲᱩᱵ ᱠᱟᱛᱮ ᱠᱚ ᱯᱟᱲᱦᱟᱣ-ᱟ ᱾',
    didYouKnow: 'खजूर और घास से बनी सुंदर चटाई (ᱯᱟᱹᱴᱤᱭᱟᱹ) झारखंड की पारंपरिक हस्तशिल्प कला है।',
  },

  // 11. Festivals (ᱯᱟᱨᱟᱵᱽ)
  {
    id: 'sohrai',
    hindi: 'सोहराय',
    santhali: 'ᱥᱚᱦᱨᱟᱭ',
    santhaliLatin: 'Sohrai',
    english: 'Sohrai Harvest Festival',
    category: 'festivals',
    grade: 2,
    sampleSentenceHindi: 'सोहराय पर्व पर घरों की दीवारों पर सुंदर चित्र बनाए जाते हैं।',
    sampleSentenceSanthali: 'ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱵᱷᱤᱛ ᱨᱮ ᱪᱮᱦᱨᱟ ᱪᱤᱛᱟᱹᱨ ᱠᱚ ᱵᱮᱱᱟᱣᱟ ᱾',
    didYouKnow: 'सोहराय चित्रकला को भारत सरकार द्वारा GI टैग प्राप्त है और यह हजारीबाग व संथाल परगना में प्रसिद्ध है।',
  },
  {
    id: 'karam',
    hindi: 'करम पूजा',
    santhali: 'ᱠᱟᱨᱟᱢ',
    santhaliLatin: 'Karam',
    english: 'Karam Festival',
    category: 'festivals',
    grade: 2,
    sampleSentenceHindi: 'करम त्योहार पर भाई-बहन के प्रेम और प्रकृति की पूजा होती है।',
    sampleSentenceSanthali: 'ᱠᱟᱨᱟᱢ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱫᱟᱨᱮ ᱰᱟᱹᱨ ᱛᱚᱞ ᱠᱟᱛᱮ ᱠᱚ ᱮᱱᱮᱡ-ᱟ ᱾',
    didYouKnow: 'करम पर्व में करम वृक्ष की डाली को आँगन में स्थापित कर रातभर पारंपरिक गीतों पर नृत्य किया जाता है।',
  },
  {
    id: 'baha',
    hindi: 'बाहा पर्व (फूलों का त्योहार)',
    santhali: 'ᱵᱟᱦᱟ ᱯᱟᱨᱟᱵᱽ',
    santhaliLatin: 'Baha Parab',
    english: 'Baha Flower Festival',
    category: 'festivals',
    grade: 2,
    sampleSentenceHindi: 'बाहा पर्व संथाली नववर्ष और वसंत ऋतु का पावन त्योहार है।',
    sampleSentenceSanthali: 'ᱵᱟᱦᱟ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ ᱛᱮ ᱵᱚᱸᱜᱟ ᱠᱚ ᱥᱮᱵᱟ ᱠᱚᱣᱟ ᱾',
    didYouKnow: 'संथाली परंपरा में जब तक बाहा पर्व संपन्न नहीं होता, तब तक नए साल के फूलों का उपयोग नहीं किया जाता।',
  },

  // 12. School Objects (ᱟᱥᱲᱟ ᱡᱤᱱᱤᱥ)
  {
    id: 'book',
    hindi: 'किताब',
    santhali: 'ᱯᱩᱛᱷᱤ',
    santhaliLatin: 'Puthi',
    english: 'Story Book',
    category: 'school',
    grade: 1,
    sampleSentenceHindi: 'आज हम अच्छी कहानियों की किताब पढ़ेंगे।',
    sampleSentenceSanthali: 'ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱠᱟᱹᱦᱱᱤ ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣᱟ ᱾',
    didYouKnow: 'पंडित रघुनाथ मुर्मू जी ने 1925 में संथाली भाषा के लिए ओल चिकी लिपि तैयार की थी।',
    renderIllustration: () => React.createElement(StoryBook, { size: 105 }),
  },
  {
    id: 'pen',
    hindi: 'कलम',
    santhali: 'ᱠᱚᱞᱚᱢ',
    santhaliLatin: 'Kolom',
    english: 'Pen / Pencil',
    category: 'school',
    grade: 1,
    sampleSentenceHindi: 'मैं अपनी कलम से सुंदर अक्षर लिखता हूँ।',
    sampleSentenceSanthali: 'ᱤᱧ ᱠᱚᱞᱚᱢ ᱛᱮ ᱪᱮᱦᱨᱟ ᱚᱞ ᱤᱧ ᱚᱞᱟ ᱾',
    didYouKnow: 'संथाली में कलम को "कोलोम" (ᱠᱚᱞᱚᱢ) कहते हैं।',
  },
  {
    id: 'teacher',
    hindi: 'शिक्षक',
    santhali: 'ᱢᱟᱪᱮᱛ',
    santhaliLatin: 'Machet',
    english: 'Teacher',
    category: 'school',
    grade: 1,
    sampleSentenceHindi: 'हमारे शिक्षक बहुत प्यार से पढ़ाते हैं।',
    sampleSentenceSanthali: 'ᱟᱞᱮᱭᱤᱡ ᱢᱟᱪᱮᱛ ᱫᱚ ᱟᱹᱰᱤ ᱫᱩᱞᱟᱹᱲ ᱛᱮᱭ ᱯᱟᱲᱦᱟᱣ ᱞᱮᱭᱟ ᱾',
    didYouKnow: 'संथाली में शिक्षक को "माचेत" (ᱢᱟᱪᱮᱛ) कहते हैं, जो गाँव में शिक्षा की ज्योति जलाते हैं।',
  },

  // 13. Transportation (ᱜᱟᱹᱰᱤ)
  {
    id: 'bullock_cart',
    hindi: 'बैलगाड़ी',
    santhali: 'ᱥᱟᱜᱟᱲ',
    santhaliLatin: 'Sagar',
    english: 'Bullock Cart',
    category: 'transport',
    grade: 1,
    sampleSentenceHindi: 'गाँव में किसान बैलगाड़ी से फसल घर लाते हैं।',
    sampleSentenceSanthali: 'ᱟᱹᱛᱩ ᱨᱮ ᱦᱚᱲ ᱥᱟᱜᱟᱲ ᱛᱮ ᱦᱳᱲᱳ ᱠᱚ ᱟᱹᱜᱩᱭᱟ ᱾',
    didYouKnow: 'संथाली में पारंपरिक बैलगाड़ी को "सागाड़" (ᱥᱟᱜᱟᱲ) कहा जाता है।',
  },
  {
    id: 'bicycle',
    hindi: 'साइकिल',
    santhali: 'ᱥᱟᱭᱠᱮᱞ',
    santhaliLatin: 'Saykel',
    english: 'Bicycle',
    category: 'transport',
    grade: 1,
    sampleSentenceHindi: 'दीदी साइकिल चलाकर विद्यालय जाती है।',
    sampleSentenceSanthali: 'ᱫᱟᱹᱭ ᱥᱟᱭᱠᱮᱞ ᱛᱮ ᱟᱥᱲᱟ ᱥᱮᱱᱚᱜ-ᱟᱭ ᱾',
    didYouKnow: 'झारखंड सरकार की साइकिल योजना ने ग्रामीण बालिकाओं की विद्यालय उपस्थिति में भारी वृद्धि की है।',
  },

  // 14. Occupations (ᱠᱟᱹᱢᱤ)
  {
    id: 'farmer',
    hindi: 'किसान',
    santhali: 'ᱪᱟᱹᱥᱤ',
    santhaliLatin: 'Chasi',
    english: 'Farmer',
    category: 'occupations',
    grade: 1,
    sampleSentenceHindi: 'किसान हमारे लिए धान और फसलें उगाता है।',
    sampleSentenceSanthali: 'ᱪᱟᱹᱥᱤ ᱫᱚ ᱟᱵᱚ ᱞᱟᱹᱜᱤᱫ ᱦᱳᱲᱳᱭ ᱮᱨᱟ ᱾',
    didYouKnow: 'संथाली समाज में किसान को "चासी" (ᱪᱟᱹᱥᱤ) और अन्नदाता का सर्वोच्च सम्मान प्राप्त है।',
  },
  {
    id: 'potter',
    hindi: 'कुम्हार',
    santhali: 'ᱠᱩᱢᱦᱟᱹᱨ',
    santhaliLatin: 'Kumhar',
    english: 'Potter',
    category: 'occupations',
    grade: 2,
    sampleSentenceHindi: 'कुम्हार चाक पर मिट्टी के सुंदर बर्तन बनाता है।',
    sampleSentenceSanthali: 'ᱠᱩᱢᱦᱟᱹᱨ ᱫᱚ ᱦᱟᱥᱟ ᱨᱮᱭᱟᱜ ᱵᱟᱥᱚᱱ ᱮ ᱵᱮᱱᱟᱣᱟ ᱾',
    didYouKnow: 'मिट्टी के सुंदर बर्तनों पर सोहराय शैली की नक्काशी झारखंड की सांस्कृतिक पहचान है।',
  },
];

class FlashcardService {
  public getCardsByCategory(category: string): FlashcardData[] {
    const matched = CURRICULUM_FLASHCARDS.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );

    const source = matched.length > 0 ? matched : CURRICULUM_FLASHCARDS;

    return source.map((item) => ({
      id: item.id,
      hindi: item.hindi,
      santhali: item.santhali,
      santhaliLatin: item.santhaliLatin,
      english: item.english,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      illustration: item.renderIllustration
        ? item.renderIllustration()
        : React.createElement(CuteElephant, { size: 105 }),
      sampleSentenceHindi: item.sampleSentenceHindi,
      sampleSentenceSanthali: item.sampleSentenceSanthali,
      didYouKnow: item.didYouKnow,
      isMastered: false,
    }));
  }

  public getCardsByGrade(grade: number): FlashcardData[] {
    const matched = CURRICULUM_FLASHCARDS.filter((item) => item.grade <= grade);
    return matched.map((item) => ({
      id: item.id,
      hindi: item.hindi,
      santhali: item.santhali,
      santhaliLatin: item.santhaliLatin,
      english: item.english,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      illustration: item.renderIllustration
        ? item.renderIllustration()
        : React.createElement(CuteElephant, { size: 105 }),
      sampleSentenceHindi: item.sampleSentenceHindi,
      sampleSentenceSanthali: item.sampleSentenceSanthali,
      didYouKnow: item.didYouKnow,
      isMastered: false,
    }));
  }

  public filterCardsByMode(
    cards: FlashcardData[],
    mode: string,
    favoriteIds: string[],
    masteredIds: string[]
  ): FlashcardData[] {
    switch (mode) {
      case 'mastered':
        return cards.filter((c) => masteredIds.includes(c.id));
      case 'favorites':
        return cards.filter((c) => favoriteIds.includes(c.id));
      case 'needs_practice':
        return cards.filter((c) => !masteredIds.includes(c.id));
      case 'today':
      default:
        return cards;
    }
  }

  public generateQuizQuestions(category?: string) {
    const pool = category
      ? CURRICULUM_FLASHCARDS.filter((c) => c.category === category)
      : CURRICULUM_FLASHCARDS;

    const source = pool.length >= 2 ? pool : CURRICULUM_FLASHCARDS;

    return source.slice(0, 4).map((item, idx) => {
      // Find plausible distractor options from other cards
      const otherItems = CURRICULUM_FLASHCARDS.filter((c) => c.id !== item.id);
      const distractor1 = otherItems[(idx * 3) % otherItems.length]?.santhali || 'ᱦᱟᱹᱛᱤ';
      const distractor2 = otherItems[(idx * 5 + 1) % otherItems.length]?.santhali || 'ᱩᱞ';

      return {
        id: `quiz-${idx}-${item.id}`,
        promptAudio: `${item.santhali} (${item.santhaliLatin})`,
        promptHindi: `${item.hindi} (${item.english})`,
        instruction: `Match the correct Santali (Ol Chiki) word for "${item.hindi}":`,
        correctId: item.santhali,
        santhaliText: item.santhali,
        romanText: item.santhaliLatin,
        options: [
          { id: item.santhali, label: `${item.santhali} (${item.santhaliLatin})` },
          { id: distractor1, label: distractor1 },
          { id: distractor2, label: distractor2 },
        ].sort(() => 0.5 - Math.random()),
      };
    });
  }
}

export const flashcardService = new FlashcardService();
export default flashcardService;
