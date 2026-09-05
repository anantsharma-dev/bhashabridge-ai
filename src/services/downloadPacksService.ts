import { sqliteEngine } from '../offline/sqliteEngine';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import { capacitorService } from './capacitor/capacitorService';

export type PackType = 'grade' | 'district' | 'audio' | 'story';
export type PackStatus = 'available' | 'downloading' | 'downloaded' | 'update';

export interface BasePack {
  id: string;
  packType: PackType;
  title: string;
  hindiTitle: string;
  sizeBytes: number;
  sizeFormatted: string;
  version: string;
  status: PackStatus;
  progressPercent: number;
  updatedAt: number;
  installedAt?: number;
}

export interface GradePack extends BasePack {
  packType: 'grade';
  grade: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';
  santaliTitle: string;
  languages: string[];
  lessonsCount: number;
  worksheetsCount: number;
  storiesCount: number;
  flashcardsCount: number;
}

export interface DistrictLanguagePack extends BasePack {
  packType: 'district';
  district: string;
  languages: string[];
  script: string;
  vocabularyCount: number;
  phrasesCount: number;
}

export interface AudioPack extends BasePack {
  packType: 'audio';
  voiceType: 'teacher' | 'child' | 'storyteller';
  language: string;
  sampleRate: string;
  modelFormat: 'Kokoro ONNX' | 'Piper Neural' | 'Wav2Vec2';
}

export interface StoryPack extends BasePack {
  packType: 'story';
  santaliTitle: string;
  theme: string;
  gradeLevel: string;
  pageCount: number;
  illustrationsCount: number;
  hasAudio: boolean;
}

export type DownloadablePack = GradePack | DistrictLanguagePack | AudioPack | StoryPack;

