export const appRoutes = {
  instructor: {
    hello: '/instructor/hello',
    schedule: {
      main: '/instructor/schedule',
      createLesson: (date: Date) =>
        `/instructor/schedule/create?date=${date.toDateString()}`,
      lesson: (id: string) => `/instructor/schedule/${id}`,
    },
    requests: '/instructor/requests',
    settings: {
      main: '/instructor/settings',
      profile: '/instructor/settings/profile',
      students: '/instructor/settings/students',
    },
  },
  student: {
    hello: '/student/hello',
    schedule: '/student/schedule',
    lessons: '/student/lessons',
    settings: {
      main: '/student/settings',
      profile: '/student/settings/profile',
      myInstructor: '/student/settings/my-instructor',
    },
  },
};
