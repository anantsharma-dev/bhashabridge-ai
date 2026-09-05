import { useState, useEffect, useCallback } from 'react';
import type { Assignment } from '../types/quiz';
import { assignmentService } from '../services/assignment.service';

export interface UseAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createAssignment: (asg: Omit<Assignment, 'assignmentId'>) => Promise<string>;
}

export function useAssignments(classroomId?: string): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!classroomId) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const list = await assignmentService.getAssignmentsByClassroom(classroomId);
      setAssignments(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchAssignments();

    if (!classroomId) return;

    const unsub = assignmentService.listenToClassroomAssignments(classroomId, (items) => {
      setAssignments(items);
      setLoading(false);
    });

    return () => unsub();
  }, [classroomId, fetchAssignments]);

  const handleCreateAssignment = async (asg: Omit<Assignment, 'assignmentId'>) => {
    const id = await assignmentService.createAssignment(asg);
    await fetchAssignments();
    return id;
  };

  return {
    assignments,
    loading,
    error,
    refresh: fetchAssignments,
    createAssignment: handleCreateAssignment,
  };
}

export default useAssignments;