const INITIAL_GRADE_PACKS: GradePack[] = [
  {
    id: 'grade-pack-1',
    packType: 'grade',
    grade: 'Grade 1',
    title: 'Grade 1 Foundational MTB-MLE Starter Pack',
    hindiTitle: 'कक्षा १ बुनियादी बहुभाषी शिक्षण संकुल',
    santaliTitle: 'ᱯᱩᱭᱞᱩ ᱪᱟᱱᱟᱪ ᱮᱛᱚᱦᱚᱵ ᱥᱮᱪᱮᱫ ᱯᱩᱛᱷᱤ',
    languages: ['Hindi', 'Santali (Ol Chiki)', 'Mundari'],
    lessonsCount: 24,
    worksheetsCount: 18,
    storiesCount: 12,
    flashcardsCount: 48,
    sizeBytes: 42 * 1024 * 1024,
    sizeFormatted: '42 MB',
    version: '2026.1.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
  {
    id: 'grade-pack-2',
    packType: 'grade',
    grade: 'Grade 2',
    title: 'Grade 2 Bilingual Bridge Phonics & Numbers',
    hindiTitle: 'कक्षा २ द्विभाषी सेतु ध्वनिविज्ञान एवं गणित',
    santaliTitle: 'ᱫᱚᱥᱟᱨ ᱪᱟᱱᱟᱪ ᱨᱟᱦᱟ ᱟᱲᱟᱝ ᱟᱨ ᱞᱮᱠᱷᱟ',
    languages: ['Hindi', 'Santali (Ol Chiki)', 'Ho'],
    lessonsCount: 28,
    worksheetsCount: 22,
    storiesCount: 16,
    flashcardsCount: 64,
    sizeBytes: 58 * 1024 * 1024,
    sizeFormatted: '58 MB',
    version: '2026.1.1',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'grade-pack-3',
    packType: 'grade',
    grade: 'Grade 3',
    title: 'Grade 3 Reading Fluency & Folk Tales',
    hindiTitle: 'कक्षा ३ पठन प्रवाह एवं पारंपरिक लोककथाएँ',
    santaliTitle: 'ᱛᱮᱥᱟᱨ ᱪᱟᱱᱟᱪ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ',
    languages: ['Hindi', 'Santali', 'English Bridge'],
    lessonsCount: 30,
    worksheetsCount: 25,
    storiesCount: 20,
    flashcardsCount: 72,
    sizeBytes: 68 * 1024 * 1024,
    sizeFormatted: '68 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'grade-pack-4',
    packType: 'grade',
    grade: 'Grade 4',
    title: 'Grade 4 Environmental Studies & Culture',
    hindiTitle: 'कक्षा ४ पर्यावरण अध्ययन एवं जनजातीय संस्कृति',
    santaliTitle: 'ᱯᱩᱱᱟᱜ ᱪᱟᱱᱟᱪ ᱯᱚᱨᱤᱵᱮᱥ ᱟᱨ ᱞᱟᱠᱪᱟᱨ',
    languages: ['Hindi', 'Santali (Ol Chiki)', 'Kurukh'],
    lessonsCount: 32,
    worksheetsCount: 26,
    storiesCount: 14,
    flashcardsCount: 50,
    sizeBytes: 74 * 1024 * 1024,
    sizeFormatted: '74 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'grade-pack-5',
    packType: 'grade',
    grade: 'Grade 5',
    title: 'Grade 5 Multilingual Fluency & Grammar',
    hindiTitle: 'कक्षा ५ बहुभाषी प्रवीणता एवं व्यावहारिक व्याकरण',
    santaliTitle: 'ᱢᱚᱬᱮᱭᱟᱜ ᱪᱟᱱᱟᱪ ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱨᱚᱱᱚᱲ',
    languages: ['Hindi', 'Santali', 'English', 'Mundari'],
    lessonsCount: 36,
    worksheetsCount: 30,
    storiesCount: 18,
    flashcardsCount: 80,
    sizeBytes: 88 * 1024 * 1024,
    sizeFormatted: '88 MB',
    version: '2026.1.2',
    status: 'update',
    progressPercent: 0,
    installedAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
];

const INITIAL_DISTRICT_PACKS: DistrictLanguagePack[] = [
  {
    id: 'district-dumka',
    packType: 'district',
    district: 'Dumka (Santhal Pargana)',
    title: 'Dumka District Santali (Ol Chiki) Pack',
    hindiTitle: 'दुमका जिला संताली (ओल चिकी) भाषा संकुल',
    languages: ['Santali (Ol Chiki)', 'Hindi', 'Angika'],
    script: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    vocabularyCount: 2450,
    phrasesCount: 820,
    sizeBytes: 36 * 1024 * 1024,
    sizeFormatted: '36 MB',
    version: '2026.2.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now(),
  },
  {
    id: 'district-ranchi',
    packType: 'district',
    district: 'Ranchi & Khunti',
    title: 'Ranchi District Mundari & Kurukh Pack',
    hindiTitle: 'रांची व खूंटी जिला मुंडारी एवं कुड़ुख संकुल',
    languages: ['Mundari', 'Kurukh (Oraon)', 'Sadri', 'Hindi'],
    script: 'Devanagari & Tolong Siki',
    vocabularyCount: 1980,
    phrasesCount: 650,
    sizeBytes: 32 * 1024 * 1024,
    sizeFormatted: '32 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'district-west-singhbhum',
    packType: 'district',
    district: 'West Singhbhum (Chaibasa)',
    title: 'West Singhbhum Ho Language Pack',
    hindiTitle: 'पश्चिमी सिंहभूम (चाईबासा) हो भाषा संकुल',
    languages: ['Ho (Warang Chiti)', 'Santali', 'Hindi'],
    script: 'Warang Chiti (𑢹𑣉𑣉)',
    vocabularyCount: 1650,
    phrasesCount: 540,
    sizeBytes: 28 * 1024 * 1024,
    sizeFormatted: '28 MB',
    version: '2026.1.0',
    status: 'update',
    progressPercent: 0,
    installedAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
  {
    id: 'district-gumla',
    packType: 'district',
    district: 'Gumla & Simdega',
    title: 'Gumla District Kurukh & Kharia Pack',
    hindiTitle: 'गुमला व सिमडेगा जिला कुड़ुख एवं खड़िया संकुल',
    languages: ['Kurukh', 'Kharia', 'Sadri'],
    script: 'Tolong Siki & Devanagari',
    vocabularyCount: 1420,
    phrasesCount: 480,
    sizeBytes: 26 * 1024 * 1024,
    sizeFormatted: '26 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'district-pakur',
    packType: 'district',
    district: 'Pakur & Sahibganj',
    title: 'Pakur Border Malto & Santali Pack',
    hindiTitle: 'पाकुड़ व साहिबगंज माल्टो एवं संताली संकुल',
    languages: ['Santali (Ol Chiki)', 'Malto (Paharia)', 'Bangla'],
    script: 'Ol Chiki & Devanagari',
    vocabularyCount: 1580,
    phrasesCount: 510,
    sizeBytes: 30 * 1024 * 1024,
    sizeFormatted: '30 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
];

const INITIAL_AUDIO_PACKS: AudioPack[] = [
  {
    id: 'audio-kokoro-santali-teacher',
    packType: 'audio',
    voiceType: 'teacher',
    title: 'Kokoro ONNX Santali Female Teacher Voice (22kHz)',
    hindiTitle: 'कोकोरो न्यूरल संताली शिक्षिका आवाज़ मॉडल',
    language: 'Santali (Ol Chiki Phonics)',
    sampleRate: '22050 Hz',
    modelFormat: 'Kokoro ONNX',
    sizeBytes: 84 * 1024 * 1024,
    sizeFormatted: '84 MB',
    version: '1.2.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
  {
    id: 'audio-kokoro-santali-child',
    packType: 'audio',
    voiceType: 'child',
    title: 'Kokoro ONNX Santali Child Peer Voice (22kHz)',
    hindiTitle: 'कोकोरो न्यूरल संताली बाल सहपाठी आवाज़',
    language: 'Santali Natural Conversational',
    sampleRate: '22050 Hz',
    modelFormat: 'Kokoro ONNX',
    sizeBytes: 78 * 1024 * 1024,
    sizeFormatted: '78 MB',
    version: '1.1.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'audio-hindi-teacher',
    packType: 'audio',
    voiceType: 'teacher',
    title: 'NCERT Hindi Bilingual Phonics Audio Engine',
    hindiTitle: 'एनसीईआरटी हिंदी द्विभाषी ध्वनिविज्ञान मॉडल',
    language: 'Hindi (Clear Classroom Pronunciation)',
    sampleRate: '22050 Hz',
    modelFormat: 'Piper Neural',
    sizeBytes: 65 * 1024 * 1024,
    sizeFormatted: '65 MB',
    version: '1.0.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'audio-mundari-rhymes',
    packType: 'audio',
    voiceType: 'storyteller',
    title: 'Mundari & Ho Folk Rhymes & Oral Story Audio',
    hindiTitle: 'मुंडारी व हो लोकगीत एवं मौखिक कथा वाचन संग्रह',
    language: 'Mundari & Ho Acoustic',
    sampleRate: '16000 Hz',
    modelFormat: 'Piper Neural',
    sizeBytes: 48 * 1024 * 1024,
    sizeFormatted: '48 MB',
    version: '1.0.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
];

const INITIAL_STORY_PACKS: StoryPack[] = [
  {
    id: 'story-sohrai-festival',
    packType: 'story',
    title: 'Sohrai Cattle Festival Folk Tales & Art (5 Stories)',
    hindiTitle: 'सोहराय पर्व लोककथाएँ एवं भित्तिचित्र संग्रह',
    santaliTitle: 'ᱥᱚᱦᱨᱟᱭ ᱯᱚᱨᱚᱵᱽ ᱠᱟᱹᱦᱱᱤ ᱟᱨ ᱪᱤᱛᱟᱹᱨ',
    theme: 'Culture & Harvest Festivals',
    gradeLevel: 'Grade 1-3',
    pageCount: 40,
    illustrationsCount: 32,
    hasAudio: true,
    sizeBytes: 24 * 1024 * 1024,
    sizeFormatted: '24 MB',
    version: '2026.1.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
  {
    id: 'story-birsa-munda',
    packType: 'story',
    title: 'Birsa Munda: The Forest Guardian & Ulgulan Legends',
    hindiTitle: 'भगवान बिरसा मुंडा: उलगुलान एवं वन रक्षक गाथा',
    santaliTitle: 'ᱵᱤᱨᱥᱟᱹ ᱢᱩᱱᱰᱟᱹ ᱵᱤᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱩᱞᱜᱩᱞᱟᱱ',
    theme: 'Tribal History & Heroes',
    gradeLevel: 'Grade 3-5',
    pageCount: 36,
    illustrationsCount: 28,
    hasAudio: true,
    sizeBytes: 22 * 1024 * 1024,
    sizeFormatted: '22 MB',
    version: '2026.1.0',
    status: 'downloaded',
    progressPercent: 100,
    installedAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'story-saranda-wildlife',
    packType: 'story',
    title: 'Saranda Forest Animals: The Sacred Hornbill & Elephant',
    hindiTitle: 'सारंडा वन के वन्य जीव: पवित्र हॉर्नबिल और हाथी',
    santaliTitle: 'ᱥᱟᱨᱟᱱᱰᱟ ᱵᱤᱨ ᱡᱤᱭᱟᱹᱞᱤ: ᱦᱚᱨᱱᱵᱤᱞ ᱟᱨ ᱦᱟᱹᱛᱤ',
    theme: 'EVS & Forest Ecology',
    gradeLevel: 'Grade 2-4',
    pageCount: 32,
    illustrationsCount: 26,
    hasAudio: true,
    sizeBytes: 19 * 1024 * 1024,
    sizeFormatted: '19 MB',
    version: '2026.1.0',
    status: 'available',
    progressPercent: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'story-monsoon-paddy',
    packType: 'story',
    title: 'Paddy Sowing & Traditional Rain Songs of Chota Nagpur',
    hindiTitle: 'धान रोपाई एवं छोटानागपुर के पारम्परिक वर्षा गीत',
    santaliTitle: 'ᱦᱳᱲᱳ ᱨᱚᱦᱚᱭ ᱟᱨ ᱫᱟᱜ ᱥᱮᱨᱮᱧ ᱯᱩᱛᱷᱤ',
    theme: 'Agriculture & Community Life',
    gradeLevel: 'Grade 1-3',
    pageCount: 28,
    illustrationsCount: 22,
    hasAudio: true,
    sizeBytes: 16 * 1024 * 1024,
    sizeFormatted: '16 MB',
    version: '2026.1.1',
    status: 'update',
    progressPercent: 0,
    installedAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
  },
];

class DownloadPacksService {
  private listeners: (() => void)[] = [];
  private isInitialized = false;

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    await sqliteEngine.init();

    // Populate Grade Packs in SQLite if table is empty
    const gradeCount = await sqliteEngine.count('grade_packs');
    if (gradeCount === 0) {
      for (const pack of INITIAL_GRADE_PACKS) {
        await sqliteEngine.insert('grade_packs', pack as any);
      }
    }

    // Populate District Language Packs in SQLite if table is empty
    const districtCount = await sqliteEngine.count('district_language_packs');
    if (districtCount === 0) {
      for (const pack of INITIAL_DISTRICT_PACKS) {
        await sqliteEngine.insert('district_language_packs', pack as any);
      }
    }

    // Populate Audio Packs in SQLite if table is empty
    const audioCount = await sqliteEngine.count('audio_packs');
    if (audioCount === 0) {
      for (const pack of INITIAL_AUDIO_PACKS) {
        await sqliteEngine.insert('audio_packs', pack as any);
      }
    }

    // Populate Story Packs in SQLite if table is empty
    const storyCount = await sqliteEngine.count('story_packs');
    if (storyCount === 0) {
      for (const pack of INITIAL_STORY_PACKS) {
        await sqliteEngine.insert('story_packs', pack as any);
      }
    }

    this.isInitialized = true;
  }

  public async getGradePacks(): Promise<GradePack[]> {
    await this.init();
    return sqliteEngine.selectAll<GradePack>('grade_packs');
  }

  public async getDistrictLanguagePacks(): Promise<DistrictLanguagePack[]> {
    await this.init();
    return sqliteEngine.selectAll<DistrictLanguagePack>('district_language_packs');
  }

  public async getAudioPacks(): Promise<AudioPack[]> {
    await this.init();
    return sqliteEngine.selectAll<AudioPack>('audio_packs');
  }

  public async getStoryPacks(): Promise<StoryPack[]> {
    await this.init();
    return sqliteEngine.selectAll<StoryPack>('story_packs');
  }

  public async getAllPacks(): Promise<DownloadablePack[]> {
    const [grades, districts, audios, stories] = await Promise.all([
      this.getGradePacks(),
      this.getDistrictLanguagePacks(),
      this.getAudioPacks(),
      this.getStoryPacks(),
    ]);
    return [...grades, ...districts, ...audios, ...stories];
  }

  public async findPackById(packId: string): Promise<{ pack: DownloadablePack; table: string } | null> {
    await this.init();
    const tables = [
      { name: 'grade_packs', type: 'grade' },
      { name: 'district_language_packs', type: 'district' },
      { name: 'audio_packs', type: 'audio' },
      { name: 'story_packs', type: 'story' },
    ];

    for (const t of tables) {
      const p = await sqliteEngine.findById<DownloadablePack>(t.name, packId);
      if (p) return { pack: p, table: t.name };
    }
    return null;
  }

  // --- DOWNLOAD PACK WITH REALTIME PROGRESS & NOTIFICATION ---
  public async downloadPack(packId: string, onProgress?: (pct: number) => void): Promise<void> {
    const found = await this.findPackById(packId);
    if (!found) return;
    const { pack, table } = found;

    // Update status to downloading
    await sqliteEngine.update(table, packId, {
      status: 'downloading',
      progressPercent: 5,
    } as any);
    this.notify();

    // Step-by-step download progression
    for (let pct = 15; pct <= 100; pct += 20) {
      await new Promise((r) => setTimeout(r, 200));
      await sqliteEngine.update(table, packId, {
        progressPercent: pct,
      } as any);
      onProgress?.(pct);
      this.notify();
    }

    // Persist mock pack manifest into IndexedDB & Capacitor Filesystem
    const manifestPayload = JSON.stringify({
      packId,
      title: pack.title,
      version: pack.version,
      installedAt: Date.now(),
      sizeBytes: pack.sizeBytes,
    });

    await capacitorService.saveOfflineFile(`packs/${packId}.json`, manifestPayload, true);
    await indexedDbEngine.setItem('cachedBlobs', {
      id: `pack_${packId}`,
      blob: new Blob([manifestPayload], { type: 'application/json' }),
      mimeType: 'application/json',
      cachedAt: Date.now(),
    } as any);

    // Finalize state
    await sqliteEngine.update(table, packId, {
      status: 'downloaded',
      progressPercent: 100,
      installedAt: Date.now(),
    } as any);

    // Trigger local notification
    await capacitorService.showNotification(
      'Offline Pack Installed',
      `"${pack.title}" (${pack.sizeFormatted}) is now 100% ready for offline classroom use!`
    );

    this.notify();
  }

  public async updatePack(packId: string): Promise<void> {
    await this.downloadPack(packId);
  }

  public async deletePack(packId: string): Promise<void> {
    const found = await this.findPackById(packId);
    if (!found) return;
    const { table } = found;

    await sqliteEngine.update(table, packId, {
      status: 'available',
      progressPercent: 0,
      installedAt: undefined,
    } as any);

    await indexedDbEngine.deleteItem('cachedBlobs', `pack_${packId}`);
    this.notify();
  }

  public async getTotalInstalledBytes(): Promise<number> {
    const all = await this.getAllPacks();
    return all
      .filter((p) => p.status === 'downloaded')
      .reduce((sum, p) => sum + p.sizeBytes, 0);
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const downloadPacksService = new DownloadPacksService();
export default downloadPacksService;
