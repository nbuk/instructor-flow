import { Spinner } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';

import { AppRoutes, RouterPaths } from '@/app/providers/router/lib/config';
import { useAccount, UserRole } from '@/entities/account';
import { useAuth } from '@/features/auth';
import { CreateLessonPage } from '@/pages/instructor/create-lesson';
import { CreateScheduleByTemplatePage } from '@/pages/instructor/create-schedule';
import { CreateTemplatePage } from '@/pages/instructor/create-template';
import { InstructorHelloPage } from '@/pages/instructor/hello';
import { LessonInfoPage } from '@/pages/instructor/lesson-info';
import { LessonRequestsPage } from '@/pages/instructor/lesson-requests';
import { InstructorProfilePage } from '@/pages/instructor/profile';
import { InstructorSchedulePage } from '@/pages/instructor/schedule';
import { InstructorSettingsPage } from '@/pages/instructor/settings';
import { InstructorStudentsPage } from '@/pages/instructor/students';
import { TemplateInfoPage } from '@/pages/instructor/template-info';
import { InstructorTemplatesPage } from '@/pages/instructor/templates';
import { StudentHelloPage } from '@/pages/student/hello';
import { StudentInstructorPage } from '@/pages/student/instructor';
import { StudentUpcomingLessonsPage } from '@/pages/student/lessons';
import { StudentProfilePage } from '@/pages/student/profile';
import { StudentSchedulePage } from '@/pages/student/schedule';
import { StudentSettingsPage } from '@/pages/student/settings';
import { appRoutes } from '@/shared/configs/router';

import { MainLayout } from '../../../layouts/Main';

const RequireAuth: FC = () => {
  const { isAuth, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className={'w-full h-[100vh] flex items-center justify-center'}>
        <Spinner size={'l'} />
      </div>
    );
  if (!isAuth) return null;
  return <Outlet />;
};

const MainPageNavigator: FC = () => {
  const { data } = useAccount();
  if (!data) return null;
  if (data.role === UserRole.INSTRUCTOR) {
    return <Navigate to={appRoutes.instructor.schedule.main} replace />;
  }
  if (data.role === UserRole.STUDENT) {
    return <Navigate to={appRoutes.student.schedule} replace />;
  }
};

const InstructorRoutes: FC = () => {
  const { data, isLoading } = useAccount();
  if (isLoading) return null;
  if (data?.role !== UserRole.INSTRUCTOR) {
    return <Navigate to={appRoutes.student.schedule} replace />;
  }
  if (!data.profile.firstName) {
    return <Navigate to={appRoutes.instructor.hello} replace />;
  }
  return <Outlet />;
};

const InstructorHelloGuard: FC = () => {
  const { data, isLoading } = useAccount();
  if (isLoading) return null;
  if (data?.profile.firstName) {
    return <Navigate to={appRoutes.instructor.schedule.main} replace />;
  }
  return <Outlet />;
};

const StudentRoutes: FC = () => {
  const { data, isLoading } = useAccount();
  if (isLoading) return null;
  if (data?.role !== UserRole.STUDENT) {
    return <Navigate to={appRoutes.instructor.schedule.main} replace />;
  }
  if (!data.profile.firstName) {
    return <Navigate to={appRoutes.student.hello} replace />;
  }
  return <Outlet />;
};

const StudentHelloGuard: FC = () => {
  const { data, isLoading } = useAccount();
  if (isLoading) return null;
  if (data?.profile.firstName) {
    return <Navigate to={appRoutes.student.schedule} replace />;
  }
  return <Outlet />;
};

export const RouterProvider: FC = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route element={<MainPageNavigator />} path={'/'} />
          <Route element={<InstructorHelloGuard />}>
            <Route
              element={<InstructorHelloPage />}
              path={RouterPaths[AppRoutes.INSTRUCTOR_HELLO]}
            />
          </Route>
          <Route element={<InstructorRoutes />}>
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_SCHEDULE]}
              element={<InstructorSchedulePage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_CREATE_LESSON]}
              element={<CreateLessonPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_LESSON_REQUESTS]}
              element={<LessonRequestsPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_LESSON_INFO]}
              element={<LessonInfoPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_SETTINGS]}
              element={<InstructorSettingsPage />}
            />
            <Route
              path={
                RouterPaths[AppRoutes.INSTRUCTOR_CREATE_SCHEDULE_BY_TEMPLATE]
              }
              element={<CreateScheduleByTemplatePage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_SCHEDULE_TEMPLATES]}
              element={<InstructorTemplatesPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_CREATE_SCHEDULE_TEMPLATE]}
              element={<CreateTemplatePage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_SCHEDULE_TEMPLATE_INFO]}
              element={<TemplateInfoPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_STUDENTS]}
              element={<InstructorStudentsPage />}
            />
            <Route
              path={RouterPaths[AppRoutes.INSTRUCTOR_PROFILE]}
              element={<InstructorProfilePage />}
            />
          </Route>

          <Route element={<StudentHelloGuard />}>
            <Route
              element={<StudentHelloPage />}
              path={RouterPaths[AppRoutes.STUDENT_HELLO]}
            />
          </Route>
          <Route element={<StudentRoutes />}>
            <Route
              element={<Navigate to={appRoutes.student.schedule} />}
              path={'/'}
            />
            <Route
              element={<StudentSchedulePage />}
              path={RouterPaths[AppRoutes.STUDENT_SCHEDULE]}
            />
            <Route
              element={<StudentUpcomingLessonsPage />}
              path={RouterPaths[AppRoutes.STUDENT_LESSONS]}
            />
            <Route
              element={<StudentSettingsPage />}
              path={RouterPaths[AppRoutes.STUDENT_SETTINGS]}
            />
            <Route
              element={<StudentProfilePage />}
              path={RouterPaths[AppRoutes.STUDENT_PROFILE]}
            />
            <Route
              element={<StudentInstructorPage />}
              path={RouterPaths[AppRoutes.STUDENT_MY_INSTRUCTOR]}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
