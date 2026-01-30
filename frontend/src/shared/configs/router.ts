export const appRoutes = {
  instructor: {
    hello: '/instructor/hello',
    schedule: {
      main: '/instructor/schedule',
      createLesson: (date: Date) =>
        `/instructor/schedule/create?date=${date.toDateString()}`,
      lesson: (id: string) => `/instructor/schedule/${id}`,
      createByTemplate: `/instructor/schedule/create-by-template`,
    },
    requests: '/instructor/requests',
    settings: {
      main: '/instructor/settings',
      profile: '/instructor/settings/profile',
      students: '/instructor/settings/students',
      templates: {
        main: '/instructor/settings/templates',
        create: '/instructor/settings/templates/create',
        info: (templateId: string) =>
          `/instructor/settings/templates/${templateId}`,
      },
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
