import { worksheetRepo, worksheetHistoryRepo } from '../../firebase/repository';
import type { WorksheetRecord, WorksheetHistoryRecord } from '../../firebase/types';

/**
 * 1. WORKSHEETS CRUD
 */

export async function saveWorksheet(
  worksheet: Omit<WorksheetRecord, 'id' | 'createdAt'>
): Promise<WorksheetRecord> {
  const id = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: WorksheetRecord = {
    ...worksheet,
    id,
    createdAt: Date.now(),
  };
  await worksheetRepo.save(record);
  return record;
}

export async function getWorksheetById(worksheetId: string): Promise<WorksheetRecord | null> {
  return worksheetRepo.getById(worksheetId);
}

export async function getWorksheetsByGrade(
  grade: string,
  subject?: string
): Promise<WorksheetRecord[]> {
  const list = await worksheetRepo.queryWhere('grade', '==', grade);
  if (list.length > 0) {
    if (subject) {
      return list.filter((w) => w.subject.toLowerCase().includes(subject.toLowerCase()));
    }
    return list;
  }

  // Pre-cached curriculum worksheets
  return [
    {
      id: 'ws-01',
      title: 'Jharkhand Wildlife & Domestic Animals Tracing',
      grade: 'Grade 2',
      subject: 'Tribal Language FLN',
      language: 'Santhali (Ol Chiki) + Hindi',
      topic: 'Animals',
      difficulty: 'Easy',
      nipunCompetency: 'L1/L2 Vocabulary Recognition',
      questionCount: 8,
      contentJson: JSON.stringify([
        { q: 'Match ᱦᱟᱹᱛᱤ (Hati) with Elephant illustration' },
        { q: 'Trace character ᱞ (La) in Ol Chiki script' },
      ]),
      answerKeyJson: JSON.stringify({ 1: 'Elephant', 2: 'La' }),
      createdBy: 'teacher-dumka-01',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'ws-02',
      title: 'Sohrai Folk Art Patterns & Numbers 1–10',
      grade: 'Grade 2',
      subject: 'Foundational Numeracy',
      language: 'Bilingual (Hindi + Santali)',
      topic: 'Counting',
      difficulty: 'Medium',
      nipunCompetency: 'FNN Number Sense 1-20',
      questionCount: 10,
      contentJson: JSON.stringify([
        { q: 'Count the fish in the Sohrai painting: ᱢᱚᱬᱮ (5)' },
      ]),
      answerKeyJson: JSON.stringify({ 1: '5' }),
      createdBy: 'teacher-dumka-01',
      createdAt: Date.now() - 86400000 * 2,
    },
  ];
}

export async function getWorksheetsByTeacher(teacherId: string): Promise<WorksheetRecord[]> {
  const list = await worksheetRepo.queryWhere('createdBy', '==', teacherId);
  if (list.length > 0) return list;
  return getWorksheetsByGrade('Grade 2');
}

export async function deleteWorksheet(worksheetId: string): Promise<void> {
  await worksheetRepo.delete(worksheetId);
}

/**
 * 2. WORKSHEET HISTORY & SUBMISSIONS
 */

export async function logWorksheetSubmission(
  entry: Omit<WorksheetHistoryRecord, 'id' | 'timestamp'>
): Promise<WorksheetHistoryRecord> {
  const id = `wsh_${entry.worksheetId}_${entry.studentId || 'class'}_${Date.now()}`;
  const record: WorksheetHistoryRecord = {
    ...entry,
    id,
    timestamp: Date.now(),
  };
  await worksheetHistoryRepo.save(record);
  return record;
}

export async function getWorksheetHistoryByStudent(
  studentId: string
): Promise<WorksheetHistoryRecord[]> {
  const list = await worksheetHistoryRepo.queryWhere('studentId', '==', studentId);
  return list;
}

export async function getWorksheetHistoryByClassroom(
  classroomId: string
): Promise<WorksheetHistoryRecord[]> {
  const list = await worksheetHistoryRepo.queryWhere('classroomId', '==', classroomId);
  return list;
}
