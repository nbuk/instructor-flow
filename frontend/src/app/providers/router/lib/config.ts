export const enum AppRoutes {
  INSTRUCTOR_HELLO = 'instructor-hello',
  INSTRUCTOR_SCHEDULE = 'instructor-schedule',
  INSTRUCTOR_CREATE_LESSON = 'instructor-create-lesson',
  INSTRUCTOR_LESSON_REQUESTS = 'instructor-lesson-requests',
  INSTRUCTOR_LESSON_INFO = 'instructor-lesson-info',
  INSTRUCTOR_SETTINGS = 'instructor-settings',
  INSTRUCTOR_STUDENTS = 'instructor-students',
  INSTRUCTOR_PROFILE = 'instructor-profile',

  STUDENT_HELLO = 'student-hello',
  STUDENT_SCHEDULE = 'student-schedule',
  STUDENT_LESSONS = 'student-lessons',
  STUDENT_PROFILE = 'student-profile',
  STUDENT_SETTINGS = 'student-settings',
  STUDENT_MY_INSTRUCTOR = 'student-my-instructor',
}

export const RouterPaths: Record<AppRoutes, string> = {
  [AppRoutes.INSTRUCTOR_HELLO]: '/instructor/hello',
  [AppRoutes.INSTRUCTOR_SCHEDULE]: '/instructor/schedule',
  [AppRoutes.INSTRUCTOR_CREATE_LESSON]: '/instructor/schedule/create',
  [AppRoutes.INSTRUCTOR_LESSON_REQUESTS]: '/instructor/requests',
  [AppRoutes.INSTRUCTOR_LESSON_INFO]: '/instructor/schedule/:lessonId',
  [AppRoutes.INSTRUCTOR_SETTINGS]: '/instructor/settings',
  [AppRoutes.INSTRUCTOR_PROFILE]: '/instructor/settings/profile',
  [AppRoutes.INSTRUCTOR_STUDENTS]: '/instructor/settings/students',

  [AppRoutes.STUDENT_HELLO]: '/student/hello',
  [AppRoutes.STUDENT_SCHEDULE]: '/student/schedule',
  [AppRoutes.STUDENT_LESSONS]: '/student/lessons',
  [AppRoutes.STUDENT_SETTINGS]: '/student/settings',
  [AppRoutes.STUDENT_MY_INSTRUCTOR]: '/student/settings/my-instructor',
  [AppRoutes.STUDENT_PROFILE]: '/student/settings/profile',
};
