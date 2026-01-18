import { z } from 'zod';

import type { StudentProfile } from '@/entities/student';

export const studentProfileSchema = z.object({
  firstName: z.string().min(2, 'Некорректное имя'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Некорректная фамилия'),
  phone: z
    .string()
    .regex(/\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/, 'Некорректный номер телефона'),
});

export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;

export const getDefaultValues = (
  profile?: StudentProfile,
): StudentProfileSchema => ({
  firstName: profile?.firstName ?? '',
  middleName: profile?.middleName ?? '',
  lastName: profile?.lastName ?? '',
  phone: profile?.phone ?? '',
});
