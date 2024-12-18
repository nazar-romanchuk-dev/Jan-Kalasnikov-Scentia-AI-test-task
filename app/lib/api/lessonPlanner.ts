import { LessonData } from '@components/LessonPlanner';
import { request } from './request';

export const sendLessonPlannerRequest = async (data: LessonData) => {
  const token = process.env.NEXT_PUBLIC_SCENTIA_API_TOKEN;
  const endpoint = 'ai_tools/lesson_planner';

  if (!token) {
    throw new Error('Authorization token is missing');
  }

  return request(endpoint, 'POST', data, token);
};
