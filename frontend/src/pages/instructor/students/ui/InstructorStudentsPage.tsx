import {
  Cell,
  List,
  Pagination,
  Section,
  Skeleton,
} from '@telegram-apps/telegram-ui';
import { Activity, type ChangeEvent, type FC, useState } from 'react';

import { useAccount, UserRole } from '@/entities/account';
import {
  type InstructorStudentProfile,
  useInstructorStudents,
} from '@/entities/instructor';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { BackButton } from '@/shared/ui/BackButton';
import { Input } from '@/shared/ui/Input';

import { StudentModal } from './StudentModal';

const InstructorStudentsPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [currentStudent, setCurrentStudent] =
    useState<InstructorStudentProfile | null>(null);

  const limit = 20;

  const { data, isLoading } = useInstructorStudents({
    instructorId: accountData?.profile.instructorId ?? '',
    limit,
    search: debouncedSearch,
    offset: limit * (page - 1),
    orderBy: 'createdAt',
    sort: 'desc',
  });
  const pagesCount = data ? Math.ceil(data.totalCount / limit) : 0;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const createStudentClickHandler = (student: InstructorStudentProfile) => {
    return () => {
      setCurrentStudent(student);
    };
  };

  const handleModalOpenChange = (open: boolean) => {
    if (open) return;
    setCurrentStudent(null);
  };

  return (
    <List className={'pb-20 flex-1 flex flex-col'}>
      <BackButton />

      <Activity mode={isLoading ? 'visible' : 'hidden'}>
        {new Array(5).fill('').map((_, i) => (
          <Skeleton
            key={i}
            className={'h-25 before:rounded-2xl after:rounded-2xl'}
          />
        ))}
      </Activity>

      <Section.Header>Ученики</Section.Header>
      <Section className={data?.data.length ? 'flex-1' : ''}>
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder={'Поиск...'}
          header={'Поиск...'}
        />
        {data?.data.map((student) => (
          <Cell
            key={student.id}
            multiline
            onClick={createStudentClickHandler(student)}
          >
            {`${student.lastName} ${student.firstName} ${student.middleName}`}
          </Cell>
        ))}
      </Section>
      <Activity
        mode={
          !search && !data?.data.length && !isLoading ? 'visible' : 'hidden'
        }
      >
        <Section.Footer className={'flex-1'} centered>
          У вас пока нет учеников
        </Section.Footer>
      </Activity>
      <Activity
        mode={
          !!search && !data?.data.length && !isLoading ? 'visible' : 'hidden'
        }
      >
        <Section.Footer className={'flex-1'} centered>
          Поиск не дал результатов
        </Section.Footer>
      </Activity>

      <Pagination
        className={'mx-auto'}
        page={page}
        // hidePrevButton={page === 1}
        // hideNextButton={!data?.hasMore}
        boundaryCount={5}
        siblingCount={5}
        count={pagesCount}
        onChange={(_, page) => setPage(page)}
      />

      <StudentModal
        student={currentStudent}
        onClose={() => setCurrentStudent(null)}
        onOpenChange={handleModalOpenChange}
      />
    </List>
  );
};

export default InstructorStudentsPage;
