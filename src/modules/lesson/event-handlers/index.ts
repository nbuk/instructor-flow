import { LessonRequestHandler } from './lesson-request.handler';
import { LessonRequestApprovedHandler } from './lesson-request-approved.handler';
import { LessonRequestCanceledHandler } from './lesson-request-canceled.handler';
import { LessonRequestRejectedHandler } from './lesson-request-rejected.handler';

export const eventHandlers = [
  LessonRequestHandler,
  LessonRequestRejectedHandler,
  LessonRequestApprovedHandler,
  LessonRequestCanceledHandler,
];
