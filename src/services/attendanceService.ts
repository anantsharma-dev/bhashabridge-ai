/**
 * BhashaBridge AI - Production Attendance Service
 * Provides classroom attendance tracking, batch Firestore writes, IndexedDB offline caching, and attendanceXP awards.
 */

export * from './attendance.service';
import {
  recordClassroomAttendance,
  getClassroomAttendanceByDate,
  listenToClassroomAttendance,
  getStudentAttendanceHistory,
  getStudentAttendancePercentage,
  type AttendanceSubmissionItem,
  type AttendanceDaySummary,
} from './attendance.service';

class AttendanceService {
  public async submitAttendance(
    teacherId: string,
    classroomId: string,
    records: AttendanceSubmissionItem[],
    dateStr?: string
  ): Promise<AttendanceDaySummary> {
    const res = await recordClassroomAttendance(teacherId, classroomId, records, dateStr);
    return res.summary;
  }

  public async getAttendanceByDate(classroomId: string, dateStr?: string) {
    return getClassroomAttendanceByDate(classroomId, dateStr);
  }

  public subscribeToClassroomAttendance(
    classroomId: string,
    dateStr: string,
    callback: (records: any[]) => void
  ) {
    return listenToClassroomAttendance(classroomId, dateStr, callback);
  }

  public async getStudentHistory(studentId: string, limitCount: number = 30) {
    return getStudentAttendanceHistory(studentId, limitCount);
  }

  public async getStudentAttendanceRate(studentId: string): Promise<number> {
    return getStudentAttendancePercentage(studentId);
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
