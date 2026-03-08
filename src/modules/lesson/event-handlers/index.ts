import { LessonRequestHandler } from './lesson-request.handler';
import { LessonRequestApprovedHandler } from './lesson-request-approved.handler';
import { LessonRequestCanceledHandler } from './lesson-request-canceled.handler';
import { LessonRequestCanceledInstructorGroupHandler } from './lesson-request-canceled-instructor-group.handler';
import { LessonRequestRejectedHandler } from './lesson-request-rejected.handler';
import { LessonRequestRejectedInstructorGroupHandler } from './lesson-request-rejected-instructor-group.handler';

export const eventHandlers = [
  LessonRequestHandler,
  LessonRequestRejectedHandler,
  LessonRequestRejectedInstructorGroupHandler,
  LessonRequestApprovedHandler,
  LessonRequestCanceledHandler,
  LessonRequestCanceledInstructorGroupHandler,
];
